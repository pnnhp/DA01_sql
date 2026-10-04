// Exam-ready forecast: from how fast you're actually studying (lessons + study-guide reading over the last
// 14 days, rest days included), how well lesson checks are going, and how much revision is left, work out
// the date you'd be ready, compared with your exam date.
import { state, saveForecast } from './store.js';
import { LESSONS } from '../lessons/index.js';
import { READING, sectionKey } from '../content/reading.js';
import { buildPlan } from '../content/syllabus.js';

const DAY = 86400000;
const at0 = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const isoD = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
export const fmtDate = d => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const REVISION_H = 14; // study map: revision & mock exams

export function forecast() {
  const s = state(), today = at0(new Date()), now = Date.now();
  const lessons = LESSONS.filter(L => L.lo);
  // everything you've learned, with when
  const ev = [];
  for (const L of LESSONS) { const r = s.lessons[L.id]; if (r && r.done) ev.push({ t: typeof r.done === 'number' && r.done > 1e11 ? r.done : now, mins: L.mins, kind: 'lesson' }); }
  for (const m of READING) for (const sec of m.sections) { const t = s.reading[sectionKey(m.mod, sec.n)]; if (t) ev.push({ t, mins: sec.mins, kind: 'read' }); }
  const first = ev.length ? Math.min(...ev.map(e => e.t)) : now;
  const activeDays = Math.max(1, Math.floor((today - at0(first)) / DAY) + 1);
  const win = Math.min(14, activeDays), since = today.getTime() - (win - 1) * DAY;
  const recent = ev.filter(e => e.t >= since).reduce((a, e) => a + e.mins, 0);
  const speed = recent / win;                                   // learning minutes per day
  let answers = 0; for (let i = 0; i < win; i++) answers += s.days[isoD(today.getTime() - i * DAY)] || 0;
  const practice = answers / win;                               // ~1 min per practice question
  const effort = speed + practice;
  const studyDays = new Set(ev.map(e => isoD(e.t))).size;

  // what's left
  const lessonsLeft = lessons.filter(L => !(s.lessons[L.id] && s.lessons[L.id].done));
  const lessonMinsLeft = lessonsLeft.reduce((a, L) => a + L.mins, 0);
  let readTotal = 0, readLeft = 0, readDone = 0;
  for (const m of READING) for (const sec of m.sections) { readTotal += sec.mins; if (s.reading[sectionKey(m.mod, sec.n)]) readDone += sec.mins; else readLeft += sec.mins; }
  const checks = LESSONS.map(L => ({ L, r: s.lessons[L.id] })).filter(x => x.r && x.r.done && x.r.total);
  const avg = checks.length ? checks.reduce((a, x) => a + x.r.score / x.r.total, 0) / checks.length : null;
  const low = checks.filter(x => x.r.score / x.r.total < 0.6).map(x => x.L);
  const redoMins = low.reduce((a, L) => a + L.mins, 0) + (avg != null && avg < 0.8 ? lessonMinsLeft * (0.8 - avg) : 0);
  const learnLeft = lessonMinsLeft + readLeft + redoMins;
  const mocks = (s.history || []).filter(h => h.game === 'boss' && h.n >= 10);
  const lastMock = mocks.length ? mocks[0].acc : null;
  const revisionH = REVISION_H * (lastMock != null && lastMock < 75 ? 1.3 : 1);

  const exam = at0(s.settings.examDate);
  const { plan } = buildPlan(s.settings.examDate, at0(s.settings.planStart || today));
  const revStart = plan[plan.length - 1].start;
  const daysToRev = Math.max(1, Math.round((at0(revStart) - today) / DAY));
  const needPerDay = learnLeft / daysToRev;

  let learnDays = null, revDays = null, ready = null, spare = null, status = 'nodata';
  if (speed > 0) {
    learnDays = Math.ceil(learnLeft / speed);
    revDays = Math.ceil(revisionH * 60 / Math.max(effort, speed));
    ready = new Date(today.getTime() + (learnDays + revDays) * DAY);
    spare = Math.round((exam - ready) / DAY);
    status = spare >= 7 ? 'ontrack' : spare >= 0 ? 'close' : 'behind';
  }
  const f = {
    speed, practice, effort, win, activeDays, studyDays, early: studyDays < 3,
    lessonsLeft: lessonsLeft.length, lessonsTotal: lessons.length, lessonMinsLeft, readTotal, readDone, readLeft,
    avg, low, redoMins, learnLeft, lastMock, revisionH, learnDays, revDays, ready, spare, status, exam, revStart, daysToRev, needPerDay,
    earliestExam: ready ? new Date(ready.getTime() + 7 * DAY) : null,
    totalLearn: lessons.reduce((a, L) => a + L.mins, 0) + readTotal,
  };
  // one snapshot a day → trend
  if (ready) { const d = isoD(today); if (!s.forecasts[d] || s.forecasts[d].ready !== isoD(ready)) saveForecast(d, { ready: isoD(ready), spare, speed: Math.round(speed) }); }
  const weekAgo = Object.keys(s.forecasts).sort().filter(d => d <= isoD(today.getTime() - 6 * DAY)).pop();
  if (weekAgo && ready) { const then = new Date(s.forecasts[weekAgo].ready); f.trend = Math.round((then - ready) / DAY); f.trendFrom = weekAgo; }
  // progress series for the chart: % of all learning done, by day
  const start = at0(s.settings.planStart || first);
  const series = []; const sorted = [...ev].sort((a, b) => a.t - b.t);
  for (let d = Math.min(start.getTime(), at0(first).getTime()); d <= today.getTime(); d += DAY) {
    const done = sorted.filter(e => e.t < d + DAY).reduce((a, e) => a + e.mins, 0);
    series.push({ d, p: Math.min(1, done / f.totalLearn) });
  }
  f.series = series; f.planStart = start;
  return f;
}

export const STATUS = { ontrack: ['🟢', 'On track'], close: ['🟡', 'Cutting it close'], behind: ['🔴', 'Behind'], nodata: ['⚪', 'Not enough data yet'] };
