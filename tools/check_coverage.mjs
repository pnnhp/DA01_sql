// Coverage checker: makes sure every game question is owned by a lesson that teaches it.
// Run: node tools/check_coverage.mjs        (exit code 1 on errors; warnings are printed only)
import { BANK, SORTS } from '../docs/js/content/bank.js';
import { GEN, GEN_LESSON } from '../docs/js/content/generators.js';
import { LESSONS } from '../docs/js/lessons/index.js';
import { BOOK } from '../docs/js/content/book/index.js';

const errors = [], warnings = [];
const ids = new Set();
for (const L of LESSONS) { if (ids.has(L.id)) errors.push(`duplicate lesson id ${L.id}`); ids.add(L.id); }

// 1. Everything maps to an existing lesson
BANK.forEach((b, i) => { if (!ids.has(b[4])) errors.push(`bank #${i} "${b[1]}" → missing lesson ${b[4]}`); });
for (const g of Object.keys(GEN)) if (!GEN_LESSON[g]) errors.push(`generator ${g} has no lesson`); else if (!ids.has(GEN_LESSON[g])) errors.push(`generator ${g} → missing lesson ${GEN_LESSON[g]}`);
for (const s of SORTS) if (!s.lesson || !ids.has(s.lesson)) errors.push(`sort set ${s.id} → missing lesson ${s.lesson}`);
const loOf = Object.fromEntries(LESSONS.map(L => [L.id, L.lo])), setIds = new Set();
for (const s of BOOK) {
  if (setIds.has(s.id)) errors.push(`duplicate book set ${s.id}`); setIds.add(s.id);
  s.qs.forEach((q, i) => {
    if (!ids.has(q.lesson)) errors.push(`book ${s.id}.${i} → missing lesson ${q.lesson}`);
    else if (loOf[q.lesson] !== q.lo) errors.push(`book ${s.id}.${i} lo ${q.lo} ≠ lesson lo ${loOf[q.lesson]}`);
    if (q.opts.length !== 4 || new Set(q.opts).size !== 4) errors.push(`book ${s.id}.${i}: bad options`);
    if (!q.ex) errors.push(`book ${s.id}.${i}: no explanation`);
  });
}

// 2. Question shape + enough questions per lesson
const text = L => L.slides.map(s => s.h + ' ' + s.b).join(' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').toLowerCase();
for (const L of LESSONS) {
  const qs = [...(L.check || []), ...(L.pool || [])];
  for (const q of qs) if (q[1].length !== 4 || new Set(q[1]).size !== 4) errors.push(`${L.id}: bad options in "${q[0]}"`);
  const n = qs.length + BANK.filter(b => b[4] === L.id).length + Object.values(GEN_LESSON).filter(x => x === L.id).length;
  if (n < 5) errors.push(`${L.id}: only ${n} questions (need ≥5)`);
  if (!L.check || L.check.length < 3) errors.push(`${L.id}: needs 3 check questions`);
}

// 3. Heuristic: key words of each correct answer should appear in its lesson's slides
const STOP = new Set('about above after again against because before being below between both could does doing during each from further having here into itself more most other ought over same should some such than that their them then there these they this those through under until very what when where which while with would your only also used uses using will been were make made than many much'.split(' '));
const words = s => (s.toLowerCase().match(/[a-z][a-z\-]{3,}/g) || []).filter(w => !STOP.has(w));
const stem = w => w.replace(/(ies|es|s|ing|ed|ly)$/, '');
let checked = 0, weak = 0;
const lessonText = Object.fromEntries(LESSONS.map(L => [L.id, text(L)]));
const lessonStems = Object.fromEntries(Object.entries(lessonText).map(([k, t]) => [k, new Set(words(t).map(stem))]));
const test = (lessonId, q, ans, where) => {
  const ws = words(ans); if (!ws.length) return; checked++;
  const hit = ws.filter(w => lessonStems[lessonId].has(stem(w)) || lessonText[lessonId].includes(w)).length / ws.length;
  if (hit < 0.5) { weak++; warnings.push(`${where} [${lessonId}] "${q}" → "${ans}" (${Math.round(hit * 100)}% of answer words found)`); }
};
BANK.forEach((b, i) => ids.has(b[4]) && test(b[4], b[1], b[2][0], `bank #${i}`));
for (const L of LESSONS) [...(L.check || []), ...(L.pool || [])].forEach(q => test(L.id, q[0], q[1][0], 'lesson'));
for (const s of BOOK) s.qs.forEach((q, i) => ids.has(q.lesson) && test(q.lesson, q.q.replace(/<[^>]+>/g, ''), q.opts[0], `book ${s.id}.${i}`));
for (const s of SORTS) if (ids.has(s.lesson)) for (const b of s.bins || []) test(s.lesson, `sort ${s.id}`, typeof b === 'string' ? b : (b.label || b.name || ''), 'sort bin');

console.log(`Book: ${BOOK.length} sets, ${BOOK.reduce((a, s) => a + s.qs.length, 0)} questions`);
console.log(`Lessons: ${LESSONS.length} · bank: ${BANK.length} · generators: ${Object.keys(GEN).length} · sort sets: ${SORTS.length}`);
console.log(`Keyword check: ${checked - weak}/${checked} answers clearly found in their lesson text.`);
if (warnings.length) { console.log(`\n⚠️  ${warnings.length} answers to eyeball:`); warnings.forEach(w => console.log('  ' + w)); }
if (errors.length) { console.log(`\n❌ ${errors.length} errors:`); errors.forEach(e => console.log('  ' + e)); process.exit(1); }
console.log('\n✅ Every question maps to a lesson.');
