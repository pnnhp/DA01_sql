// M6 – Factory Rush (bright flat arcade). Three stage types:
// 1) Scarce hours: tap products in production priority (contribution per limiting factor).
// 2) Break-even bridge: slide the marker to the exact break-even / target-profit / margin point on a P/V chart.
// 3) Investment bubbles: pop the bubble holding the right payback / ARR / decision answer.
import { Game, rand, randi, pick, clamp, roundRect, LETTERS, esc } from '../core/engine.js';
import { sfx } from '../core/audio.js';
import { questionFor, nextQuestion } from '../core/questions.js';
import { fmt } from '../content/generators.js';

const F = 'Outfit, system-ui, sans-serif';
const BUB = ['payback', 'arr', 'special_order', 'make_buy', 'cs_price', 'bep_rev', 'rel_labour', 'mos'];
const PCOL = ['#ff3f7a', '#3fd2ff', '#ffd23f'];

export default class Rush extends Game {
  static id = 'rush'; static mod = 6; static music = 'tycoon'; static theme = 'flat';
  init() {
    this.lives = 4; this.stages = ['hours', 'cvp', 'bubbles', 'hours', 'cvp', 'bubbles', 'cvp', 'bubbles']; this.si = -1;
    this.bar = document.createElement('div'); this.bar.className = 'hudbar'; this.bar.style.cssText = 'left:0;right:0;justify-content:center'; this.hud.appendChild(this.bar);
    this.nextStage();
  }
  nextStage() {
    if (this.over) return; this.si++; this.qpanel(null); this.bar.innerHTML = ''; this.mode = null;
    if (this.si >= this.stages.length) return this.finish(true);
    const s = this.stages[this.si];
    this.toast({ hours: '⏳ Scarce hours!', cvp: '🌉 Break-even bridge', bubbles: '🫧 Investment bubbles' }[s], '#ff3f7a', 1300);
    setTimeout(() => this['start_' + s](), 700);
  }
  lose() { this.lives--; this.shake(8); if (this.lives <= 0) { this.finish(false); return true; } return false; }
  finish(win) { this.qpanel(null); this.bar.innerHTML = ''; this.mode = null; setTimeout(() => this.end({ title: win ? 'Factory running at peak profit!' : 'Factory closed', win }), 500); }

