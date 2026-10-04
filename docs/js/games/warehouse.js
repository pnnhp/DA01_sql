// M7 – Warehouse Panic (8-bit). Each season: (1) calculate control levels — correct answers draw the
// reorder / max / min lines and set your order size to the EOQ; (2) survive 40 days of random demand
// by ordering at the right time; (3) a pricing / JIT shelf round.
import { Game, rand, randi, pick, clamp, LETTERS, esc } from '../core/engine.js';
import { sfx } from '../core/audio.js';
import { nextQuestion, questionFor, shuffle } from '../core/questions.js';
import { fmt } from '../content/generators.js';

const PX = '"Press Start 2P", ui-monospace, monospace';
const TAGC = ['#ff3f7a', '#3fd2ff', '#ffd23f', '#3fff8b'];

function mcq(lo, q, correct, wrongs, ex) {
  const opts = [correct]; for (const w of wrongs) if (!opts.includes(w) && opts.length < 4) opts.push(w);
  let k = 1; while (opts.length < 4) { const alt = String(Math.round(parseFloat(correct.replace(/,/g, '')) * (1 + 0.13 * k++))); if (!opts.includes(alt)) opts.push(fmt(+alt)); }
  const order = shuffle([0, 1, 2, 3]); return { lo, q, opts: order.map(i => opts[i]), a: order.indexOf(0), ex };
}

