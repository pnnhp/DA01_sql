// Procedural calculation questions. Every call creates fresh numbers so answers can't be memorised.
// Distractors are built from the classic mistakes examiners use (wrong base, wrong sign, wrong formula).

const R = (a, b, step = 1) => a + step * Math.floor(Math.random() * (Math.floor((b - a) / step) + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const fmt = (n, dp = 0) => {
  const neg = n < 0; n = Math.abs(n);
  const s = n.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  return (neg ? '-' : '') + s;
};
const $ = (n, dp = 0) => (n < 0 ? '-$' : '$') + fmt(Math.abs(n), dp);
const FU = n => `${$(Math.abs(Math.round(n)))} ${n >= 0 ? 'F' : 'U'}`; // positive = favourable
const pct = (n, dp = 1) => `${fmt(n, dp)}%`;

// Build a question with unique options. `c` = correct label, `w` = candidate wrong labels.
function Q(lo, q, c, w, ex, extra = {}) {
  const opts = [c];
  for (const x of w) if (x != null && !opts.includes(x) && opts.length < 4) opts.push(x);
  let guard = 0;
  while (opts.length < 4 && guard++ < 60) {
    const alt = extra.fill && guard < 30 ? extra.fill() : perturb(c);
    if (alt && !opts.includes(alt)) opts.push(alt);
  }
  while (opts.length < 4) opts.push(c + ' ' + '​'.repeat(opts.length)); // ultra-rare fallback
  return { lo, q, opts, ex, gen: true, ...extra, fill: undefined };
}
// Make a plausible wrong option by scaling the first number in the correct label (keeps $ , % and decimals).
function perturb(label) {
  const m = label.match(/(\d[\d,]*)(\.\d+)?/); if (!m) return null;
  const dp = m[2] ? m[2].length - 1 : 0, v = parseFloat(m[0].replace(/,/g, ''));
  const f = pick([0.5, 0.75, 0.8, 0.9, 1.1, 1.2, 1.25, 1.5, 2]);
  let nv = v * f; nv = dp ? nv : Math.round(nv); if (nv === v) nv = v + (dp ? 0.5 : Math.max(1, Math.round(v * 0.1)));
  return label.replace(m[0], fmt(nv, dp));
}
const jitter$ = (v, dp = 0) => () => $(Math.round(v * (0.6 + Math.random() * 0.8) * 10 ** dp) / 10 ** dp, dp);
const jitterFU = v => () => FU(Math.round(v * (0.5 + Math.random())) * (Math.random() < .5 ? 1 : -1));

// ───────────────────────── MODULE 2 ─────────────────────────
function highLowData() {
  const vc = R(2, 12) + pick([0, 0.5]);
  const fc = R(20, 90, 5) * 1000;
  const n = 5;
  const acts = new Set(); while (acts.size < n) acts.add(R(10, 60) * 1000);
  const units = [...acts];
  // add noise so highest COST is not at highest ACTIVITY sometimes (trap)
  const rows = units.map(u => ({ u, c: fc + vc * u }));
  const lowI = units.indexOf(Math.min(...units)), highI = units.indexOf(Math.max(...units));
  const others = rows.filter((_, i) => i !== lowI && i !== highI);
  const trap = pick(others); trap.c = Math.max(...rows.map(r => r.c)) + R(2, 8) * 1000; // a costly but not highest-activity period
  return { vc, fc, rows, lo: rows[lowI], hi: rows[highI] };
}
const table = rows => rows.map((r, i) => `P${i + 1}: ${fmt(r.u)} units = ${$(r.c)}`).join(' · ');

export const GEN = {
  highlow_vc() {
    const d = highLowData();
    const maxC = d.rows.reduce((a, b) => b.c > a.c ? b : a), minC = d.rows.reduce((a, b) => b.c < a.c ? b : a);
    const wrong1 = (maxC.c - minC.c) / (maxC.u - minC.u);
    return Q('2.2', `High-low: variable cost per unit? ${table(d.rows)}`, $(d.vc, 2),
      [$(Math.abs(wrong1), 2), $(d.hi.c / d.hi.u, 2), $((d.hi.c - d.lo.c) / d.hi.u, 2), $(d.vc * 1.5, 2)],
      `Pick highest & lowest ACTIVITY (${fmt(d.hi.u)} & ${fmt(d.lo.u)} units). VC = (${$(d.hi.c)} − ${$(d.lo.c)}) ÷ (${fmt(d.hi.u)} − ${fmt(d.lo.u)}) = ${$(d.vc, 2)}.`,
      { fill: jitter$(d.vc, 2) });
  },
  highlow_fixed() {
    const d = highLowData();
    return Q('2.2', `High-low: total FIXED cost? ${table(d.rows)}`, $(d.fc),
      [$(d.hi.c - d.vc * d.lo.u), $(d.hi.c + d.vc * d.hi.u), $(d.lo.c), $(d.fc + d.vc * 1000)],
      `VC = ${$(d.vc, 2)}/unit. Fixed = ${$(d.hi.c)} − ${fmt(d.hi.u)} × ${$(d.vc, 2)} = ${$(d.fc)}.`, { fill: jitter$(d.fc) });
  },
  highlow_forecast() {
    const d = highLowData();
    const x = R(d.lo.u / 1000 + 1, d.hi.u / 1000 - 1) * 1000;
    const tc = d.fc + d.vc * x;
    return Q('2.2', `High-low: expected total cost at ${fmt(x)} units? ${table(d.rows)}`, $(tc),
      [$(d.vc * x), $(d.fc + d.vc * d.hi.u), $(tc - d.fc / 2), $(d.hi.c * x / d.hi.u)],
      `VC ${$(d.vc, 2)}, fixed ${$(d.fc)}. Cost = ${$(d.fc)} + ${fmt(x)} × ${$(d.vc, 2)} = ${$(tc)}.`, { fill: jitter$(tc) });
  },
  rel_material() {
    const inStock = R(2, 8) * 100, need = inStock + R(1, 5) * 100, paid = R(10, 30) / 10, resale = R(5, 20) / 10, repl = +(paid + R(2, 15) / 10).toFixed(2);
    const regular = Math.random() < .55;
    const correct = regular ? need * repl : inStock * resale + (need - inStock) * repl;
    return Q('2.1', `Material: ${fmt(inStock)} kg in stock (paid ${$(paid, 2)}/kg), resale ${$(resale, 2)}/kg, replacement ${$(repl, 2)}/kg. A job needs ${fmt(need)} kg. The material is ${regular ? 'used REGULARLY' : 'NOT used elsewhere'}. Relevant cost?`,
      $(correct, 0), [$(regular ? inStock * resale + (need - inStock) * repl : need * repl), $(inStock * paid + (need - inStock) * repl), $(need * paid), $(need * resale)],
      regular ? `In regular use → any used must be replaced: ${fmt(need)} × ${$(repl, 2)} = ${$(correct)}. Original price is sunk.`
        : `Not replaced → stock costs its resale value (${fmt(inStock)} × ${$(resale, 2)}), extra ${fmt(need - inStock)} kg bought at ${$(repl, 2)} = ${$(correct)}.`, { fill: jitter$(correct) });
  },
  rel_labour() {
    const need = R(3, 8) * 100, spare = R(1, need / 100 - 1) * 100, rate = R(10, 20), cpuLab = R(2, 6) * 2, hrsPer = 2;
    const extra = need - spare;
    const ot = extra * rate * 1.5, divert = extra * (rate + cpuLab / hrsPer);
    const correct = Math.min(ot, divert);
    return Q('6.2', `Contract needs ${fmt(need)} labour hrs; ${fmt(spare)} spare paid hrs exist. Rest: overtime at time-and-a-half, OR divert from product X (contribution ${$(cpuLab)} per ${hrsPer} hrs). Rate ${$(rate)}/hr. Relevant labour cost?`,
      $(correct), [$(Math.max(ot, divert)), $(need * rate), $(need * rate * 1.5), $(extra * cpuLab / hrsPer)],
      `Spare hrs cost nil. ${fmt(extra)} hrs: overtime ${$(ot)} vs divert (wage + lost contribution) ${$(divert)}. Choose cheaper = ${$(correct)}.`, { fill: jitter$(correct) });
  },
  deprival() {
    const rc = R(5, 20) * 1000, nrv = R(3, 18) * 1000, ev = R(4, 22) * 1000;
    const correct = Math.min(rc, Math.max(nrv, ev));
    return Q('2.1', `Asset: replacement cost ${$(rc)}, scrap/NRV ${$(nrv)}, future revenues (economic value) ${$(ev)}. Relevant cost (deprival value)?`,
      $(correct), [$(rc), $(nrv), $(ev), $(Math.max(rc, nrv, ev))].filter(x => x !== $(correct)),
      `Deprival value = lower of RC (${$(rc)}) and higher of NRV/EV (${$(Math.max(nrv, ev))}) = ${$(correct)}.`, { fill: jitter$(correct) });
  },

  // ───────────────────────── MODULE 3 ─────────────────────────
  oar() {
    const oh = R(100, 900, 10) * 1000, hrs = R(20, 100) * 1000;
    const rate = +(oh / hrs).toFixed(2), jobH = R(5, 60);
    const ans = rate * jobH;
    return Q('3.3', `Budgeted overhead ${$(oh)}, budgeted ${fmt(hrs)} labour hrs. A job takes ${jobH} hrs. Overhead absorbed by the job?`,
      $(ans, 2), [$(rate, 2), $(jobH * hrs / oh, 2), $(ans * 1.2, 2), $(ans / 2, 2)],
      `OAR = ${$(oh)} ÷ ${fmt(hrs)} = ${$(rate, 2)}/hr. Job = ${jobH} × ${$(rate, 2)} = ${$(ans, 2)}.`, { fill: jitter$(ans, 2) });
  },
  under_over() {
    const rate = R(4, 20), budH = R(20, 60) * 1000, actH = budH + R(-8, 8) * 1000, actOH = rate * budH + R(-30, 30) * 1000;
    const absorbed = rate * actH, diff = absorbed - actOH;
    if (diff === 0) return GEN.under_over();
    const lbl = d => `${$(Math.abs(d))} ${d > 0 ? 'over' : 'under'}-absorbed`;
    return Q('3.3', `OAR ${$(rate)}/hr (budget ${fmt(budH)} hrs). Actual: ${fmt(actH)} hrs worked, overhead incurred ${$(actOH)}. Under/over absorption?`,
      lbl(diff), [lbl(-diff), lbl(rate * budH - actOH), lbl(-(rate * budH - actOH)), lbl(diff * 2)],
      `Absorbed = ${fmt(actH)} × ${$(rate)} = ${$(absorbed)}. Actual ${$(actOH)}. ${diff > 0 ? 'Absorbed > actual → OVER' : 'Absorbed < actual → UNDER'} by ${$(Math.abs(diff))}.`);
  },
  apportion() {
    const rent = R(30, 200, 5) * 1000, areas = [R(2, 9) * 100, R(2, 9) * 100, R(1, 5) * 100];
    const tot = areas.reduce((a, b) => a + b), i = R(0, 2), names = ['Machining', 'Assembly', 'Stores'];
    const ans = Math.round(rent * areas[i] / tot);
    return Q('3.2', `Rent ${$(rent)} apportioned by floor area: Machining ${areas[0]}m², Assembly ${areas[1]}m², Stores ${areas[2]}m². Share for ${names[i]}?`,
      $(ans), [$(Math.round(rent / 3)), $(Math.round(rent * areas[(i + 1) % 3] / tot)), $(Math.round(rent * areas[i] / (tot - areas[2]))), $(Math.round(ans * 1.25))],
      `${$(rent)} × ${areas[i]} ÷ ${tot} = ${$(ans)}.`, { fill: jitter$(ans) });
  },
  mc_ac_diff() {
    const prod = R(10, 30) * 1000, sales = prod + R(-6, 6) * 1000, foh = R(2, 9);
    if (prod === sales) return GEN.mc_ac_diff();
    const d = (prod - sales) * foh;
    const lbl = (v, hi) => `${$(Math.abs(v))}; ${hi} higher`;
    const higher = d > 0 ? 'absorption' : 'marginal';
    return Q('3.3', `No opening inventory. Produced ${fmt(prod)}, sold ${fmt(sales)}. Fixed production OH absorbed at ${$(foh)}/unit. Profit difference absorption vs marginal?`,
      lbl(d, higher), [lbl(d, higher === 'absorption' ? 'marginal' : 'absorption'), lbl(prod * foh, higher), lbl(sales * foh, higher), lbl(d * 2, higher)],
      `Inventory ${prod > sales ? 'rose' : 'fell'} by ${fmt(Math.abs(prod - sales))} units × ${$(foh)} = ${$(Math.abs(d))}. Inventory ${d > 0 ? 'rose → absorption' : 'fell → marginal'} profit is higher.`);
  },
  mc_profit() {
    const price = R(15, 40), vc = R(5, price - 5), sales = R(10, 40) * 1000, fixed = R(50, 200, 10) * 1000;
    const p = (price - vc) * sales - fixed;
    return Q('3.3', `Marginal costing: price ${$(price)}, variable cost ${$(vc)}, sold ${fmt(sales)} units, fixed costs ${$(fixed)}. Profit?`,
      $(p), [$((price - vc) * sales), $(price * sales - fixed), $(p + fixed / 2), $((price - vc) * sales + fixed)],
      `Contribution ${$(price - vc)} × ${fmt(sales)} = ${$((price - vc) * sales)} − fixed ${$(fixed)} = ${$(p)}.`, { fill: jitter$(Math.abs(p)) });
  },
  abc_unit() {
    const pool = R(50, 400, 10) * 1000, setups = R(20, 100), unitsX = R(5, 50) * 1000, batch = pick([500, 1000, 2000, 2500, 5000]);
    const rate = pool / setups, batches = Math.ceil(unitsX / batch), per = rate * batches / unitsX;
    return Q('3.4', `Set-up cost pool ${$(pool)} for ${setups} set-ups. Product X: ${fmt(unitsX)} units in batches of ${fmt(batch)}. Set-up cost per unit of X?`,
      $(per, 2), [$(pool / unitsX, 2), $(rate / batch * 2, 2), $(rate, 2), $(per * 1.5, 2)],
      `Driver rate ${$(pool)} ÷ ${setups} = ${$(rate, 2)}/set-up. X needs ${batches} set-ups → ${$(rate * batches)} ÷ ${fmt(unitsX)} = ${$(per, 2)}/unit.`, { fill: jitter$(per, 2) });
  },
  eu() {
    const input = R(20, 80) * 100, wip = R(3, 15) * 100, pct = pick([20, 25, 40, 50, 60, 75, 80]);
    const done = input - wip, cost = R(30, 200) * 100;
    const eu = done + wip * pct / 100, cpeu = cost / eu;
    return Q('3.6', `No opening WIP. ${fmt(input)} units input, cost ${$(cost)}. ${fmt(done)} finished; ${fmt(wip)} in closing WIP ${pct}% complete. Cost per equivalent unit?`,
      $(cpeu, 2), [$(cost / input, 2), $(cost / done, 2), $(cost / (done + wip * (1 - pct / 100)), 2), $(cpeu * 1.1, 2)],
      `EU = ${fmt(done)} + ${fmt(wip)} × ${pct}% = ${fmt(eu)}. ${$(cost)} ÷ ${fmt(eu)} = ${$(cpeu, 2)}.`, { fill: jitter$(cpeu, 2) });
  },
  process_loss() {
    const input = R(10, 50) * 100, nl = pick([5, 10, 15, 20]), cost = R(50, 300) * 100, scrap = pick([0, 0.5, 1, 2]);
    const expected = input * (1 - nl / 100), diff = R(-4, 4) * 10 || 20;
    const actual = expected + diff;
    const cpu = (cost - input * nl / 100 * scrap) / expected;
    const ab = Math.abs(diff);
    const kind = diff < 0 ? 'abnormal loss' : 'abnormal gain';
    return Q('3.6', `Input ${fmt(input)} units costing ${$(cost)}. Normal loss ${nl}% (scrap ${$(scrap, 2)}/unit). Output ${fmt(actual)}. Value of the ${kind} in the process account?`,
      $(ab * cpu, 2), [$(ab * scrap, 2), $(ab * cost / input, 2), $(ab * cost / actual, 2), $(ab * cpu + ab * scrap, 2)],
      `Cost/unit = (${$(cost)} − NL scrap ${$(input * nl / 100 * scrap)}) ÷ expected ${fmt(expected)} = ${$(cpu, 4)}. ${ab} units × that = ${$(ab * cpu, 2)} (valued like good units).`, { fill: jitter$(ab * cpu, 2) });
  },
  process_input() {
    const out = R(20, 80) * 10, nl = pick([5, 10, 15]), ab = pick([5, 10]);
    const input = out / (1 - (nl + ab) / 100);
    if (!Number.isInteger(input)) return GEN.process_input();
    return Q('3.6', `Good output ${fmt(out)} litres. Normal loss ${nl}% and abnormal loss ${ab}% of INPUT. Litres input?`,
      fmt(input) + ' L', [fmt(Math.round(out * (1 + (nl + ab) / 100))) + ' L', fmt(Math.round(out / (1 - nl / 100))) + ' L', fmt(Math.round(out * (1 + nl / 100))) + ' L', fmt(out + nl + ab) + ' L'],
      `Losses are ${nl + ab}% of input, so output = ${100 - nl - ab}% of input: ${fmt(out)} ÷ ${(100 - nl - ab) / 100} = ${fmt(input)}.`);
  },
  job_price() {
    const cost = R(20, 90) * 100, m = pick([20, 25, 30, 40]);
    const onSales = Math.random() < .5;
    const ans = onSales ? cost / (1 - m / 100) : cost * (1 + m / 100);
    return Q('3.6', `Job total cost ${$(cost)}. Profit is ${m}% of ${onSales ? 'SALES (margin)' : 'COST (mark-up)'}. Selling price?`,
      $(ans, 2), [$(onSales ? cost * (1 + m / 100) : cost / (1 - m / 100), 2), $(cost * m / 100, 2), $(cost * (1 - m / 100), 2), $(ans + cost * .05, 2)],
      onSales ? `Margin on sales: price = cost ÷ (1 − ${m}%) = ${$(ans, 2)}.` : `Mark-up on cost: price = cost × (1 + ${m}%) = ${$(ans, 2)}.`);
  },

  // ───────────────────────── MODULE 4 ─────────────────────────
  mat_price() {
    const sp = R(4, 20), aq = R(5, 30) * 100, ap = +(sp + pick([-1, 1]) * R(2, 15) / 10).toFixed(2);
    const v = (sp - ap) * aq;
    return Q('4.6', `Standard price ${$(sp)}/kg. Bought ${fmt(aq)} kg for ${$(ap * aq)}. Material PRICE variance?`, FU(v),
      [FU(-v), FU(v * 1.5), FU((sp - ap) * aq * 0.8), FU(sp * aq - ap)],
      `(SP − AP) × AQ = (${$(sp)} − ${$(ap, 2)}) × ${fmt(aq)} = ${FU(v)}. Paying ${ap < sp ? 'less' : 'more'} than standard = ${ap < sp ? 'F' : 'U'}.`, { fill: jitterFU(v) });
  },
  mat_usage() {
    const sqpu = R(2, 10), units = R(5, 20) * 100, sp = R(3, 15), aq = sqpu * units + pick([-1, 1]) * R(1, 20) * 10;
    const sq = sqpu * units, v = (sq - aq) * sp;
    return Q('4.6', `Std: ${sqpu} kg/unit at ${$(sp)}/kg. Made ${fmt(units)} units using ${fmt(aq)} kg (cost ${$(aq * (sp + 1))}). USAGE variance?`, FU(v),
      [FU(-v), FU((sq - aq) * (sp + 1)), FU((sq - aq)), FU(v * 2)],
      `(SQ − AQ) × SP = (${fmt(sq)} − ${fmt(aq)}) × ${$(sp)} = ${FU(v)}. Always value usage at STANDARD price.`, { fill: jitterFU(v) });
  },
  lab_rate() {
    const sr = R(10, 30), paid = R(10, 40) * 100, ar = +(sr + pick([-1, 1]) * R(2, 30) / 10).toFixed(2);
    const v = (sr - ar) * paid;
    return Q('4.6', `Std rate ${$(sr)}/hr. ${fmt(paid)} hrs paid costing ${$(ar * paid)}. Labour RATE variance?`, FU(v),
      [FU(-v), FU(v * 0.9), FU(v * 1.5), FU(v * 1.2)],
      `(SR − AR) × hrs PAID = (${$(sr)} − ${$(ar, 2)}) × ${fmt(paid)} = ${FU(v)}.`, { fill: jitterFU(v) });
  },
  lab_eff() {
    const hpu = R(2, 6), units = R(2, 10) * 100, sr = R(10, 25), idle = R(0, 3) * 50;
    const worked = hpu * units + pick([-1, 1]) * R(2, 20) * 10, paid = worked + idle;
    const v = (hpu * units - worked) * sr;
    return Q('4.6', `Std ${hpu} hrs/unit at ${$(sr)}/hr. Output ${fmt(units)} units. Hours paid ${fmt(paid)}${idle ? `, of which ${idle} idle` : ''}. Labour EFFICIENCY variance?`, FU(v),
      [FU((hpu * units - paid) * sr), FU(-v), FU(v + idle * sr), FU(v * 1.5)],
      `SH = ${fmt(hpu * units)}. Hours WORKED = ${fmt(worked)}. (SH − worked) × SR = ${FU(v)}.${idle ? ` Idle ${idle} hrs is a separate U variance.` : ''}`, { fill: jitterFU(v) });
  },
  idle() {
    const sr = R(8, 25), idle = R(1, 12) * 25;
    return Q('4.6', `${fmt(idle)} hours were paid but idle due to a machine breakdown. Std rate ${$(sr)}/hr. Idle time variance?`, FU(-idle * sr),
      [FU(idle * sr), FU(-idle * sr * 1.5), FU(0), FU(-idle * sr / 2)],
      `Idle hrs × SR = ${$(idle * sr)}, always UNFAVOURABLE.`);
  },
  voh() {
    const rate = R(1, 6) + pick([0, .5]), hpu = R(1, 4), units = R(2, 8) * 100, worked = hpu * units + pick([-1, 1]) * R(1, 10) * 10;
    const actual = Math.round(worked * rate + pick([-1, 1]) * R(5, 60) * 10);
    const exp = worked * rate - actual, eff = (hpu * units - worked) * rate;
    const isExp = Math.random() < .5;
    return Q('4.6', `VOH ${$(rate, 2)}/active hr, std ${hpu} hrs/unit. ${fmt(units)} units made in ${fmt(worked)} active hrs; VOH incurred ${$(actual)}. VOH ${isExp ? 'EXPENDITURE' : 'EFFICIENCY'} variance?`,
      FU(isExp ? exp : eff), [FU(isExp ? eff : exp), FU(isExp ? -exp : -eff), FU(hpu * units * rate - actual), FU((isExp ? exp : eff) * 2)],
      isExp ? `Expected for hrs worked ${$(worked * rate)} − actual ${$(actual)} = ${FU(exp)}.` : `(SH ${fmt(hpu * units)} − AH ${fmt(worked)}) × ${$(rate, 2)} = ${FU(eff)}.`, { fill: jitterFU(isExp ? exp : eff) });
  },
  foh_exp() {
    const bud = R(50, 400, 5) * 1000, act = bud + pick([-1, 1]) * R(1, 40) * 500;
    const v = bud - act;
    return Q('4.6', `Budgeted fixed overhead ${$(bud)}; actual ${$(act)}. FOH EXPENDITURE variance?`, FU(v),
      [FU(-v), FU(v * 1.1), FU(0), FU(v / 2)], `Budget − actual = ${FU(v)}. Spending ${act > bud ? 'more' : 'less'} than budget → ${act > bud ? 'U' : 'F'}.`, { fill: jitterFU(v) });
  },
  foh_vol() {
    const budU = R(5, 30) * 100, rate = R(5, 30), actU = budU + pick([-1, 1]) * R(1, 30) * 10;
    const v = (actU - budU) * rate;
    return Q('4.6', `Budget output ${fmt(budU)} units; FOH absorbed at ${$(rate)}/unit. Actual output ${fmt(actU)}. FOH VOLUME variance?`, FU(v),
      [FU(-v), FU(actU * rate - budU), FU(v * 2), FU((actU - budU))],
      `(Actual − budget units) × rate = (${fmt(actU)} − ${fmt(budU)}) × ${$(rate)} = ${FU(v)}. ${v >= 0 ? 'More' : 'Less'} output than budget → ${v >= 0 ? 'F (over-absorbed)' : 'U (under-absorbed)'}.`, { fill: jitterFU(v) });
  },
  sales_price() {
    const sp = R(10, 50), units = R(10, 80) * 100, ap = +(sp + pick([-1, 1]) * R(1, 30) / 10).toFixed(2);
    const v = (ap - sp) * units;
    return Q('4.6', `Std selling price ${$(sp)}. Sold ${fmt(units)} units for ${$(ap * units)}. Selling PRICE variance?`, FU(v),
      [FU(-v), FU(v * 1.2), FU(v * 0.5), FU(v * 0.8)], `(AP − SP) × actual units = ${FU(v)}.`, { fill: jitterFU(v) });
  },
  sales_vol() {
    const bud = R(5, 30) * 100, act = bud + pick([-1, 1]) * R(1, 40) * 10, price = R(15, 50), cost = R(5, price - 3);
    const v = (act - bud) * (price - cost);
    return Q('4.6', `Budget sales ${fmt(bud)} units at ${$(price)}; standard full cost ${$(cost)}/unit. Actual sales ${fmt(act)} units. Sales VOLUME PROFIT variance?`, FU(v),
      [FU((act - bud) * price), FU(-v), FU((act - bud) * cost), FU(v * 1.5)],
      `(Actual − budget units) × std PROFIT (${$(price - cost)}) = ${FU(v)}. Not at selling price!`, { fill: jitterFU(v) });
  },
  prod_budget() {
    const sales = R(5, 50) * 100, op = R(1, 10) * 50, cl = R(1, 10) * 50;
    const p = sales + cl - op;
    return Q('4.2', `Budgeted sales ${fmt(sales)} units. Opening finished goods ${fmt(op)}, required closing ${fmt(cl)}. Production budget?`,
      fmt(p) + ' units', [fmt(sales - cl + op) + ' units', fmt(sales + cl + op) + ' units', fmt(sales - cl - op) + ' units', fmt(sales) + ' units'],
      `Production = sales + closing − opening = ${fmt(sales)} + ${fmt(cl)} − ${fmt(op)} = ${fmt(p)}.`);
  },
  purch_budget() {
    const prod = R(10, 40) * 100, kg = R(2, 5), op = R(5, 30) * 100, cl = R(5, 30) * 100, price = R(2, 9);
    const usage = prod * kg, buy = usage + cl - op;
    return Q('4.2', `Production ${fmt(prod)} units × ${kg} kg each. Opening RM ${fmt(op)} kg, closing ${fmt(cl)} kg, price ${$(price)}/kg. Purchases budget ($)?`,
      $(buy * price), [$(usage * price), $((usage - cl + op) * price), $((usage + cl + op) * price), $(buy)],
      `Usage ${fmt(usage)} + closing ${fmt(cl)} − opening ${fmt(op)} = ${fmt(buy)} kg × ${$(price)} = ${$(buy * price)}.`);
  },
  cash_receipts() {
    const cashPct = pick([20, 30, 40, 50]), m = ['Jan', 'Feb', 'Mar', 'Apr'];
    const sales = m.map(() => R(50, 150) * 1000), lag = pick([1, 2]), i = 3;
    const ans = sales[i] * cashPct / 100 + sales[i - lag] * (100 - cashPct) / 100;
    return Q('4.2', `Sales: ${m.map((x, j) => `${x} ${$(sales[j])}`).join(', ')}. ${cashPct}% cash; rest paid ${lag} month${lag > 1 ? 's' : ''} later. Cash received in Apr?`,
      $(ans), [$(sales[i]), $(sales[i] * cashPct / 100 + sales[i - (lag === 1 ? 2 : 1)] * (100 - cashPct) / 100), $(sales[i - lag]), $(sales[i] * (100 - cashPct) / 100 + sales[i - lag] * cashPct / 100)],
      `Apr cash sales ${cashPct}% × ${$(sales[i])} + credit from ${m[i - lag]}: ${100 - cashPct}% × ${$(sales[i - lag])} = ${$(ans)}.`, { fill: jitter$(ans) });
  },
  flex() {
    const budU = R(10, 30) * 100, actU = budU + R(2, 10) * 100, vc = R(3, 12), fc = R(10, 60) * 1000;
    const flexCost = fc + vc * actU;
    return Q('4.2', `Budget: ${fmt(budU)} units, variable cost ${$(vc)}/unit, fixed ${$(fc)}. Actual output ${fmt(actU)} units. Flexed budget total cost?`,
      $(flexCost), [$(fc + vc * budU), $((fc + vc * budU) * actU / budU), $(vc * actU), $(fc * actU / budU + vc * actU)],
      `Flex VARIABLE costs only: ${$(fc)} + ${fmt(actU)} × ${$(vc)} = ${$(flexCost)}. Fixed costs don't flex.`, { fill: jitter$(flexCost) });
  },
  investigate() {
    const cost = R(5, 30) * 100, saving = R(20, 100) * 100, p = pick([30, 40, 50, 60, 70]);
    const ev = saving * p / 100 - cost;
    return Q('4.6', `Investigating a variance costs ${$(cost)}. If corrected, savings are ${$(saving)}; chance of correction ${p}%. Expected net benefit?`,
      $(ev), [$(saving - cost), $(saving * p / 100), $((saving - cost) * p / 100), $(saving * p / 100 + cost)],
      `EV = ${p}% × ${$(saving)} − ${$(cost)} = ${$(ev)}. Investigate if positive.`, { fill: jitter$(Math.abs(ev)) });
  },

  // ───────────────────────── MODULE 5 ─────────────────────────
  roi() {
    const cap = R(2, 20) * 100000, prof = Math.round(cap * R(8, 30) / 100);
    return Q('5.2', `Division PBIT ${$(prof)}, capital employed ${$(cap)}. ROI?`, pct(prof / cap * 100),
      [pct(cap / prof), pct(prof / cap * 100 * 1.2), pct(prof / (cap + prof) * 100), pct(prof / cap * 50)],
      `ROI = ${$(prof)} ÷ ${$(cap)} × 100 = ${pct(prof / cap * 100)}.`);
  },
  ri() {
    const cap = R(2, 10) * 100000, roi = R(12, 28), coc = R(8, 16), newInv = R(2, 10) * 10000, newProf = Math.round(newInv * R(10, 30) / 100);
    const prof = cap * roi / 100 + newProf, avgCap = cap + newInv / 2;
    const ri = prof - avgCap * coc / 100;
    return Q('5.2', `Capital ${$(cap)} earning ROI ${roi}%. New investment ${$(newInv)} at start of year earns ${$(newProf)} profit; capital measured as AVERAGE (new asset counts 50%). Cost of capital ${coc}%. RI?`,
      $(ri), [$(prof - (cap + newInv) * coc / 100), $(cap * roi / 100 - cap * coc / 100), $(prof - cap * coc / 100), $(prof * coc / 100)],
      `Profit ${$(prof)}. Avg capital ${$(avgCap)} × ${coc}% = ${$(avgCap * coc / 100)}. RI = ${$(ri)}.`, { fill: jitter$(ri) });
  },
  margin() {
    const sales = R(2, 20) * 100000, gp = Math.round(sales * R(25, 60) / 100), op = Math.round(gp * R(20, 70) / 100);
    const gross = Math.random() < .5;
    return Q('5.2', `Sales ${$(sales)}, gross profit ${$(gp)}, operating profit ${$(op)}. ${gross ? 'GROSS profit margin' : 'Profit (operating) margin'}?`,
      pct((gross ? gp : op) / sales * 100), [pct((gross ? op : gp) / sales * 100), pct((gross ? gp : op) / (sales - gp) * 100), pct(sales / (gross ? gp : op)), pct(op / gp * 100)],
      `${gross ? 'Gross profit' : 'Operating profit'} ÷ sales × 100.`);
  },
  ratios() {
    const bud = R(10, 30) * 100, act = bud + R(-3, 5) * 50, std = act + R(-3, 4) * 40;
    const which = pick(['efficiency', 'capacity', 'activity']);
    const v = { efficiency: std / act, capacity: act / bud, activity: std / bud };
    return Q('5.2', `Budgeted hrs ${fmt(bud)}, actual hrs worked ${fmt(act)}, standard hrs of output ${fmt(std)}. ${which.toUpperCase()} ratio?`,
      pct(v[which] * 100), Object.keys(v).filter(k => k !== which).map(k => pct(v[k] * 100)).concat([pct(100 / v[which])]),
      `Efficiency = std/actual; capacity = actual/budget; activity = std/budget.`);
  },

  // ───────────────────────── MODULE 6 ─────────────────────────
  bep_units() {
    const price = R(10, 60), vc = R(4, price - 3), fc = R(20, 300, 5) * 1000;
    const be = fc / (price - vc);
    return Q('6.2', `Price ${$(price)}, variable cost ${$(vc)}, fixed costs ${$(fc)}. Break-even point (units)?`,
      fmt(Math.ceil(be)) + ' units', [fmt(Math.ceil(fc / price)) + ' units', fmt(Math.ceil(fc / vc)) + ' units', fmt(Math.ceil(fc / (price + vc))) + ' units', fmt(Math.ceil(be * 1.25)) + ' units'],
      `BEP = fixed ÷ contribution/unit = ${$(fc)} ÷ ${$(price - vc)} = ${fmt(be, 2)} → round UP to ${fmt(Math.ceil(be))} units.`);
  },
  bep_rev() {
    const cs = pick([20, 25, 30, 35, 40, 45, 50, 60]), fc = R(20, 300, 5) * 1000;
    const be = fc / (cs / 100);
    return Q('6.2', `C/S ratio ${cs}%, fixed costs ${$(fc)}. Break-even REVENUE?`, $(be), [$(fc * cs / 100), $(fc / (1 - cs / 100)), $(fc + fc * cs / 100), $(be * 0.8)],
      `BEP $ = fixed ÷ C/S = ${$(fc)} ÷ ${cs}% = ${$(be)}.`);
  },
  target_profit() {
    const price = R(15, 60), vc = R(5, price - 4), fc = R(20, 200, 5) * 1000, tp = R(5, 80) * 1000;
    const u = (fc + tp) / (price - vc);
    return Q('6.2', `Price ${$(price)}, variable cost ${$(vc)}, fixed ${$(fc)}. Units needed for profit of ${$(tp)}?`,
      fmt(Math.ceil(u)), [fmt(Math.ceil(fc / (price - vc))), fmt(Math.ceil(tp / (price - vc))), fmt(Math.ceil((fc + tp) / price)), fmt(Math.ceil((fc - tp) / (price - vc)))],
      `(Fixed + target profit) ÷ CPU = (${$(fc)} + ${$(tp)}) ÷ ${$(price - vc)} = ${fmt(u, 1)}.`);
  },
  mos() {
    const price = R(20, 60), vc = R(5, price - 5), fc = R(20, 150, 5) * 1000;
    const be = Math.ceil(fc / (price - vc)), bud = be + R(2, 20) * 100;
    const m = (bud - be) / bud * 100;
    return Q('6.2', `Price ${$(price)}, VC ${$(vc)}, fixed ${$(fc)}, budgeted sales ${fmt(bud)} units. Margin of safety %?`,
      pct(m), [pct((bud - be) / be * 100), pct(be / bud * 100), pct(m / 2), pct(m + 10)],
      `BEP ${fmt(be)} units. MoS = (${fmt(bud)} − ${fmt(be)}) ÷ ${fmt(bud)} = ${pct(m)}.`);
  },
  cs_price() {
    const vc = R(10, 60), cs = pick([20, 25, 40, 45, 50, 60]), fc = R(50, 500, 10) * 1000;
    const price = vc / (1 - cs / 100), be = fc / (price - vc);
    return Q('6.2', `Variable cost ${$(vc)}/unit, C/S ratio ${cs}%, fixed costs ${$(fc)}. Break-even units?`, fmt(Math.ceil(be)),
      [fmt(Math.ceil(fc / (vc * cs / 100))), fmt(Math.ceil(fc / vc)), fmt(Math.ceil(fc / price)), fmt(Math.ceil(be * 1.5))],
      `VC/sales = ${100 - cs}%, so price = ${$(vc)} ÷ ${(100 - cs) / 100} = ${$(price, 2)}. CPU ${$(price - vc, 2)}. BEP = ${fmt(be, 1)}.`);
  },
  limiting() {
    const prods = ['W', 'X', 'Y', 'Z'].map(n => { const h = R(1, 5), c = R(4, 30); return { n, h, c, per: c / h }; });
    if (new Set(prods.map(p => p.per.toFixed(2))).size < 4) return GEN.limiting();
    const best = [...prods].sort((a, b) => b.per - a.per)[0], bestC = [...prods].sort((a, b) => b.c - a.c)[0];
    return Q('6.2', `Labour hours are scarce. ${prods.map(p => `${p.n}: contribution ${$(p.c)}, ${p.h} hrs/unit`).join('; ')}. Which product ranks FIRST?`,
      `Product ${best.n}`, [`Product ${bestC.n}`, ...prods.map(p => `Product ${p.n}`)], 
      `Contribution per hour: ${prods.map(p => `${p.n} ${$(p.per, 2)}`).join(', ')}. Highest per scarce hour = ${best.n}.`);
  },
  special_order() {
    const vc = R(20, 40) / 10, price = +(vc + R(5, 20) / 10).toFixed(2), offer = +(vc + R(2, 8) / 10).toFixed(2), qty = R(3, 10) * 1000, lost = pick([1, 2, 3]), per = pick([10, 15, 20]);
    const gain = qty * (offer - vc) - qty / per * lost * (price - vc);
    return Q('6.2', `VC ${$(vc, 2)}, normal price ${$(price, 2)}. Offer: ${fmt(qty)} units at ${$(offer, 2)} (spare capacity), but existing sales fall ${lost} unit per ${per} sold to new customer. Change in profit?`,
      $(gain), [$(qty * (offer - vc)), $(qty * (offer - vc) - qty / per * lost * price), $(qty * offer - qty / per * lost * (price - vc)), $(gain * 1.3)],
      `New contribution ${$(qty * (offer - vc))} − lost contribution ${fmt(qty / per * lost)} × ${$(price - vc, 2)} = ${$(gain)}.`, { fill: jitter$(Math.abs(gain)) });
  },
  make_buy() {
    const vcm = R(8, 30), buy = vcm + pick([-1, 1]) * R(1, 6), units = R(1, 10) * 1000, saving = R(0, 4) * 2000;
    const diff = (buy - vcm) * units - saving; // positive = make cheaper
    const lbl = d => d > 0 ? `Make; saves ${$(d)}` : `Buy; saves ${$(-d)}`;
    if (diff === 0) return GEN.make_buy();
    return Q('6.2', `Component: variable cost to make ${$(vcm)}, buy-in price ${$(buy)}, ${fmt(units)} units/yr. Buying avoids ${$(saving)} attributable fixed costs. Decision?`,
      lbl(diff), [lbl(-diff), lbl((buy - vcm) * units), lbl(-(buy - vcm) * units - saving)],
      `Extra cost of buying ${$((buy - vcm) * units)} less fixed saving ${$(saving)} → ${lbl(diff)}.`);
  },
  payback() {
    const inv = R(5, 20) * 10000, flows = [R(1, 6), R(2, 7), R(2, 8), R(3, 9), R(2, 9)].map(x => x * 10000);
    let cum = -inv, yrs = null, yi = 0;
    for (let i = 0; i < flows.length; i++) { if (cum + flows[i] > 0) { yrs = i + (-cum) / flows[i]; yi = i; break; } cum += flows[i]; }
    if (yrs == null) return GEN.payback();
    const y = yi, m = Math.round((yrs - y) * 12);
    const lbl = (yy, mm) => mm === 12 ? `${yy + 1} yrs 0 m` : `${yy} yrs ${mm} m`;
    return Q('6.3', `Outlay ${$(inv)}. Cash inflows (even through each year): ${flows.map((f, i) => `Y${i + 1} ${$(f)}`).join(', ')}. Payback period?`,
      lbl(y, m), [lbl(y + 1, 0), lbl(y, (m + 6) % 12), lbl(Math.max(0, y - 1), m), lbl(y, Math.max(0, m - 3))],
      `Cumulative turns positive in year ${y + 1}: ${y} yrs + ${fmt(-cum)} ÷ ${fmt(flows[y])} × 12 = ${m} months.`);
  },
  arr() {
    const cost = R(5, 20) * 10000, res = R(0, 4) * 5000, life = R(3, 6), cash = Math.round((cost - res) / life + cost * R(5, 25) / 100);
    const dep = (cost - res) / life, prof = cash - dep, avg = (cost + res) / 2;
    return Q('6.3', `Machine costs ${$(cost)}, residual ${$(res)}, life ${life} yrs, straight-line depreciation. Annual net CASH inflow ${$(cash)}. ARR (avg profit ÷ avg investment)?`,
      pct(prof / avg * 100), [pct(prof / cost * 100), pct(cash / avg * 100), pct(cash / cost * 100), pct(prof / (cost - res) * 100)],
      `Profit = ${$(cash)} − dep ${$(dep)} = ${$(prof)}. Avg investment = (${$(cost)} + ${$(res)}) ÷ 2 = ${$(avg)}. ARR = ${pct(prof / avg * 100)}.`);
  },

  // ───────────────────────── MODULE 7 ─────────────────────────
  reorder() {
    const maxU = R(20, 80) * 10, maxL = R(5, 20);
    return Q('7.2', `Usage: max ${fmt(maxU)}/day, avg ${fmt(maxU * .75)}/day. Lead time: max ${maxL} days, avg ${maxL - 2} days. Reorder level?`,
      fmt(maxU * maxL) + ' units', [fmt(maxU * .75 * (maxL - 2)) + ' units', fmt(maxU * (maxL - 2)) + ' units', fmt(maxU * .75 * maxL) + ' units', fmt(maxU * maxL * 2) + ' units'],
      `Reorder level = max usage × max lead time = ${fmt(maxU)} × ${maxL} = ${fmt(maxU * maxL)}.`);
  },
  maxlevel() {
    const maxU = R(30, 60) * 10, minU = R(10, 25) * 10, maxL = R(10, 15), minL = R(5, maxL - 2), roq = R(30, 90) * 100;
    const rol = maxU * maxL, mx = rol + roq - minU * minL;
    return Q('7.2', `Usage per day: min ${minU}, max ${maxU}. Lead time ${minL}–${maxL} days. Reorder qty ${fmt(roq)}. Maximum inventory level?`,
      fmt(mx), [fmt(rol + roq), fmt(rol - minU * minL), fmt(rol + roq - maxU * maxL), fmt(rol + roq - minU * maxL)],
      `ROL = ${maxU} × ${maxL} = ${fmt(rol)}. Max = ROL + ROQ − min usage × min lead = ${fmt(rol)} + ${fmt(roq)} − ${fmt(minU * minL)} = ${fmt(mx)}.`);
  },
  minlevel() {
    const maxU = R(30, 60) * 10, avgU = maxU - R(5, 15) * 10, maxL = R(10, 15), avgL = maxL - R(1, 4);
    const rol = maxU * maxL, mn = rol - avgU * avgL;
    return Q('7.2', `Usage per day: max ${maxU}, avg ${avgU}. Lead time: max ${maxL}, avg ${avgL} days. Minimum inventory level?`,
      fmt(mn), [fmt(rol), fmt(rol - maxU * avgL), fmt(avgU * avgL), fmt(rol - avgU * maxL)],
      `ROL ${fmt(rol)} − avg usage × avg lead (${fmt(avgU * avgL)}) = ${fmt(mn)}.`);
  },
  eoq() {
    // choose clean square
    const eoq = R(2, 30) * 100, ch = R(1, 10) / 2, co = R(10, 200, 5);
    const d = Math.round(eoq * eoq * ch / (2 * co));
    const e = Math.sqrt(2 * co * d / ch);
    return Q('7.2', `Annual demand ${fmt(d)} units, order cost ${$(co)} per order, holding cost ${$(ch, 2)} per unit per year. EOQ?`,
      fmt(Math.round(e)), [fmt(Math.round(Math.sqrt(co * d / ch))), fmt(Math.round(Math.sqrt(2 * ch * d / co))), fmt(Math.round(2 * co * d / ch / 100)), fmt(Math.round(e * 1.4))],
      `EOQ = √(2 × ${co} × ${fmt(d)} ÷ ${ch}) ≈ ${fmt(Math.round(e))}.`);
  },
  avg_inv() {
    const ss = R(2, 10) * 100, roq = R(10, 60) * 100, ch = R(1, 5);
    const avg = ss + roq / 2;
    const holding = Math.random() < .5;
    return Q('7.2', `Safety (buffer) stock ${fmt(ss)}, order quantity ${fmt(roq)}${holding ? `, holding cost ${$(ch)}/unit/yr. Annual HOLDING cost?` : '. AVERAGE inventory?'}`,
      holding ? $(avg * ch) : fmt(avg), holding ? [$(roq / 2 * ch), $((ss + roq) * ch), $(roq * ch)] : [fmt(roq / 2), fmt(ss + roq), fmt((ss + roq) / 2)],
      `Average = safety + ½ order qty = ${fmt(ss)} + ${fmt(roq / 2)} = ${fmt(avg)}${holding ? ` × ${$(ch)} = ${$(avg * ch)}` : ''}.`);
  },
  markup() {
    const price = R(10, 50), cost = +(price * R(55, 85) / 100).toFixed(2);
    return Q('7.3', `Marginal cost ${$(cost, 2)}, selling price ${$(price)}. Mark-up on marginal cost?`,
      pct((price - cost) / cost * 100), [pct((price - cost) / price * 100), pct(cost / price * 100), pct(price / cost * 100), pct((price - cost) / cost * 50)],
      `Mark-up = profit ÷ COST = ${$(price - cost, 2)} ÷ ${$(cost, 2)}. (Margin would divide by price.)`);
  },
  ped() {
    const p0 = R(10, 50), dp = pick([5, 10, 20]), dq = pick([2, 5, 10, 15, 20, 30, 40]);
    const e = dq / dp;
    return Q('7.3', `Price rises ${dp}% from ${$(p0)}; quantity demanded falls ${dq}%. PED and demand type?`,
      `${fmt(e, 2)} – ${e > 1 ? 'elastic' : e < 1 ? 'inelastic' : 'unit elastic'}`,
      [`${fmt(dp / dq, 2)} – ${dp / dq > 1 ? 'elastic' : 'inelastic'}`, `${fmt(e, 2)} – ${e > 1 ? 'inelastic' : 'elastic'}`, `${fmt(e * 2, 2)} – elastic`, `${fmt(e / 2, 2)} – inelastic`],
      `PED = %Δqty ÷ %Δprice = ${dq} ÷ ${dp} = ${fmt(e, 2)}. >1 elastic, <1 inelastic.`);
  },
  target_cost() {
    const price = R(20, 200), m = pick([10, 15, 20, 25, 30]), cur = Math.round(price * (1 - m / 100) + R(1, 15));
    const tc = price * (1 - m / 100);
    return Q('7.3', `Market price ${$(price)}; required profit margin ${m}% of price. Current estimated cost ${$(cur)}. Cost gap to close?`,
      $(cur - tc, 2), [$(cur - price / (1 + m / 100), 2), $(price - cur, 2), $(tc, 2), $(cur - tc + price * .05, 2)],
      `Target cost = ${$(price)} × ${100 - m}% = ${$(tc, 2)}. Gap = ${$(cur)} − ${$(tc, 2)} = ${$(cur - tc, 2)}.`);
  },
};

// Which generators cover which LOs (used to weight practice).
export const GEN_BY_LO = {
  '2.1': ['rel_material', 'deprival'], '2.2': ['highlow_vc', 'highlow_fixed', 'highlow_forecast'],
  '3.2': ['apportion'], '3.3': ['oar', 'under_over', 'mc_ac_diff', 'mc_profit'], '3.4': ['abc_unit'], '3.6': ['eu', 'process_loss', 'process_input', 'job_price'],
  '4.2': ['prod_budget', 'purch_budget', 'cash_receipts', 'flex'],
  '4.6': ['mat_price', 'mat_usage', 'lab_rate', 'lab_eff', 'idle', 'voh', 'foh_exp', 'foh_vol', 'sales_price', 'sales_vol', 'investigate'],
  '5.2': ['roi', 'ri', 'margin', 'ratios'],
  '6.2': ['bep_units', 'bep_rev', 'target_profit', 'mos', 'cs_price', 'limiting', 'special_order', 'make_buy', 'rel_labour'], '6.3': ['payback', 'arr'],
  '7.2': ['reorder', 'maxlevel', 'minlevel', 'eoq', 'avg_inv'], '7.3': ['markup', 'ped', 'target_cost'],
};

// A full variance scenario (for the Variance Strike boss): one data set, a chain of questions.
export function varianceScenario() {
  const sp = R(40, 90), units = R(8, 20) * 100, bud = units + pick([-1, 1]) * R(1, 4) * 100;
  const kgpu = R(2, 5), mprice = R(3, 8), hpu = R(2, 4), rate = R(12, 20), foh = R(5, 12);
  const aq = kgpu * units + pick([-1, 1]) * R(5, 40) * 10, ap = +(mprice + pick([-.5, -.3, .2, .4])).toFixed(2);
  const worked = hpu * units + pick([-1, 1]) * R(5, 30) * 10, ar = +(rate + pick([-1, -.5, .5, 1])).toFixed(2);
  const stdCost = kgpu * mprice + hpu * rate + foh, aprice = sp + pick([-2, -1, 1, 2]);
  const fohBud = bud * foh, fohAct = fohBud + pick([-1, 1]) * R(1, 20) * 100;
  const intro = `Std card: ${kgpu} kg × ${$(mprice)}, ${hpu} hrs × ${$(rate)}, FOH ${$(foh)}/unit; price ${$(sp)}. Budget ${fmt(bud)} units. Actual: made & sold ${fmt(units)} at ${$(aprice)}; ${fmt(aq)} kg cost ${$(aq * ap)}; ${fmt(worked)} hrs cost ${$(worked * ar)}; FOH ${$(fohAct)}.`;
  const mk = (name, v, lo = '4.6', ex) => Q(lo, `${name}?`, FU(v), [FU(-v), FU(v * 1.25), FU(v * 0.75), FU(v * 2)], ex);
  return { intro, qs: [
    mk('Sales volume profit variance', (units - bud) * (sp - stdCost), '4.6', `(${fmt(units)} − ${fmt(bud)}) × std profit ${$(sp - stdCost)}.`),
    mk('Selling price variance', (aprice - sp) * units, '4.6', `(${$(aprice)} − ${$(sp)}) × ${fmt(units)}.`),
    mk('Material price variance', (mprice - ap) * aq, '4.6', `(${$(mprice)} − ${$(ap, 2)}) × ${fmt(aq)} kg.`),
    mk('Material usage variance', (kgpu * units - aq) * mprice, '4.6', `(${fmt(kgpu * units)} − ${fmt(aq)}) × ${$(mprice)}.`),
    mk('Labour rate variance', (rate - ar) * worked, '4.6', `(${$(rate)} − ${$(ar, 2)}) × ${fmt(worked)} hrs.`),
    mk('Labour efficiency variance', (hpu * units - worked) * rate, '4.6', `(${fmt(hpu * units)} − ${fmt(worked)}) × ${$(rate)}.`),
    mk('FOH expenditure variance', fohBud - fohAct, '4.6', `${$(fohBud)} − ${$(fohAct)}.`),
    mk('FOH volume variance', (units - bud) * foh, '4.6', `(${fmt(units)} − ${fmt(bud)}) × ${$(foh)}.`),
  ] };
}