  // ── 1. scarce hours
  start_hours() {
    let prods;
    do {
      prods = ['Widget', 'Gizmo', 'Doohickey'].map((n, i) => { const h = randi(1, 6), price = randi(20, 90), vc = randi(5, price - 4), dem = randi(2, 8) * 100; return { n, i, h, price, vc, c: price - vc, per: (price - vc) / h, dem }; });
    } while (new Set(prods.map(p => p.per.toFixed(2))).size < 3);
    const totalNeed = prods.reduce((s, p) => s + p.h * p.dem, 0);
    this.hrs = Math.round(totalNeed * rand(0.45, 0.7) / 100) * 100;
    this.prods = prods; this.order = []; this.mode = 'hours'; this.result = null; this.htime = 40; this.hmax = 40;
    this.bar.innerHTML = '<button class="hudbtn hit" id="runf" style="background:#ff3f7a">▶ Run factory</button><button class="hudbtn hit" id="clr">↺ Clear</button>';
    this.bar.querySelector('#runf').onclick = () => this.runHours(); this.bar.querySelector('#clr').onclick = () => { this.order = []; sfx('click'); };
  }
  alloc(order) { let left = this.hrs, total = 0; const units = {}; for (const i of order) { const p = this.prods[i]; const u = Math.min(p.dem, Math.floor(left / p.h)); units[i] = u; left -= u * p.h; total += u * p.c; } return { units, total }; }
  runHours() {
    if (this.mode !== 'hours' || this.result) return;
    if (this.order.length < 3) { this.toast('Rank all 3 products first', '#ffd23f'); return; }
    const best = [...this.prods].sort((a, b) => b.per - a.per).map(p => p.i);
    const mine = this.alloc(this.order), opt = this.alloc(best);
    const ok = this.order.join() === best.join();
    const q = { lo: '6.2', q: `Labour limited to ${fmt(this.hrs)} hrs: rank products for production`, opts: [best.map(i => this.prods[i].n).join(' → ')], a: 0,
      ex: `Rank by contribution per labour hour: ${best.map(i => `${this.prods[i].n} $${this.prods[i].per.toFixed(2)}/hr`).join(', ')}. Not by contribution per unit!` };
    this.answer(q, ok ? 0 : -1);
    this.result = { mine, opt, ok, t: 0 }; this.bar.innerHTML = '';
    const pctOpt = opt.total ? Math.round(mine.total / opt.total * 100) : 100;
    this.score += Math.round(pctOpt * 1.5); if (!ok && this.lose()) return;
    setTimeout(() => this.nextStage(), ok ? 2600 : 5200);
  }
  // ── 2. CVP bridge
  start_cvp() {
    const price = randi(15, 80), vc = randi(5, price - 4), cpu = price - vc, fc = randi(10, 120) * 1000;
    const kind = pick(['bep', 'target', 'mos']);
    const be = fc / cpu, tp = randi(5, 60) * 1000, bud = Math.ceil(be * rand(1.2, 1.8) / 50) * 50;
    const ans = kind === 'bep' ? be : kind === 'target' ? (fc + tp) / cpu : bud - be;
    const maxU = Math.ceil(Math.max(ans, be, bud) * rand(1.3, 1.9) / 100) * 100;
    this.cvp = { price, vc, cpu, fc, kind, tp, bud, ans, maxU, x: maxU * rand(0.05, 0.95), locked: false, bridge: 0, truck: -0.2, step: Math.max(1, Math.round(maxU / 400)) };
    const ask = { bep: 'the BREAK-EVEN point (units)', target: `the units needed for a profit of $${fmt(tp)}`, mos: `the MARGIN OF SAFETY in units (budget ${fmt(bud)} units)` }[kind];
    this.qpanel({ q: `Price $${price}, variable cost $${vc}, fixed costs $${fmt(fc)}. Slide to ${ask}.` }, { title: '🌉 BREAK-EVEN BRIDGE', compact: true, timer: true });
    this.mode = 'cvp'; this.ctime = 45; this.cmax = 45;
    this.bar.innerHTML = '<button class="hudbtn hit" id="m1">−</button><button class="hudbtn hit" id="lock" style="background:#3fff8b;color:#000">🔒 Lock in</button><button class="hudbtn hit" id="p1">+</button>';
    this.bar.querySelector('#lock').onclick = () => this.lockCvp();
    const nudge = d => { this.cvp.x = clamp(this.cvp.x + d * this.cvp.step, 0, this.cvp.maxU); sfx('tick'); };
    this.bar.querySelector('#m1').onclick = () => nudge(-1); this.bar.querySelector('#p1').onclick = () => nudge(1);
  }
  chart() { const top = (this.hud.querySelector('.qpanel')?.offsetHeight || 60) + 30; return { x: 44, y: top, w: this.W - 70, h: Math.max(160, this.H - top - 190) }; }
  lockCvp() {
    const c = this.cvp; if (!c || c.locked) return;
    c.locked = true; this.bar.innerHTML = '';
    const val = Math.round(c.x), tol = Math.max(c.step * 2, c.ans * 0.02);
    const ok = Math.abs(val - c.ans) <= tol;
    const formula = { bep: `BEP = $${fmt(c.fc)} ÷ $${c.cpu} = ${fmt(c.ans, 1)} units`, target: `(Fixed $${fmt(c.fc)} + profit $${fmt(c.tp)}) ÷ $${c.cpu} = ${fmt(c.ans, 1)} units`, mos: `BEP ${fmt(c.fc / c.cpu, 1)}; MoS = ${fmt(c.bud)} − BEP = ${fmt(c.ans, 1)} units` }[c.kind];
    const q = { lo: '6.2', q: `CVP: ${c.kind.toUpperCase()} with price $${c.price}, VC $${c.vc}, FC $${fmt(c.fc)}`, opts: [`${fmt(Math.round(c.ans))} units`], a: 0, ex: `${formula}. You chose ${fmt(val)}.` };
    this.answer(q, ok ? 0 : -1); c.ok = ok;
    if (ok) { this.score += 150; sfx('cash'); } else if (this.lose()) return;
    setTimeout(() => this.nextStage(), ok ? 2800 : 5200);
  }
  // ── 3. bubbles
  start_bubbles() { this.bleft = 3; this.mode = 'bubbles'; this.newBubbles(); }
  newBubbles() {
    const q = Math.random() < 0.7 ? questionFor(pick(BUB)) : nextQuestion({ mods: [6], kind: 'concept' });
    this.bq = q; this.qpanel(q, { title: `🫧 POP THE RIGHT BUBBLE (${this.bleft} left)`, timer: true });
    const top = this.hud.querySelector('.qpanel').offsetHeight + 20;
    this.bubbles = q.opts.map((o, i) => ({ i, x: this.W * (0.15 + i * 0.235), y: this.H + 60 + randi(0, 200), vy: -rand(70, 110), r: Math.min(52, this.W / 8.5), ph: rand(0, 6), top }));
    this.btime = 40;
  }
  popBubble(b) {
    if (!this.bq || b.popped) return; b.popped = true; sfx('slice');
    const ok = this.answer(this.bq, b.i); this.burst(b.x, b.y, ok ? '#3fff8b' : '#ff3f7a', 24);
    this.bq = null; this.bubbles.forEach(x => x.vy = -500);
    if (ok) this.score += 80 + Math.round(this.btime * 2); else if (this.lose()) return;
    this.bleft--; setTimeout(() => this.bleft > 0 ? this.newBubbles() : this.nextStage(), ok ? 700 : 4000);
  }
  onDown(x, y) {
    if (this.mode === 'hours' && !this.result) {
      const i = this.prodHit(x, y); if (i < 0) return;
      const k = this.order.indexOf(i); if (k >= 0) this.order.splice(k, 1); else this.order.push(i); sfx('click');
    }
    if (this.mode === 'cvp' && !this.cvp.locked) this.dragCvp(x);
    if (this.mode === 'bubbles' && this.bq) for (const b of this.bubbles) if (Math.hypot(b.x - x, b.y - y) < b.r + 6) { this.popBubble(b); break; }
  }
  onMove(x) { if (this.mode === 'cvp' && this.pointer.down && !this.cvp.locked) this.dragCvp(x); }
  dragCvp(x) { const c = this.chart(); this.cvp.x = clamp(Math.round(((x - c.x) / c.w) * this.cvp.maxU / this.cvp.step) * this.cvp.step, 0, this.cvp.maxU); }
  onKey(k, down) {
    if (!down) return;
    if (this.mode === 'hours' && '123'.includes(k)) { this.onDownIdx(+k - 1); }
    if (this.mode === 'hours' && k === 'Enter') this.runHours();
    if (this.mode === 'cvp' && this.cvp && !this.cvp.locked) { const big = this.keys.has('Shift') ? 10 : 1; if (k === 'ArrowLeft') this.cvp.x = clamp(this.cvp.x - this.cvp.step * big, 0, this.cvp.maxU); if (k === 'ArrowRight') this.cvp.x = clamp(this.cvp.x + this.cvp.step * big, 0, this.cvp.maxU); if (k === 'Enter' || k === ' ') this.lockCvp(); }
    if (this.mode === 'bubbles' && this.bq && '1234abcd'.includes(k)) { const i = '1234'.includes(k) ? +k - 1 : 'abcd'.indexOf(k); const b = this.bubbles.find(b => b.i === i); if (b) this.popBubble(b); }
  }
  onDownIdx(i) { const k = this.order.indexOf(i); if (k >= 0) this.order.splice(k, 1); else this.order.push(i); sfx('click'); }
  prodRects() {
    const W = this.W, H = this.H, wide = W > 700; const out = [];
    for (let i = 0; i < 3; i++) out.push(wide ? { x: 20 + i * (W - 40) / 3 + 6, y: 120, w: (W - 40) / 3 - 12, h: 170 } : { x: 14, y: 100 + i * 118, w: W - 28, h: 108 });
    return out;
  }
  prodHit(x, y) { return this.prodRects().findIndex(r => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h); }
  update(dt) {
    if (this.mode === 'hours' && !this.result) { this.htime -= dt; if (this.htime <= 0) { while (this.order.length < 3) this.order.push([0, 1, 2].find(i => !this.order.includes(i))); this.runHours(); } }
    if (this.result) this.result.t += dt;
    if (this.mode === 'cvp' && this.cvp) { const c = this.cvp; if (!c.locked) { this.ctime -= dt; this.setTimerBar(this.ctime / this.cmax); if (this.ctime <= 0) this.lockCvp(); } else { c.truck += dt * 0.35; if (!c.ok) c.bridge += dt; } }
    if (this.mode === 'bubbles' && this.bubbles) {
      if (this.bq) { this.btime -= dt; this.setTimerBar(this.btime / 40); if (this.btime <= 0) { const q = this.bq; this.bq = null; this.answer(q, -1); this.bubbles.forEach(b => b.vy = -500); if (!this.lose()) { this.bleft--; setTimeout(() => this.bleft > 0 ? this.newBubbles() : this.nextStage(), 3800); } } }
      for (const b of this.bubbles) { b.y += b.vy * dt; b.ph += dt; if (this.bq && b.y < b.top + b.r) { b.y = b.top + b.r; } }
    }
  }
  draw(g) {
    const W = this.W, H = this.H;
    g.fillStyle = '#fff4e0'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#ffe1b3'; for (let i = 0; i < 12; i++) { g.beginPath(); g.arc((i * 137) % W, (i * 89) % H, 40 + (i % 3) * 20, 0, 7); g.fill(); }
    if (this.mode === 'hours') this.drawHours(g);
    if (this.mode === 'cvp') this.drawCvp(g);
    if (this.mode === 'bubbles' && this.bubbles) this.drawBubbles(g);
    this.text('❤'.repeat(Math.max(0, this.lives)), 12, H - 22, { size: 18, align: 'left', color: '#ff3f7a' });
    this.text(`${Math.round(this.score)}`, W - 12, H - 22, { size: 22, align: 'right', color: '#1b1b2f', stroke: false });
  }
  drawHours(g) {
    const W = this.W;
    this.text(`⏳ Only ${fmt(this.hrs)} labour hours available`, W / 2, 30, { size: Math.min(17, W / 22), color: '#1b1b2f', stroke: false });
    this.text(`Tap products in production priority${this.result ? '' : ` · ${Math.ceil(this.htime)}s`}`, W / 2, 56, { size: Math.min(14, W / 28), color: '#ff3f7a', stroke: false });
    this.prodRects().forEach((r, i) => {
      const p = this.prods[i], rank = this.order.indexOf(i);
      g.fillStyle = '#fff'; roundRect(g, r.x, r.y, r.w, r.h, 16); g.fill(); g.lineWidth = rank >= 0 ? 5 : 2; g.strokeStyle = rank >= 0 ? PCOL[i] : '#ddd'; g.stroke();
      this.text(p.n, r.x + 16, r.y + 22, { size: 18, align: 'left', color: PCOL[i], stroke: false });
      const lines = [`Price $${p.price} · VC $${p.vc}`, `Contribution $${p.c}/unit`, `${p.h} labour hrs/unit · demand ${fmt(p.dem)}`];
      lines.forEach((l, k) => this.text(l, r.x + 16, r.y + 46 + k * 19, { size: 13, align: 'left', color: '#333', stroke: false, weight: 600 }));
      if (rank >= 0) { g.fillStyle = PCOL[i]; g.beginPath(); g.arc(r.x + r.w - 28, r.y + 28, 20, 0, 7); g.fill(); this.text(`#${rank + 1}`, r.x + r.w - 28, r.y + 28, { size: 16, stroke: false }); }
      if (this.result) { const u = this.result.mine.units[i] || 0, f = Math.min(1, this.result.t / 1.5); g.fillStyle = '#eee'; g.fillRect(r.x + 16, r.y + r.h - 16, r.w - 32, 8); g.fillStyle = PCOL[i]; g.fillRect(r.x + 16, r.y + r.h - 16, (r.w - 32) * (u / p.dem) * f, 8); }
    });
    if (this.result) {
      const R = this.result, y = this.prodRects()[2].y + this.prodRects()[2].h + 34;
      this.text(`Your contribution $${fmt(R.mine.total)} vs best $${fmt(R.opt.total)}`, W / 2, y, { size: 16, color: '#1b1b2f', stroke: false });
      this.text(R.ok ? '✔ Perfect ranking!' : '✗ Rank by contribution PER HOUR', W / 2, y + 26, { size: 18, color: R.ok ? '#11a04a' : '#ff3f7a', stroke: false });
    }
  }
  drawCvp(g) {
    const c = this.cvp, r = this.chart();
    g.fillStyle = '#fff'; roundRect(g, r.x - 34, r.y - 14, r.w + 50, r.h + 46, 14); g.fill();
    const maxP = c.cpu * c.maxU - c.fc, minP = -c.fc, sy = v => r.y + r.h * (1 - (v - minP) / (Math.max(maxP, 1) - minP)), sx = u => r.x + r.w * u / c.maxU;
    g.strokeStyle = '#ccc'; g.lineWidth = 1; g.beginPath(); g.moveTo(r.x, sy(0)); g.lineTo(r.x + r.w, sy(0)); g.moveTo(r.x, r.y); g.lineTo(r.x, r.y + r.h); g.stroke();
    this.text('profit', r.x - 4, r.y + 4, { size: 10, color: '#888', stroke: false, align: 'right' }); this.text('units →', r.x + r.w, sy(0) + 14, { size: 10, color: '#888', stroke: false, align: 'right' });
    this.text(`−$${fmt(c.fc)}`, r.x + 4, sy(minP) - 8, { size: 10, color: '#ff3f7a', stroke: false, align: 'left' });
    if (c.kind === 'mos') { g.strokeStyle = '#b04bff'; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(sx(c.bud), r.y); g.lineTo(sx(c.bud), r.y + r.h); g.stroke(); g.setLineDash([]); this.text('budget', sx(c.bud), r.y - 4, { size: 10, color: '#b04bff', stroke: false }); }
    if (c.locked) { g.strokeStyle = '#3fd2ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(sx(0), sy(minP)); g.lineTo(sx(c.maxU), sy(maxP)); g.stroke();
      g.fillStyle = '#11a04a'; const ax = c.kind === 'mos' ? c.fc / c.cpu : c.ans; g.beginPath(); g.arc(sx(ax), sy(c.kind === 'target' ? c.tp : 0), 6, 0, 7); g.fill(); }
    // marker
    const mx = c.kind === 'mos' ? sx(c.bud) - (sx(c.x) - sx(0)) : sx(c.x);
    g.strokeStyle = '#ff3f7a'; g.lineWidth = 3; g.beginPath(); g.moveTo(sx(c.x), r.y); g.lineTo(sx(c.x), r.y + r.h); g.stroke();
    g.fillStyle = '#ff3f7a'; g.beginPath(); g.arc(sx(c.x), r.y + r.h + 10, 12, 0, 7); g.fill();
    if (c.kind === 'mos') { g.fillStyle = '#b04bff33'; g.fillRect(Math.min(mx, sx(c.bud)), r.y, Math.abs(sx(c.bud) - mx), r.h); }
    this.text(`${c.kind === 'mos' ? 'MoS' : 'Units'}: ${fmt(Math.round(c.x))}`, r.x + r.w / 2, r.y + r.h + 40, { size: 20, color: '#1b1b2f', stroke: false });
    // bridge + truck
    const by = this.H - 120, bx0 = 30, bx1 = this.W - 30;
    g.fillStyle = '#6b4a2b'; const drop = c.locked && !c.ok ? c.bridge * 200 : 0;
    g.fillRect(bx0, by, (bx1 - bx0) / 2, 10); g.save(); g.translate((bx0 + bx1) / 2, by); g.rotate(Math.min(1.2, drop / 200)); g.fillRect(0, 0, (bx1 - bx0) / 2, 10); g.restore();
    const tx = bx0 + (bx1 - bx0) * clamp(c.truck, -0.2, 1.1), fallT = c.locked && !c.ok && c.truck > 0.5 ? (c.truck - 0.5) * 600 : 0;
    g.fillStyle = '#3fd2ff'; g.fillRect(tx - 24, by - 26 + fallT, 48, 22); g.fillStyle = '#1b1b2f'; g.beginPath(); g.arc(tx - 14, by - 2 + fallT, 6, 0, 7); g.arc(tx + 14, by - 2 + fallT, 6, 0, 7); g.fill();
  }
  drawBubbles(g) {
    for (const b of this.bubbles) {
      if (b.popped) continue; const x = b.x + Math.sin(b.ph * 2) * 6;
      g.fillStyle = PCOL[b.i % 3] + '44'; g.strokeStyle = ['#ff3f7a', '#3fd2ff', '#ffb400', '#11a04a'][b.i]; g.lineWidth = 3;
      g.beginPath(); g.arc(x, b.y, b.r, 0, 7); g.fill(); g.stroke();
      g.fillStyle = '#ffffffaa'; g.beginPath(); g.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.18, 0, 7); g.fill();
      const sub = this.bq && this.bq.opts[b.i].length <= 14 ? this.bq.opts[b.i] : '';
      this.text(LETTERS[b.i], x, b.y - (sub ? 9 : 0), { size: 24, color: '#1b1b2f', stroke: false }); if (sub) this.text(sub, x, b.y + 13, { size: 11, color: '#1b1b2f', stroke: false });
    }
  }
}