export default class Warehouse extends Game {
  static id = 'warehouse'; static mod = 7; static music = 'pixel'; static theme = 'pixel';
  init() { this.lives = 4; this.season = 0; this.coins = 0; this.btn(); this.newSeason(); }
  btn() {
    this.bar = document.createElement('div'); this.bar.className = 'hudbar'; this.bar.style.cssText = 'left:0;right:0;justify-content:center'; this.hud.appendChild(this.bar);
  }
  newSeason() {
    this.season++; if (this.season > 2) return this.finish(true);
    const minU = randi(10, 20) * 5, avgU = minU + randi(4, 10) * 5, maxU = avgU + randi(4, 10) * 5;
    const minL = randi(2, 4), avgL = minL + randi(1, 2), maxL = avgL + randi(1, 3);
    const rol = maxU * maxL, Ch = randi(2, 8) / 2;
    const eoqT = Math.round(rol * rand(0.9, 1.4) / 50) * 50, D = avgU * 360, Co = Math.round(eoqT * eoqT * Ch / (2 * D));
    const eoq = Math.round(Math.sqrt(2 * Co * D / Ch));
    const maxL_ = rol + eoq - minU * minL, minLv = rol - avgU * avgL;
    this.p = { minU, avgU, maxU, minL, avgL, maxL, rol, Ch, D, Co, eoq, maxLv: maxL_, minLv };
    this.known = { rol: false, max: false, eoq: false };
    const data = `Daily usage ${minU}–${maxU} (avg ${avgU}). Lead time ${minL}–${maxL} days (avg ${avgL}).`;
    this.setup = [
      { key: 'rol', q: mcq('7.2', `${data} REORDER LEVEL?`, fmt(rol), [fmt(avgU * avgL), fmt(maxU * avgL), fmt(avgU * maxL)], `Max usage × max lead = ${maxU} × ${maxL} = ${fmt(rol)}.`) },
      { key: 'eoq', q: mcq('7.2', `Annual demand ${fmt(D)}, order cost $${Co}, holding $${Ch}/unit/yr. EOQ?`, fmt(eoq), [fmt(Math.round(Math.sqrt(Co * D / Ch))), fmt(Math.round(Math.sqrt(2 * Ch * D / Co))), fmt(Math.round(eoq * 1.5))], `√(2 × ${Co} × ${fmt(D)} ÷ ${Ch}) ≈ ${fmt(eoq)}.`) },
      { key: 'max', q: mcq('7.2', `${data} Reorder level ${fmt(rol)}, order qty ${fmt(eoq)}. MAXIMUM level?`, fmt(maxL_), [fmt(rol + eoq), fmt(rol + eoq - maxU * maxL), fmt(rol + eoq - avgU * avgL)], `ROL + ROQ − min usage × min lead = ${fmt(rol)} + ${fmt(eoq)} − ${fmt(minU * minL)} = ${fmt(maxL_)}.`) },
    ];
    this.phase = 'setup'; this.si = 0; this.toast(`SEASON ${this.season}`, '#ffd23f'); setTimeout(() => this.askSetup(), 900);
  }
  askSetup() {
    if (this.over) return;
    if (this.si >= this.setup.length) return this.startSim();
    const s = this.setup[this.si]; this.cur = s;
    this.qpanel(s.q, { title: `📐 SET UP THE WAREHOUSE (${this.si + 1}/3) — correct answers draw your lines` });
    this.bar.innerHTML = s.q.opts.map((o, i) => `<button class="hudbtn hit" data-i="${i}" style="font-family:${PX};font-size:11px;background:${TAGC[i]};color:#000">${LETTERS[i]}<br>${esc(o)}</button>`).join('');
    this.bar.querySelectorAll('button').forEach(b => b.onclick = () => this.pickSetup(+b.dataset.i));
  }
  pickSetup(i) {
    if (!this.cur) return; const s = this.cur; this.cur = null; this.bar.innerHTML = '';
    const ok = this.answer(s.q, i); this.known[s.key] = ok;
    if (ok) { this.score += 60; this.toast(`✔ ${s.key.toUpperCase()} line unlocked`, '#3fff8b'); }
    this.si++; setTimeout(() => this.askSetup(), ok ? 700 : 3800);
  }
  startSim() {
    this.qpanel(null); const p = this.p;
    this.phase = 'sim'; this.day = 0; this.days = 40; this.stock = p.rol + Math.round(p.eoq * 0.6); this.dayT = 0; this.orders = []; this.stockouts = 0; this.waste = 0; this.hist = [];
    this.orderQty = this.known.eoq ? p.eoq : Math.round(p.eoq * pick([0.5, 1.8]));
    this.bar.innerHTML = `<button class="hudbtn hit" id="ord" style="font-family:${PX};font-size:14px;background:#ffd23f;color:#000;padding:16px 26px">📦 ORDER ${fmt(this.orderQty)}</button>`;
    this.bar.querySelector('#ord').onclick = () => this.order();
    this.toast(this.known.eoq ? 'Ordering the EOQ ✔' : 'Wrong EOQ → awkward order size!', this.known.eoq ? '#3fff8b' : '#ff3f7a', 1600);
  }
  order() {
    if (this.phase !== 'sim') return;
    const lt = randi(this.p.minL, this.p.maxL); this.orders.push({ arrive: this.day + lt, qty: this.orderQty, x: 1 }); sfx('pickup');
  }
  onKey(k, down) {
    if (!down) return;
    if (this.phase === 'sim' && (k === ' ' || k === 'o' || k === 'Enter')) this.order();
    if (this.phase === 'setup' && this.cur && '1234abcd'.includes(k)) this.pickSetup('1234'.includes(k) ? +k - 1 : 'abcd'.indexOf(k));
    if (this.phase === 'price' && this.pq && '1234abcd'.includes(k)) this.pickPrice('1234'.includes(k) ? +k - 1 : 'abcd'.indexOf(k));
  }
  update(dt) {
    if (this.phase === 'sim') {
      this.dayT += dt;
      if (this.dayT >= 0.55) {
        this.dayT = 0; this.day++;
        for (const o of this.orders) if (o.arrive === this.day) { this.stock += o.qty; o.done = true; sfx('thud'); this.float(this.W * 0.3, this.H * 0.5, `+${fmt(o.qty)}`, '#3fff8b', 16); }
        this.orders = this.orders.filter(o => !o.done);
        const use = randi(this.p.minU / 5, this.p.maxU / 5) * 5;
        this.stock -= use;
        if (this.stock < 0) { this.stock = 0; this.stockouts++; this.lives--; sfx('alarm'); this.shake(8); this.toast('STOCK-OUT! 😡', '#ff3f7a', 900); if (this.lives <= 0) return this.finish(false); }
        else this.score += 5;
        if (this.stock > this.p.maxLv) { this.waste++; this.score -= 8; if (this.waste % 3 === 1) this.toast('Over max level: holding cost 💸', '#ffd23f', 900); }
        this.hist.push(this.stock); if (this.hist.length > 60) this.hist.shift();
        if (this.day >= this.days) { this.bar.innerHTML = ''; this.toast(`Season done: ${this.stockouts} stock-outs`, '#3fd2ff'); this.score += Math.max(0, 200 - this.stockouts * 60 - this.waste * 5); this.startPrice(); }
      }
      for (const o of this.orders) o.x = Math.max(0.35, 1 - (1 - (o.arrive - this.day - this.dayT / 0.55) / this.p.maxL) * 0.65);
    }
    if (this.phase === 'price') { this.ptime -= dt; this.setTimerBar(this.ptime / 30); if (this.ptime <= 0 && this.pq) this.pickPrice(-1); }
  }
  startPrice() { this.phase = 'price'; this.pn = 3; setTimeout(() => this.nextPrice(), 900); }
  nextPrice() {
    if (this.over) return;
    if (this.pn <= 0) { this.phase = 'between'; return setTimeout(() => this.newSeason(), 600); }
    this.pn--;
    const q = Math.random() < 0.45 ? questionFor(pick(['markup', 'ped', 'target_cost', 'avg_inv', 'minlevel'])) : nextQuestion({ mods: [7], kind: 'concept' });
    this.pq = q; this.ptime = 30; this.qpanel(q, { title: '🏷 PRICING SHELF — tap the right tag', timer: true });
    this.bar.innerHTML = q.opts.map((o, i) => `<button class="hudbtn hit" data-i="${i}" style="background:${TAGC[i]};color:#000;max-width:46%">${LETTERS[i]}</button>`).join('');
    this.bar.querySelectorAll('button').forEach(b => b.onclick = () => this.pickPrice(+b.dataset.i));
  }
  pickPrice(i) {
    if (!this.pq) return; const q = this.pq; this.pq = null; this.bar.innerHTML = '';
    const ok = this.answer(q, i); if (ok) this.score += 70; else { this.lives--; if (this.lives <= 0) return this.finish(false); }
    setTimeout(() => this.nextPrice(), ok ? 600 : 3800);
  }
  finish(win) { this.qpanel(null); this.bar.innerHTML = ''; this.phase = 'done'; setTimeout(() => this.end({ title: win ? 'Warehouse of the year!' : 'Customers walked out', win }), 400); }

