// Question engine. Every question belongs to a lesson (bank items, lesson check/pool questions,
// calculation generators and sort sets). Games only draw from lessons you've finished, so practice
// always matches what you've been taught. If none are finished yet (you chose "play anyway") it
// falls back to every lesson in the module.
import { BANK, SORTS } from '../content/bank.js';
import { GEN, GEN_LESSON } from '../content/generators.js';
import { MODULES, loModule } from '../content/syllabus.js';
import { LESSONS, lessonById } from '../lessons/index.js';
import { BOOK } from '../content/book/index.js';
import { weakness, lessonDone, state } from './store.js';

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export { shuffle };

// lessonId -> { concepts: [{lo,q,opts,ex,key}], gens: [name] }
const BY_LESSON = {};
const GAME_LESSONS = LESSONS.filter(L => L.lo); // the intro lesson has no syllabus LO
for (const L of LESSONS) BY_LESSON[L.id] = { concepts: [], gens: [] };
BANK.forEach(([lo, q, opts, ex, lesson], i) => BY_LESSON[lesson] && BY_LESSON[lesson].concepts.push({ lo, q, opts, ex, key: 'b' + i, lesson }));
for (const L of LESSONS) [...(L.check || []), ...(L.pool || [])].forEach(([q, opts, ex], k) => BY_LESSON[L.id].concepts.push({ lo: L.lo, q, opts, ex, key: `L${L.id}.${k}`, lesson: L.id }));
// Study-guide questions: plain text for games; ones with a scenario ("long") only appear where the scenario can be shown.
const plainText = h => String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
for (const set of BOOK) set.qs.forEach((x, i) => {
  const intro = x.intro || set.intro || '';
  if (BY_LESSON[x.lesson]) BY_LESSON[x.lesson].concepts.push({ lo: x.lo, q: plainText(x.q), opts: x.opts, ex: x.ex, key: `k:${set.id}.${i}`, lesson: x.lesson, book: set.title, intro, long: !!intro });
});
for (const [g, id] of Object.entries(GEN_LESSON)) if (BY_LESSON[id]) BY_LESSON[id].gens.push(g);
export { BY_LESSON };

let uid = 0;
const recent = [];
function prep(raw, lesson) {
  const order = shuffle([0, 1, 2, 3].slice(0, raw.opts.length));
  const les = lesson || raw.lesson;
  return { id: ++uid, lo: raw.lo, mod: raw.lo ? loModule(raw.lo) : 0, q: raw.q, intro: raw.intro || '', book: raw.book || '', opts: order.map(i => raw.opts[i]), a: order.indexOf(0), ex: raw.ex, gen: !!raw.gen, key: raw.key, lesson: les, lessonTitle: les && lessonById(les) ? lessonById(les).title : '' };
}

// A fresh calculation (new numbers every time); its memory key is the calculation type.
const genQ = (name, lesson) => prep({ ...GEN[name](), key: 'g:' + name }, lesson || GEN_LESSON[name]);

