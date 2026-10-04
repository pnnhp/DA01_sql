// Lesson catalogue + daily schedule (spreads each module's lessons across that module's block in the study plan).
import m1 from './m1.js'; import m2 from './m2.js'; import m3 from './m3.js'; import m4 from './m4.js';
import m5 from './m5.js'; import m6 from './m6.js'; import m7 from './m7.js';
import { buildPlan } from '../content/syllabus.js';

export const LESSONS = [...m1, ...m2, ...m3, ...m4, ...m5, ...m6, ...m7];
export const lessonById = id => LESSONS.find(l => l.id === id);
export const lessonsForModule = mod => LESSONS.filter(l => l.mod === mod);

const DAY = 86400000;
export const iso = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
const at0 = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

// Returns [{ id, date: 'YYYY-MM-DD', day }] for every lesson, plus the plan blocks.
export function lessonSchedule(examDate, planStart) {
  const start = at0(planStart || new Date());
  const { plan } = buildPlan(examDate, start);
  const out = [];
  for (const block of plan) {
    if (!block.mod) continue;
    const ls = LESSONS.filter(l => l.mod === block.mod || (block.mod === 1 && l.mod === 0));
    const days = Math.max(1, block.days);
    ls.forEach((l, k) => {
      const offset = Math.floor(k * days / ls.length);
      const d = new Date(at0(block.start).getTime() + offset * DAY);
      out.push({ id: l.id, date: iso(d), day: Math.round((at0(d) - start) / DAY) + 1 });
    });
  }
  return { items: out, plan, start };
}

// Lessons due today (including any overdue), in course order.
export function dueLessons(examDate, planStart, isDone) {
  const { items } = lessonSchedule(examDate, planStart); const today = iso(new Date());
  const due = items.filter(x => x.date <= today && !isDone(x.id));
  const doneToday = items.filter(x => x.date === today && isDone(x.id));
  const next = items.find(x => !isDone(x.id));
  return { due, doneToday, next, items, overdue: due.filter(x => x.date < today) };
}
