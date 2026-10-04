// M5 – Division Tycoon (corporate sim).
// Quarters alternate between: project decisions (group view vs ROI-judged manager view → goal congruence),
// board questions (ROI, RI, margins, control ratios) and a KPI drop (balanced scorecard / responsibility centres).
import { Game, rand, randi, pick, clamp, roundRect, esc, LETTERS } from '../core/engine.js';
import { sfx } from '../core/audio.js';
import { questionFor, nextQuestion, sortSets } from '../core/questions.js';
import { fmt } from '../content/generators.js';

const F = 'Outfit, system-ui, sans-serif';
const DIVS = [{ n: 'North', c: '#3fd2ff' }, { n: 'Coastal', c: '#3fff8b' }, { n: 'TechCo', c: '#b04bff' }];
const money = n => (n < 0 ? '−$' : '$') + fmt(Math.abs(Math.round(n)));
const COLS = ['#ffd23f', '#3fd2ff', '#ff7a3f', '#3fff8b'];

export default class Tycoon extends Game {
  static id = 'tycoon'; static mod = 5; static music = 'tycoon'; static theme = 'corp';
  init() {
    this.coc = randi(9, 14); this.conf = 5; this.value = 0; this.quarter = 0;
    this.divs = DIVS.map(d => ({ ...d, cap: randi(4, 12) * 100000, roi: randi(14, 28) }));
    this.plan = ['projects', 'drop', 'mixed', 'drop2', 'mixed'];
    this.city = Array.from({ length: 18 }, (_, i) => ({ x: i / 18, h: rand(0.15, 0.45), w: rand(0.04, 0.07) }));
    this.nextQuarter();
  }
  nextQuarter() {
    if (this.quarter >= this.plan.length) return this.finish(true);
    const kind = this.plan[this.quarter++]; this.kind = kind; this.cards = 0;
    this.toast(`Q${this.quarter}: ${kind.startsWith('drop') ? 'KPI drop' : kind === 'projects' ? 'Capital projects' : 'Board meeting'}`, '#ffd23f', 1500);
    if (kind.startsWith('drop')) setTimeout(() => this.startDrop(kind === 'drop' ? 'bsc' : 'centres'), 900);
    else setTimeout(() => this.nextCard(), 900);
  }
  // ── cards
  nextCard() {
    if (this.over) return;
    const limit = this.kind === 'projects' ? 6 : 6;
    if (this.cards >= limit) return this.nextQuarter();
    this.cards++;
    const type = this.kind === 'projects' ? pick(['company', 'company', 'manager']) : pick(['company', 'manager', 'board', 'board']);
    if (type === 'board') {
      const q = Math.random() < 0.55 ? questionFor(pick(['roi', 'ri', 'margin', 'ratios'])) : nextQuestion({ mods: [5], kind: 'concept' });
      return this.showDeal({ q, title: '📋 BOARD QUESTION', time: 35 });
    }
    const d = pick(this.divs); let ret;
    do { ret = randi(5, 34); } while (Math.abs(ret - this.coc) < 1 || Math.abs(ret - d.roi) < 1);
    const inv = randi(2, 20) * 10000, prof = Math.round(inv * ret / 100);
    const p = { d, inv, prof, ret };
    let q;
    if (type === 'company') {
      const ok = ret > this.coc;
      q = { lo: '5.2', q: `${d.n} proposes: invest $${fmt(inv)} for annual profit $${fmt(prof)}. Group cost of capital ${this.coc}%. As GROUP CFO — accept?`, opts: ['Accept', 'Reject'], a: ok ? 0 : 1,
        ex: `Return ${ret}% vs cost of capital ${this.coc}% → RI = $${fmt(prof)} − ${this.coc}% × $${fmt(inv)} = ${money(prof - inv * this.coc / 100)}. ${ok ? 'Positive RI: good for the group.' : 'Negative RI: destroys value.'}` };
    } else {
      const ok = ret > d.roi;
      const conflict = (ret > this.coc) !== ok;
      q = { lo: '5.2', q: `${d.n}'s manager is judged on ROI (currently ${d.roi}%). Project: $${fmt(inv)} → $${fmt(prof)}/yr. Will the MANAGER accept it?`, opts: ['Accept', 'Reject'], a: ok ? 0 : 1,
        ex: `Project return ${ret}% ${ok ? '>' : '<'} current ROI ${d.roi}% → ${ok ? 'raises' : 'dilutes'} divisional ROI, so the manager would ${ok ? 'accept' : 'reject'}.${conflict ? ` ⚠ Goal congruence problem: the group (cost of capital ${this.coc}%) wants the opposite! RI fixes this.` : ''}` };
    }
    this.showDeal({ q, p, title: type === 'company' ? '🏦 GROUP CFO DECISION' : '👔 MANAGER\'S VIEW (ROI)', time: 18, binary: true });
  }
  showDeal({ q, p, title, time, binary }) {
    this.card = { q, p, time, max: time, binary, dx: 0 };
    this.qpanel(null);
    let el = this.hud.querySelector('.tycard'); if (el) el.remove();
    el = document.createElement('div'); el.className = 'tycard hit';
    el.style.cssText = 'position:absolute;left:12px;right:12px;top:calc(70px + var(--safe-t));max-width:560px;margin:0 auto;background:#fffdf6;color:#1b1b2f;border-radius:18px;padding:14px;box-shadow:0 10px 0 #0006;pointer-events:auto;z-index:5;transition:transform .05s';
    el.innerHTML = `<div style="font-size:11px;letter-spacing:2px;font-weight:800;color:#b04bff">${title}</div>
      <div style="font-weight:700;font-size:16px;margin:6px 0 10px;line-height:1.3">${esc(q.q)}</div>
      ${binary ? `<div style="display:flex;gap:10px"><button class="btn" data-a="1" style="flex:1;background:#ff3f7a;box-shadow:0 4px 0 #a0103e;color:#fff">✗ Reject</button><button class="btn" data-a="0" style="flex:1;background:#3fff8b;box-shadow:0 4px 0 #11a04a">✓ Accept</button></div><div style="text-align:center;font-size:11px;color:#777;margin-top:6px">swipe ← reject · accept → (or keys ←/→)</div>`
      : `<div style="display:grid;gap:6px">${q.opts.map((o, i) => `<button class="btn ghost" data-a="${i}" style="color:#1b1b2f;border-color:#ccc;text-align:left"><b>${LETTERS[i]}</b> ${esc(o)}</button>`).join('')}</div>`}
      <div style="height:5px;background:#eee;border-radius:3px;margin-top:10px;overflow:hidden"><i class="tbar" style="display:block;height:100%;background:#b04bff;width:100%"></i></div>`;
    this.hud.appendChild(el); this.cardEl = el;
    el.querySelectorAll('[data-a]').forEach(b => b.onclick = () => this.choose(+b.dataset.a));
    let sx = null;
    el.addEventListener('pointerdown', e => { if (binary && e.target === el) sx = e.clientX; });
    el.addEventListener('pointermove', e => { if (sx != null) { this.card.dx = e.clientX - sx; el.style.transform = `translateX(${this.card.dx}px) rotate(${this.card.dx / 30}deg)`; } });
    el.addEventListener('pointerup', () => { if (sx != null) { const dx = this.card.dx; sx = null; el.style.transform = ''; if (Math.abs(dx) > 70) this.choose(dx > 0 ? 0 : 1); } });
  }
  choose(idx) {
    if (!this.card || this.card.done) return; const c = this.card; c.done = true;
    const ok = this.answer(c.q, idx);
    if (c.p) {
      // accepting a project changes company value by its RI
      const ri = c.p.prof - c.p.inv * this.coc / 100;
      if (idx === 0 && c.q.q.includes('GROUP') ) { this.value += ri; c.p.d.cap += c.p.inv; }
    }
    if (ok) { this.score += 40 + Math.round(c.time * 3) + this.combo * 5; this.value += 15000; sfx('cash'); this.toast('✔', '#3fff8b', 700); }
    else { this.conf--; this.shake(8); if (this.conf <= 0) return this.finish(false); }
    this.cardEl.style.transform = `translateX(${idx === 0 ? 120 : -120}%) rotate(${idx === 0 ? 12 : -12}deg)`; this.cardEl.style.transition = 'transform .35s';
    setTimeout(() => { this.cardEl && this.cardEl.remove(); this.card = null; this.nextCard(); }, ok ? 450 : 3800);
  }
  // ── drop phase
  startDrop(setId) {
    this.dropSet = sortSets([setId])[0]; this.tiles = [...this.dropSet.items].sort(() => Math.random() - 0.5).slice(0, 10); this.fall = null; this.landed = [[], [], [], []];
    this.toast(this.dropSet.title, '#ffd23f'); this.spawnTile();
  }
  spawnTile() {
    if (!this.tiles.length) { this.fall = null; return setTimeout(() => this.nextQuarter(), 900); }
    const it = this.tiles.pop(); this.fall = { it, col: randi(0, 3), y: 90, speed: 70 + this.quarter * 12, fast: false };
  }
  colW() { return Math.min(this.W, 640) / 4; } colX(i) { return (this.W - this.colW() * 4) / 2 + this.colW() * i; }
  onKey(k, down) {
    if (!down) return;
    if (this.card && !this.card.done) { if (k === 'ArrowRight') this.choose(0); if (k === 'ArrowLeft') this.choose(1); if (!this.card.binary && '1234'.includes(k)) this.choose(+k - 1); if (!this.card.binary && 'abcd'.includes(k) && k.length === 1) this.choose('abcd'.indexOf(k)); return; }
    if (this.fall) { if (k === 'ArrowLeft' || k === 'a') this.fall.col = Math.max(0, this.fall.col - 1); if (k === 'ArrowRight' || k === 'd') this.fall.col = Math.min(3, this.fall.col + 1); if (k === 'ArrowDown' || k === ' ' || k === 's') this.fall.fast = true; if ('1234'.includes(k)) this.fall.col = +k - 1; }
  }
  onDown(x) { if (this.fall) { const c = Math.floor((x - this.colX(0)) / this.colW()); if (c >= 0 && c < 4) { if (c === this.fall.col) this.fall.fast = true; else { this.fall.col = c; sfx('click'); } } } }
  update(dt) {
    if (this.card && !this.card.done) {
      this.card.time -= dt; const b = this.cardEl && this.cardEl.querySelector('.tbar'); if (b) b.style.width = clamp(this.card.time / this.card.max, 0, 1) * 100 + '%';
      if (this.card.time <= 0) { this.card.time = 0; this.choose(-1); }
    }
    if (this.fall) {
      const f = this.fall, floor = this.H - 110 - this.landed[f.col].length * 34;
      f.y += (f.fast ? 600 : f.speed) * dt;
      if (f.y >= floor) {
        const ok = f.col === f.it[1]; const cat = this.dropSet.cats[f.it[1]];
        this.answerSort(this.dropSet.lo, f.it[0], ok, `"${f.it[0]}" → ${cat}. ${f.it[2] || ''}`, cat);
        if (ok) { this.landed[f.col].push(f.it[0]); this.score += 30 + this.combo * 4; sfx('coin'); this.burst(this.colX(f.col) + this.colW() / 2, f.y, COLS[f.col], 12); }
        else { this.conf--; sfx('wrong'); this.shake(6); this.explain({ opts: [cat], a: 0, ex: `"${f.it[0]}" belongs in ${cat}.` }, 2400); if (this.conf <= 0) return this.finish(false); }
        this.fall = null; setTimeout(() => this.spawnTile(), ok ? 200 : 900);
      }
    }
  }
  finish(win) { this.cardEl && this.cardEl.remove(); this.fall = null; this.over || setTimeout(() => this.end({ title: win ? 'Shareholders are delighted!' : 'The board lost confidence', win, extra: `<p class="center">Group value created: <b>$${fmt(Math.round(this.value))}</b></p>` }), 400); }