function weightedPick(items, wfn) {
  const ws = items.map(wfn); const tot = ws.reduce((a, b) => a + b, 0);
  let r = Math.random() * tot;
  for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

const locking = () => { try { return state().settings.lockLessons !== false; } catch (e) { return true; } };

// Lessons a game may use for these modules.
export function unlockedLessons(mods, all = false) {
  const inMods = GAME_LESSONS.filter(L => !mods || mods.includes(L.mod));
  if (all || !locking()) return inMods;
  const done = inMods.filter(L => lessonDone(L.id));
  return done.length ? done : inMods;
}
// Is there at least one finished lesson in this module?
export const moduleStarted = mod => GAME_LESSONS.some(L => L.mod === mod && lessonDone(L.id));

/**
 * Next question.
 * opts.mods: module ids to draw from (default all, weighted by exam weight)
 * opts.kind: 'any' | 'calc' | 'concept'
 * opts.maxOpt: prefer options no longer than this many chars
 * opts.all: ignore lesson locking (mock exam)
 * opts.lessons: restrict to these lesson ids
 */
export function nextQuestion(opts = {}) {
  const mods = opts.mods && opts.mods.length ? opts.mods : null;
  const kind = opts.kind || 'any';
  let lessons = opts.lessons ? opts.lessons.map(lessonById).filter(Boolean) : unlockedLessons(mods, opts.all);
  const usable = id => opts.long ? BY_LESSON[id].concepts : BY_LESSON[id].concepts.filter(c => !c.long);
  const has = L => kind === 'calc' ? BY_LESSON[L.id].gens.length : kind === 'concept' ? usable(L.id).length : BY_LESSON[L.id].gens.length + usable(L.id).length;
  let pool = lessons.filter(has);
  if (!pool.length) {
    if (kind !== 'any') return nextQuestion({ ...opts, kind: 'any' });
    pool = GAME_LESSONS.filter(L => (!mods || mods.includes(L.mod)) && has(L));
  }
  const modW = id => (MODULES.find(m => m.id === id) || { weight: 10 }).weight;
  const per = {}; for (const L of pool) per[L.mod] = (per[L.mod] || 0) + 1;
  const L = weightedPick(pool, x => (mods ? 1 : Math.sqrt(modW(x.mod)) / Math.sqrt(per[x.mod])) * weakness(x.lo));
  const set = BY_LESSON[L.id];
  const useCalc = set.gens.length && (kind === 'calc' || (kind === 'any' && (!usable(L.id).length || Math.random() < 0.45)));
  if (useCalc) return genQ(set.gens[Math.floor(Math.random() * set.gens.length)], L.id);
  const pool2 = usable(L.id);
  let idx = pool2.filter(c => !recent.includes(c.key));
  if (opts.maxOpt) { const short = idx.filter(c => c.opts.every(o => o.length <= opts.maxOpt)); if (short.length) idx = short; }
  if (!idx.length) idx = pool2;
  const c = idx[Math.floor(Math.random() * idx.length)];
  recent.push(c.key); if (recent.length > 60) recent.shift();
  return prep(c, L.id);
}

// A specific calculation type. If its lesson isn't unlocked yet, swap in an unlocked calc from the same module.
export function questionFor(genName) {
  const lesson = GEN_LESSON[genName], L = lessonById(lesson);
  if (L && locking() && !lessonDone(lesson) && moduleStarted(L.mod)) {
    const ok = unlockedLessons([L.mod]).filter(x => BY_LESSON[x.id].gens.length);
    if (ok.length) return nextQuestion({ lessons: ok.map(x => x.id), kind: 'calc' });
    return nextQuestion({ mods: [L.mod], kind: 'concept', maxOpt: 24 });
  }
  return genQ(genName, lesson);
}

// Sorting items for lane / slicing / drop games (only sets from finished lessons, if any).
function lockSorts(sets) {
  if (!locking()) return sets;
  const done = sets.filter(s => !s.lesson || lessonDone(s.lesson));
  return done.length ? done : sets;
}
export function sortSets(ids) { return lockSorts(SORTS.filter(s => !ids || ids.includes(s.id))); }
export function sortSetsForMods(mods) { return lockSorts(SORTS.filter(s => mods.includes(loModule(s.lo)))); }

// Build an exam paper weighted by module weightings (uses everything, like the real exam).
export function examPaper(n) {
  const out = [];
  const quota = MODULES.map(m => ({ id: m.id, k: Math.max(1, Math.round(n * m.weight / 100)) }));
  let total = quota.reduce((s, q) => s + q.k, 0);
  while (total > n) { const q = quota.sort((a, b) => b.k - a.k)[0]; q.k--; total--; }
  while (total < n) { quota.sort((a, b) => a.k - b.k)[0].k++; total++; }
  for (const q of quota) for (let i = 0; i < q.k; i++) out.push(nextQuestion({ mods: [q.id], all: true, long: true }));
  return shuffle(out);
}

// Questions for a lesson's end-of-lesson check: its own check questions plus a random mix from its pool,
// tagged bank questions and (if any) one fresh calculation.
export function lessonQuiz(id, n = 5) {
  const L = lessonById(id); if (!L) return [];
  const set = BY_LESSON[id];
  const own = (L.check || []).map(([q, opts, ex], k) => ({ lo: L.lo, q, opts, ex, key: `L${id}.${k}` }));
  const extra = shuffle(set.concepts.filter(c => !c.long && !own.some(o => o.q === c.q)));
  const out = shuffle(own).slice(0, Math.min(2, own.length)).map(c => prep(c, id));
  if (set.gens.length) out.push(genQ(set.gens[Math.floor(Math.random() * set.gens.length)], id));
  for (const c of extra) { if (out.length >= n) break; out.push(prep(c, id)); }
  for (const c of own) { if (out.length >= n) break; if (!out.some(o => o.q === c.q)) out.push(prep(c, id)); }
  return shuffle(out);
}

// ── Mistake re-tests
// Rebuild a question from its memory key (calculations come back with NEW numbers).
export function questionByKey(key, fallbackLesson) {
  if (key.startsWith('g:')) { const g = key.slice(2); if (GEN[g]) return genQ(g); }
  if (key.startsWith('sort:')) {
    const label = key.slice(5);
    for (const s of SORTS) {
      const it = s.items.find(x => x[0] === label); if (!it) continue;
      let cats = s.cats.map((c, i) => i).filter(i => i !== it[1]); cats = [it[1], ...shuffle(cats).slice(0, 3)];
      return prep({ lo: s.lo, q: `${s.title}: where does "${label}" belong?`, opts: cats.map(i => s.cats[i]), ex: `${it[2] || ''} → ${s.cats[it[1]]}`.replace(/^ → /, ''), key }, s.lesson);
    }
  }
  for (const set of Object.values(BY_LESSON)) { const c = set.concepts.find(x => x.key === key); if (c) return prep(c, c.lesson); }
  return fallbackLesson ? nextQuestion({ lessons: [fallbackLesson] }) : null;
}
// Sort-game items carry their lesson so mistakes can be remembered.
export function sortItemLesson(label) { const s = SORTS.find(x => x.items.some(i => i[0] === label)); return s ? s.lesson : null; }

// A short re-test: the questions you missed (fresh numbers for calculations) plus a "cousin" from the same lesson.
export function retestFor(topics, max = 8) {
  const out = [], seen = new Set();
  const per = Math.max(2, Math.ceil(max / Math.max(1, topics.length)));
  for (const t of topics) {
    const items = [...t.items].sort((a, b) => b.wrong - a.wrong).slice(0, per - 1);
    for (const m of items) { const q = questionByKey(m.key, t.lesson); if (q && !seen.has(q.q)) { seen.add(q.q); q.retestOf = m.key; out.push(q); } }
    for (let k = 0; k < 6; k++) { const q = nextQuestion({ lessons: [t.lesson], all: true, long: true }); if (!seen.has(q.q) && !t.items.some(m => m.key === q.key)) { seen.add(q.q); out.push(q); break; } }
    if (out.length >= max) break;
  }
  return shuffle(out.slice(0, max));
}