  draw(g) {
    const W = this.W, H = this.H; g.imageSmoothingEnabled = false;
    g.fillStyle = '#2a2140'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#3a2f58'; for (let y = 0; y < H; y += 40) g.fillRect(0, y, W, 2);
    g.fillStyle = '#5a4a2a'; g.fillRect(0, H * 0.78, W, H * 0.22);
    if (this.phase === 'sim' || this.phase === 'setup' || this.phase === 'price' || this.phase === 'between') this.drawSim(g);
    this.text('♥'.repeat(Math.max(0, this.lives)), 12, H * 0.78 + 18, { size: 14, font: PX, color: '#ff3f7a', align: 'left', weight: 400 });
    this.text(`${Math.round(this.score)}`, W - 12, H * 0.78 + 18, { size: 12, font: PX, align: 'right', weight: 400 });
  }
  drawSim(g) {
    const W = this.W, H = this.H, p = this.p; if (!p) return;
    const top = Math.max(H * 0.28, (this.hud.querySelector('.qpanel')?.offsetHeight || 0) + 20), bot = H * 0.76, maxShow = p.maxLv * 1.25;
    const sy = v => bot - (bot - top) * clamp(v / maxShow, 0, 1);
    // stock as stacked boxes
    const stock = this.phase === 'sim' ? this.stock : p.rol + p.eoq * 0.6;
    const bx = W * 0.08, bw = W * 0.34, h = bot - sy(stock), rows = Math.floor(h / 16);
    for (let r = 0; r < rows; r++) for (let c = 0; c < Math.floor(bw / 22); c++) { g.fillStyle = (r + c) % 2 ? '#c98a3a' : '#b07428'; g.fillRect(bx + c * 22, bot - (r + 1) * 16, 20, 14); }
    // gauge
    const gx = W * 0.5, gw = W * 0.44;
    g.fillStyle = '#0006'; g.fillRect(gx, top, gw, bot - top);
    if (this.hist && this.hist.length > 1) { g.strokeStyle = '#3fd2ff'; g.lineWidth = 2; g.beginPath(); this.hist.forEach((v, i) => { const x = gx + gw * i / 60; i ? g.lineTo(x, sy(v)) : g.moveTo(x, sy(v)); }); g.stroke(); }
    const line = (v, c, lbl, show) => { if (!show) { this.text('?', gx + gw - 10, sy(v), { size: 10, font: PX, color: '#666', weight: 400 }); return; } g.strokeStyle = c; g.setLineDash([6, 4]); g.lineWidth = 2; g.beginPath(); g.moveTo(gx, sy(v)); g.lineTo(gx + gw, sy(v)); g.stroke(); g.setLineDash([]); this.text(lbl, gx + 4, sy(v) - 8, { size: 7, font: PX, color: c, align: 'left', weight: 400 }); };
    line(p.rol, '#ffd23f', `REORDER ${fmt(p.rol)}`, this.known.rol);
    line(p.maxLv, '#ff3f7a', `MAX ${fmt(p.maxLv)}`, this.known.max);
    this.text(`STOCK ${fmt(Math.round(stock))}`, bx + bw / 2, bot + 42, { size: 10, font: PX, weight: 400 });
    if (this.phase === 'sim') {
      this.text(`DAY ${this.day}/${this.days}`, W / 2, top - 12, { size: 10, font: PX, weight: 400, color: '#ffd23f' });
      for (const o of this.orders) { const x = W * o.x; g.fillStyle = '#3fd2ff'; g.fillRect(x - 26, H * 0.82, 40, 20); g.fillStyle = '#ddd'; g.fillRect(x + 14, H * 0.84, 14, 18); g.fillStyle = '#000'; g.fillRect(x - 18, H * 0.82 + 20, 8, 8); g.fillRect(x + 14, H * 0.82 + 20, 8, 8); this.text(`${o.arrive - this.day}d`, x, H * 0.82 - 10, { size: 8, font: PX, weight: 400 }); }
    }
  }
  destroy() { this.bar && this.bar.remove(); }
}