  draw(g) {
    const W = this.W, H = this.H;
    const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, '#13294b'); grd.addColorStop(1, '#3a5f8f'); g.fillStyle = grd; g.fillRect(0, 0, W, H);
    for (const b of this.city) { g.fillStyle = '#0d1b33'; const bh = b.h * H; g.fillRect(b.x * W, H - bh, b.w * W, bh); g.fillStyle = '#ffd23f33'; for (let y = H - bh + 8; y < H - 10; y += 14) for (let x = b.x * W + 4; x < (b.x + b.w) * W - 6; x += 10) if ((x * y) % 7 < 3) g.fillRect(x, y, 4, 6); }
    // dashboard
    g.fillStyle = '#0009'; g.fillRect(0, 0, W, 60);
    this.text(`Q${this.quarter}`, 14, 20, { size: 16, align: 'left', color: '#ffd23f' });
    this.text(`Cost of capital ${this.coc}%`, 14, 44, { size: 12, align: 'left', stroke: false, weight: 600 });
    this.divs.forEach((d, i) => { const x = W * 0.38 + i * W * 0.2; this.text(d.n, x, 18, { size: 11, color: d.c, stroke: false }); this.text(`ROI ${d.roi}%`, x, 38, { size: 13, stroke: false }); });
    this.text('⭐'.repeat(Math.max(0, this.conf)), 12, H - 22, { size: 16, align: 'left' });
    this.text(`${Math.round(this.score)}`, W - 12, H - 22, { size: 20, align: 'right', color: '#ffd23f' });
    if (this.dropSet && (this.fall || this.landed.some(l => l.length))) {
      const cw = this.colW();
      for (let i = 0; i < 4; i++) {
        const x = this.colX(i); g.fillStyle = i === (this.fall && this.fall.col) ? '#ffffff22' : '#ffffff0c'; g.fillRect(x + 3, 70, cw - 6, H - 140);
        g.font = `800 ${Math.min(13, cw / 8)}px ${F}`; this.text(this.dropSet.cats[i], x + cw / 2, H - 82, { size: Math.min(13, cw / 8), color: COLS[i] });
        this.landed[i].forEach((t, k) => { g.fillStyle = COLS[i]; roundRect(g, x + 6, H - 110 - (k + 1) * 34 + 4, cw - 12, 30, 6); g.fill(); this.text(t.length > 16 ? t.slice(0, 15) + '…' : t, x + cw / 2, H - 110 - k * 34 - 15, { size: 10, color: '#000', stroke: false }); });
      }
      if (this.fall) { const f = this.fall, x = this.colX(f.col);
        g.fillStyle = '#fffdf6'; roundRect(g, x + 4, f.y - 32, cw - 8, 32, 8); g.fill();
        const lines = this.split(f.it[0], cw - 14); lines.forEach((l, k) => this.text(l, x + cw / 2, f.y - 16 + (k - (lines.length - 1) / 2) * 12, { size: 11, color: '#1b1b2f', stroke: false }));
        this.text('Tap a column to move · tap again to drop', W / 2, 82, { size: 11, stroke: false, weight: 600 });
      }
    }
  }
  split(t, w) { const g = this.g; g.font = `700 11px ${F}`; const words = t.split(' '); const out = []; let l = ''; for (const wd of words) { const tt = l ? l + ' ' + wd : wd; if (g.measureText(tt).width > w && l) { out.push(l); l = wd; } else l = tt; } out.push(l); return out.slice(0, 2); }
  destroy() { this.cardEl && this.cardEl.remove(); }
}
