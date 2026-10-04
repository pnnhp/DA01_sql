// Question engine: picks the next question (weighted towards your weak spots) and shuffles options.
import { BANK, SORTS } from '../content/bank.js';
import { GEN, GEN_BY_LO } from '../content/generators.js';
import { MODULES, loModule } from '../content/syllabus.js';
import { weakness } from './store.js';

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export { shuffle };

let uid = 0;
const recent = [];
function prep(raw) {
  // raw: {lo, q, opts:[correct,...], ex}
  const order = shuffle([0, 1, 2, 3].slice(0, raw.opts.length));
  return { id: ++uid, lo: raw.lo, mod: loModule(raw.lo), q: raw.q, opts: order.map(i => raw.opts[i]), a: order.indexOf(0), ex: raw.ex, gen: !!raw.gen, key: raw.key };
}
const bankQ = i => { const [lo, q, opts, ex] = BANK[i]; return { lo, q, opts, ex, key: 'b' + i }; };

function weightedPick(items, wfn) {
  const ws = items.map(wfn); const tot = ws.reduce((a, b) => a + b, 0);
  let r = Math.random() * tot;
  for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

/**
 * Next question.
 * opts.mods: array of module ids to draw from (default all, weighted by exam weight)
 * opts.kind: 'any' | 'calc' | 'concept'
 * opts.maxOpt: prefer options no longer than this many chars (for on-target labels)
 */
export function nextQuestion(opts = {}) {
  const mods = opts.mods && opts.mods.length ? opts.mods : MODULES.map(m => m.id);
  const kind = opts.kind || 'any';
  // choose LO
  const los = MODULES.filter(m => mods.includes(m.id)).flatMap(m => Object.keys(m.los).map(lo => ({ lo, w: m.weight })));
  const pool = los.filter(({ lo }) => {
    const hasCalc = !!GEN_BY_LO[lo], hasBank = BANK.some(b => b[0] === lo);
    return kind === 'calc' ? hasCalc : kind === 'concept' ? hasBank : (hasCalc || hasBank);
  });
  if (!pool.length) return nextQuestion({ ...opts, kind: 'any' });
  const { lo } = weightedPick(pool, x => (opts.mods ? 1 : Math.sqrt(x.w)) * weakness(x.lo));
  const hasCalc = !!GEN_BY_LO[lo];
  const useCalc = kind === 'calc' || (kind === 'any' && hasCalc && Math.random() < 0.45);
  let raw;
  if (useCalc && hasCalc) {
    raw = GEN[GEN_BY_LO[lo][Math.floor(Math.random() * GEN_BY_LO[lo].length)]]();
  } else {
    let idx = BANK.map((b, i) => i).filter(i => BANK[i][0] === lo && !recent.includes(i));
    if (opts.maxOpt) { const short = idx.filter(i => BANK[i][2].every(o => o.length <= opts.maxOpt)); if (short.length) idx = short; }
    if (!idx.length) idx = BANK.map((b, i) => i).filter(i => BANK[i][0] === lo);
    const i = idx[Math.floor(Math.random() * idx.length)];
    recent.push(i); if (recent.length > 40) recent.shift();
    raw = bankQ(i);
  }
  return prep(raw);
}

export function questionFor(genName) { return prep(GEN[genName]()); }

// Sorting items for lane / slicing / drop games.
export function sortSets(ids) { return SORTS.filter(s => !ids || ids.includes(s.id)); }
export function sortSetsForMods(mods) { return SORTS.filter(s => mods.includes(loModule(s.lo))); }

// Build an exam paper weighted by module weightings.
export function examPaper(n) {
  const out = [];
  const quota = MODULES.map(m => ({ id: m.id, k: Math.max(1, Math.round(n * m.weight / 100)) }));
  let total = quota.reduce((s, q) => s + q.k, 0);
  while (total > n) { const q = quota.sort((a, b) => b.k - a.k)[0]; q.k--; total--; }
  while (total < n) { quota.sort((a, b) => a.k - b.k)[0].k++; total++; }
  for (const q of quota) for (let i = 0; i < q.k; i++) out.push(nextQuestion({ mods: [q.id] }));
  return shuffle(out);
}
