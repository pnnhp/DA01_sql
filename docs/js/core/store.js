// Progress, mastery, ranks and the rival bot ("Ghost") — all saved on this device.
import { MODULES, ALL_LOS, loModule } from '../content/syllabus.js';

const KEY = 'costcommando.v1';
const DAY = 86400000;
const localIso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const BOT_LEVELS = {
  chill: { label: 'Chill', rate: 0.035 },
  steady: { label: 'Steady', rate: 0.06 },
  sharp: { label: 'Sharp', rate: 0.095 },
};

function blank() {
  return {
    v: 1,
    profile: { name: '', id: Math.random().toString(36).slice(2, 10), created: Date.now() },
    settings: { sound: true, music: true, examDate: '2027-01-25', botLevel: 'steady', botName: 'Ghost', haptics: true, lockLessons: true, planStart: localIso(new Date()) },
    lessons: {},       // lessonId -> { done: time, score, total }
    los: {},           // lo -> { acc, n, last }  (EMA accuracy, attempts, last practice time)
    bot: { los: {} },  // lo -> { m (knowledge 0..1), acc, n, last }
    xp: 0, coins: 0,
    streak: { days: 0, lastDay: '' },
    days: {},          // 'YYYY-MM-DD' -> answers that day
    history: [],       // recent games
    best: {},
    friends: [],       // {id, name, readiness, xp, rank, updated}
    seenCards: {},
    mistakes: {},      // question key -> { key, lesson, lo, q, ans, ex, picked, wrong, right, streak, last, first }
    retests: [],       // { at, lessons, score, total }
    book: {},          // study-guide set id -> { best, last, total, at, tries }
  };
}

let S = load();
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const b = blank(), o = JSON.parse(raw); const out = Object.assign(b, o); out.settings = Object.assign(blank().settings, o.settings || {}); out.lessons = o.lessons || {}; out.mistakes = o.mistakes || {}; out.retests = o.retests || []; out.book = o.book || {}; return out; }
  } catch (e) { /* storage unavailable */ }
  return blank();
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }
export const state = () => S;
export function reset() { S = blank(); save(); }
export function exportCode() { return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
export function importCode(code) {
  const obj = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  if (!obj || obj.v !== 1) throw new Error('Not a Cost Commando save code');
  S = Object.assign(blank(), obj); save();
}

const today = () => localIso(new Date());

// Forgetting: mastery fades slowly if a topic isn't revisited (encourages spaced review).
function decay(last) { if (!last) return 1; const d = (Date.now() - last) / DAY; return d < 3 ? 1 : Math.max(0.55, Math.exp(-(d - 3) / 60)); }
function confidence(n) { return Math.min(1, n / 12); }

export function loMastery(lo, who = 'me') {
  const r = who === 'me' ? S.los[lo] : S.bot.los[lo];
  if (!r || !r.n) return 0;
  return Math.max(0, Math.min(1, r.acc * confidence(r.n) * decay(r.last)));
}
export function moduleMastery(mod, who = 'me') {
  const los = Object.keys(MODULES.find(m => m.id === mod).los);
  return los.reduce((s, lo) => s + loMastery(lo, who), 0) / los.length;
}
// Exam readiness = mastery weighted by exam weighting (0..100).
export function readiness(who = 'me') {
  return Math.round(MODULES.reduce((s, m) => s + m.weight * moduleMastery(m.id, who), 0));
}
export function predictedScore(who = 'me') { return Math.round(25 + 0.75 * readiness(who)); }

export const RANKS = [
  { min: 0, name: 'Intern', icon: '🎒' }, { min: 8, name: 'Accounts Clerk', icon: '🧾' }, { min: 18, name: 'Junior Accountant', icon: '📒' },
  { min: 30, name: 'Cost Accountant', icon: '🧮' }, { min: 45, name: 'Management Accountant', icon: '📊' }, { min: 58, name: 'Senior Analyst', icon: '📈' },
  { min: 70, name: 'Financial Controller', icon: '🏦' }, { min: 82, name: 'CFO', icon: '👔' }, { min: 92, name: 'CPA Legend', icon: '🏆' },
];
export function rankFor(r) { let out = RANKS[0]; for (const k of RANKS) if (r >= k.min) out = k; return out; }
export function level(xp = S.xp) { return Math.floor(Math.sqrt(xp / 60)) + 1; }
export function levelProgress(xp = S.xp) { const l = level(xp); const a = 60 * (l - 1) ** 2, b = 60 * l ** 2; return (xp - a) / (b - a); }

// Bot accuracy on a LO: guesses (25%) until it learns.
export function botAccuracy(lo) { const m = (S.bot.los[lo] || {}).m || 0; return 0.25 + 0.72 * m; }

// Record one answered question for the player; the bot studies the same thing at a "typical learner" pace.
export function record(lo, correct) {
  if (!lo) return;
  const now = Date.now();
  const r = S.los[lo] || (S.los[lo] = { acc: 0, n: 0, last: 0 });
  r.n++; r.acc = r.n === 1 ? (correct ? 1 : 0) : r.acc + 0.18 * ((correct ? 1 : 0) - r.acc); r.last = now;

  const b = S.bot.los[lo] || (S.bot.los[lo] = { m: 0, acc: 0, n: 0, last: 0 });
  const rate = BOT_LEVELS[S.settings.botLevel]?.rate || 0.06;
  b.m = Math.min(0.97, b.m + rate * (0.6 + Math.random() * 0.8) * (1 - b.m));
  const botCorrect = Math.random() < botAccuracy(lo);
  b.n++; b.acc = b.n === 1 ? (botCorrect ? 1 : 0) : b.acc + 0.18 * ((botCorrect ? 1 : 0) - b.acc); b.last = now;

  const d = today(); S.days[d] = (S.days[d] || 0) + 1;
  if (S.streak.lastDay !== d) {
    const y = localIso(new Date(Date.now() - DAY));
    S.streak.days = S.streak.lastDay === y ? S.streak.days + 1 : 1; S.streak.lastDay = d;
  }
  save();
  return botCorrect;
}

export function addXP(n) { S.xp += Math.max(0, Math.round(n)); S.coins += Math.round(n / 10); save(); }
export function logGame(entry) {
  S.history.unshift({ t: Date.now(), ...entry }); S.history = S.history.slice(0, 60);
  if (entry.score != null && (S.best[entry.game] || 0) < entry.score) S.best[entry.game] = entry.score;
  save();
}

// Weakness weight for choosing what to practise next (low mastery & stale topics get picked more).
export function weakness(lo) {
  const m = loMastery(lo); const r = S.los[lo];
  const stale = r ? Math.min(1, (Date.now() - r.last) / (7 * DAY)) : 1;
  return 0.25 + (1 - m) * 1.2 + stale * 0.35;
}
export function weakestLOs(k = 5) {
  return [...ALL_LOS].sort((a, b) => loMastery(a) - loMastery(b) || (S.los[a]?.n || 0) - (S.los[b]?.n || 0)).slice(0, k);
}

export function snapshot() {
  const r = readiness();
  return { id: S.profile.id, name: S.profile.name || 'Player', readiness: r, xp: S.xp, rank: rankFor(r).name, mods: MODULES.map(m => Math.round(moduleMastery(m.id) * 100)), updated: Date.now() };
}
export function upsertFriend(snap) {
  if (!snap || !snap.id || snap.id === S.profile.id) return;
  const i = S.friends.findIndex(f => f.id === snap.id);
  if (i >= 0) S.friends[i] = snap; else S.friends.push(snap);
  save();
}
export function leaderboard() {
  const me = snapshot();
  const botR = readiness('bot');
  const bot = { id: 'bot', name: `🤖 ${S.settings.botName}`, readiness: botR, xp: null, rank: rankFor(botR).name, bot: true };
  return [{ ...me, me: true }, bot, ...S.friends].sort((a, b) => b.readiness - a.readiness);
}
// ── lessons
export function lessonDone(id) { return !!(S.lessons[id] && S.lessons[id].done); }
export function markLesson(id, score, total) {
  const first = !lessonDone(id);
  S.lessons[id] = { done: Date.now(), score, total };
  const d = today(); S.days[d] = (S.days[d] || 0) + 1;
  if (S.streak.lastDay !== d) { const y = localIso(new Date(Date.now() - DAY)); S.streak.days = S.streak.lastDay === y ? S.streak.days + 1 : 1; S.streak.lastDay = d; }
  if (first) addXP(40); else save();
  return first;
}
// ── Mistake memory: remembers every question you get wrong until you get it right twice in a row.
export const FIXED_AFTER = 2;
export function remember(q, ok, picked) {
  if (!q || !q.key || !q.lesson) return;
  const m = S.mistakes[q.key];
  if (!ok) {
    const e = m || (S.mistakes[q.key] = { key: q.key, lesson: q.lesson, lo: q.lo, wrong: 0, right: 0, streak: 0, first: Date.now() });
    Object.assign(e, { q: q.q, intro: q.intro || '', ans: q.opts[q.a], ex: q.ex || '', picked: picked != null && picked >= 0 ? q.opts[picked] : '', lesson: q.lesson, lo: q.lo });
    e.wrong++; e.streak = 0; e.last = Date.now(); e.fixedAt = 0;
  } else if (m) {
    m.right++; m.streak++; m.last = Date.now(); if (m.streak >= FIXED_AFTER && !m.fixedAt) m.fixedAt = Date.now();
  }
  save();
}
export const mistakeStatus = m => m.streak >= FIXED_AFTER ? 'fixed' : m.streak > 0 ? 'improving' : 'shaky';
export function activeMistakes(lesson) { return Object.values(S.mistakes).filter(m => mistakeStatus(m) !== 'fixed' && (!lesson || m.lesson === lesson)); }
// Lessons you keep getting wrong, worst first: [{ lesson, items, score, wrong }]
export function weakTopics(k = 50) {
  const by = {};
  for (const m of activeMistakes()) {
    const t = by[m.lesson] || (by[m.lesson] = { lesson: m.lesson, items: [], score: 0, wrong: 0 });
    const ageDays = (Date.now() - (m.last || 0)) / DAY;
    t.items.push(m); t.wrong += m.wrong; t.score += m.wrong * (m.streak ? 0.5 : 1) * (1 + 1 / (1 + ageDays));
  }
  return Object.values(by).sort((a, b) => b.score - a.score).slice(0, k);
}
export function fixedCount() { return Object.values(S.mistakes).filter(m => mistakeStatus(m) === 'fixed').length; }
export function logRetest(entry) { S.retests.unshift({ at: Date.now(), ...entry }); S.retests = S.retests.slice(0, 60); save(); }

// ── Study-guide (book) practice results
export function bookResult(id, score, total) {
  const r = S.book[id] || (S.book[id] = { best: 0, last: 0, total, tries: 0 });
  r.last = score; r.total = total; r.best = Math.max(r.best, score); r.tries++; r.at = Date.now(); save();
}
export const bookStat = id => S.book[id] || null;

export { BOT_LEVELS, loModule };
