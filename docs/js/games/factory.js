// M3 – Overhead Factory (industrial cartoon).
// Phase A "Diverter": crates drop off the belt — point the diverter at the right chute.
// Phase B "Crane": a calculation is posted; answer crates loop on the conveyor — drop the claw on the right one.
import { Game, rand, randi, pick, clamp, roundRect, LETTERS } from '../core/engine.js';
import { sfx } from '../core/audio.js';
import { sortSets, questionFor, nextQuestion } from '../core/questions.js';

const F = 'Outfit, system-ui, sans-serif';
const CALC = ['oar', 'under_over', 'apportion', 'mc_ac_diff', 'mc_profit', 'abc_unit', 'eu', 'process_loss', 'process_input', 'job_price'];
const COLORS = ['#ff7a3f', '#3fd2ff', '#ffd23f', '#3fff8b'];

export default class Factory extends Game {
  static id = 'factory'; static mod = 3; static music = 'factory'; static theme = 'factory';
  init() {
    this.sets = sortSets(['apportion', 'direct', 'function', 'abc']);
    this.lives = 4; this.round = 0; this.gearA = 0; this.belt = 0;
    this.startDiverter();
  }
  // ── Phase A
  startDiverter() {
    this.phase = 'A'; this.round++; this.set = pick(this.sets); this.div = 0; this.crates = []; this.toSpawn = 6 + this.round; this.spawnT = 0.5;
    this.beltSpeed = 90 + this.round * 18; this.qpanel(null);
    this.toast(`Shift ${this.round}: ${this.set.title}`, '#ffd23f', 1500); sfx('crane');
  }
  // ── Phase B
  startCrane() {
    this.phase = 'B'; this.qLeft = this.round >= 3 ? 4 : 3; this.claw = { x: this.W / 2, y: 0, state: 'idle', hold: null }; this.newCalc();
  }
  newCalc() {
    const q = Math.random() < 0.82 ? questionFor(pick(CALC)) : nextQuestion({ mods: [3], kind: 'concept', maxOpt: 22 });
    this.q = q; this.qTime = 35; this.qMax = 35;
    this.qpanel(q, { title: `🏗 CRANE ORDER — grab the right crate (${this.qLeft} left)`, timer: true });
    const n = 8; this.loop = []; const spacing = Math.max(150, this.W / 4.5);
    for (let k = 0; k < n; k++) this.loop.push({ i: k % 4, x: -k * spacing, picked: false });
    this.loopW = n * spacing;
  }
  get beltY() { return this.phase === 'A' ? this.H * 0.34 : this.H * 0.78; }
  update(dt) {
    this.gearA += dt; this.belt += dt * (this.phase === 'A' ? this.beltSpeed : 110);
    if (this.phase === 'A') {
      this.spawnT -= dt;
      if (this.spawnT <= 0 && this.toSpawn > 0) {
        this.toSpawn--; const it = pick(this.set.items);
        this.crates.push({ it, x: -60, y: this.beltY - 30, vy: 0, state: 'belt' }); this.spawnT = rand(1.6, 2.4) * Math.max(0.55, 1 - this.round * 0.08);
      }
      const endX = this.W * 0.5;
      for (const c of this.crates) {
        if (c.state === 'belt') { c.x += this.beltSpeed * dt; if (c.x >= endX) { c.state = 'fall'; c.target = this.div; sfx('swoosh'); } }
        else if (c.state === 'fall') {
          const tx = this.chuteX(c.target); c.x += (tx - c.x) * Math.min(1, dt * 5); c.vy += 900 * dt; c.y += c.vy * dt;
          if (c.y > this.H * 0.8) { c.state = 'done'; this.land(c); }
        }
      }
      this.crates = this.crates.filter(c => c.state !== 'done');
      if (this.toSpawn <= 0 && !this.crates.length && !this.over) this.startCrane();
    } else {
      if (!this.q) return;
      this.qTime -= dt; this.setTimerBar(this.qTime / this.qMax);
      if (this.qTime <= 0) { this.answer(this.q, -1); this.lives--; this.toast('⏰ Too slow!', '#ff3f7a'); this.afterCalc(false); return; }
      for (const b of this.loop) { b.x += 110 * dt; if (b.x > this.W + 80) b.x -= this.loopW; }
      const cl = this.claw;
      if (cl.state === 'idle') {
        let mv = 0; if (this.keys.has('ArrowLeft') || this.keys.has('a')) mv = -1; if (this.keys.has('ArrowRight') || this.keys.has('d')) mv = 1;
        cl.x = clamp(cl.x + mv * 380 * dt, 40, this.W - 40);
        if (this.pointer.down && this.dragging) cl.x += (this.pointer.x - cl.x) * Math.min(1, dt * 12);
      } else if (cl.state === 'down') {
        cl.y += 700 * dt;
        if (cl.y >= this.beltY - 99 - this.railY()) {
          const hit = this.loop.find(b => !b.picked && Math.abs(b.x - cl.x) < 55);
          cl.state = 'up'; if (hit) { hit.picked = true; cl.hold = hit; sfx('thud'); }
        }
      } else if (cl.state === 'up') {
        cl.y -= 600 * dt;
        if (cl.y <= 0) { cl.y = 0; cl.state = 'idle'; if (cl.hold) { const ok = this.answer(this.q, cl.hold.i); this.burst(cl.x, this.railY(), ok ? '#3fff8b' : '#ff3f7a', 26); if (ok) { this.score += 80 + Math.round(this.qTime * 3); sfx('cash'); this.toast('✔ Correct!', '#3fff8b'); } else { this.lives--; this.shake(10); sfx('boom'); } cl.hold = null; this.afterCalc(ok); } }
      }
    }
  }
  afterCalc() {
    this.q = null;
    if (this.lives <= 0) return this.finish(false);
    this.qLeft--;
    if (this.qLeft <= 0) { if (this.round >= 3) return this.finish(true); this.startDiverter(); }
    else setTimeout(() => !this.over && this.newCalc(), 300);
  }
  finish(win) { this.qpanel(null); setTimeout(() => this.end({ title: win ? 'Factory audited!' : 'Factory shut down', win }), 500); }
  land(c) {
    const ok = c.target === c.it[1];
    this.answerSort(this.set.lo, c.it[0], ok, `${c.it[2] || ''} → ${this.set.cats[c.it[1]]}`, this.set.cats[c.it[1]]);
    const x = this.chuteX(c.target);
    if (ok) { this.score += 25 + this.combo * 3; this.burst(x, this.H * 0.82, '#3fff8b', 14); sfx('coin'); this.float(x, this.H * 0.75, '+' + (25 + this.combo * 3), '#3fff8b'); }
    else { this.lives--; this.shake(8); sfx('wrong'); this.burst(x, this.H * 0.82, '#ff3f7a', 20); this.explain({ opts: [this.set.cats[c.it[1]]], a: 0, ex: `"${c.it[0]}" → ${this.set.cats[c.it[1]]}. ${c.it[2] || ''}` }, 2600); if (this.lives <= 0) this.finish(false); }
  }
  railY() { const qp = this.hud.querySelector('.qpanel'); return Math.min(this.beltY - 220, qp ? qp.offsetTop + qp.offsetHeight + 16 : 130); }
  chuteX(i) { const n = this.set.cats.length; return this.W * (i + 0.5) / n; }
  setDiv(i) { if (i >= 0 && i < this.set.cats.length && this.div !== i) { this.div = i; sfx('click'); } }
  onKey(k, down) {
    if (!down) return;
    if (this.phase === 'A') { if ('1234'.includes(k)) this.setDiv(+k - 1); if (k === 'ArrowLeft' || k === 'a') this.setDiv(this.div - 1); if (k === 'ArrowRight' || k === 'd') this.setDiv(this.div + 1); }
    else if ((k === ' ' || k === 'ArrowDown' || k === 's') && this.claw.state === 'idle' && this.q) { this.claw.state = 'down'; sfx('crane'); }
  }
  onDown(x, y) {
    if (this.phase === 'A') { if (y > this.H * 0.5) this.setDiv(Math.floor(x / (this.W / this.set.cats.length))); }
    else { this.dragging = true; this.downX = x; this.downT = this.t; }
  }
  onUp(x) {
    if (this.phase === 'B') { this.dragging = false; if (this.claw.state === 'idle' && this.q && (this.t - this.downT < 0.25 || Math.abs(x - this.downX) < 12)) { this.claw.x = x; this.claw.state = 'down'; sfx('crane'); } }
  }

  draw(g) {
    const W = this.W, H = this.H;
    g.fillStyle = '#2b2f3a'; g.fillRect(0, 0, W, H);
    // bricks
    g.fillStyle = '#323746'; for (let y = 0; y < H; y += 26) for (let x = (y / 26 % 2) * 30; x < W; x += 60) g.fillRect(x, y, 56, 22);
    this.gear(g, 40, H * 0.15, 34, this.gearA); this.gear(g, W - 50, H * 0.12, 26, -this.gearA * 1.4); this.gear(g, W - 20, H * 0.5, 40, this.gearA * 0.7);
    // pipes
    g.fillStyle = '#5b6478'; g.fillRect(0, 70, W, 10); g.fillRect(W * 0.2, 70, 10, H * 0.2);
    if (this.phase === 'A') this.drawA(g); else this.drawB(g);
    this.text('🔧'.repeat(Math.max(0, this.lives)), 12, H - 22, { size: 20, align: 'left' });
    this.text(`${Math.round(this.score)}`, W - 12, H - 22, { size: 22, align: 'right', color: '#ffd23f' });
  }
  drawBelt(g, y, x0, x1) {
    g.fillStyle = '#1a1c22'; g.fillRect(x0, y, x1 - x0, 18); g.fillStyle = '#444b5c';
    for (let x = x0 - 40 + (this.belt % 40); x < x1; x += 40) g.fillRect(Math.max(x0, x), y + 4, 20, 10);
    g.fillStyle = '#777'; g.beginPath(); g.arc(x0, y + 9, 11, 0, 7); g.arc(x1, y + 9, 11, 0, 7); g.fill();
  }
  crate(g, x, y, w, h, label, color, sub) {
    g.save(); g.translate(x, y);
    g.fillStyle = color; roundRect(g, -w / 2, -h / 2, w, h, 6); g.fill(); g.strokeStyle = '#0006'; g.lineWidth = 3; g.stroke();
    g.strokeStyle = '#0003'; g.beginPath(); g.moveTo(-w / 2 + 4, -h / 2 + 4); g.lineTo(w / 2 - 4, h / 2 - 4); g.stroke();
    g.restore();
    this.text(label, x, y - (sub ? 9 : 0), { size: sub ? 24 : 13, color: '#fff' });
    if (sub) this.text(sub, x, y + 15, { size: 12, color: '#fff' });
  }
  drawA(g) {
    const W = this.W, H = this.H, by = this.beltY;
    this.drawBelt(g, by, 0, W * 0.5);
    // diverter arm
    const px = W * 0.5, py = by + 40, tx = this.chuteX(this.div);
    g.strokeStyle = '#ffd23f'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(px, py); g.lineTo(px + (tx - px) * 0.6, py + 70); g.stroke();
    g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(px, py, 12, 0, 7); g.fill();
    // chutes
    const n = this.set.cats.length, cw = W / n;
    for (let i = 0; i < n; i++) {
      const x = i * cw, on = i === this.div;
      g.fillStyle = on ? COLORS[i] : '#3c4252'; g.fillRect(x + 6, H * 0.6, cw - 12, H * 0.28);
      g.fillStyle = '#0007'; g.fillRect(x + 12, H * 0.6 + 6, cw - 24, H * 0.28 - 12);
      const words = this.set.cats[i].split(' ');
      words.forEach((w, k) => this.text(w, x + cw / 2, H * 0.68 + k * 18, { size: Math.min(16, cw / 7), color: on ? COLORS[i] : '#ccc' }));
      this.text(`${i + 1}`, x + cw / 2, H * 0.84, { size: 14, color: '#888' });
    }
    for (const c of this.crates) {
      g.font = `700 13px ${F}`; const w = clamp(g.measureText(c.it[0]).width + 20, 90, W * 0.45);
      this.crate(g, c.x, c.y, w, 46, '', '#c98a3a');
      const lines = c.it[0].length > 22 ? [c.it[0].slice(0, c.it[0].lastIndexOf(' ', 22)), c.it[0].slice(c.it[0].lastIndexOf(' ', 22) + 1)] : [c.it[0]];
      lines.forEach((l, i) => this.text(l, c.x, c.y + (i - (lines.length - 1) / 2) * 15, { size: 13 }));
    }
    this.text(this.set.title.toUpperCase(), W / 2, 40, { size: 18, color: '#ffd23f' });
    this.text('Tap a chute (or 1–4 / ←→) to aim the diverter', W / 2, H * 0.55, { size: 12, color: '#bbb', stroke: false, weight: 600 });
  }
  drawB(g) {
    const W = this.W, by = this.beltY, cl = this.claw;
    this.drawBelt(g, by, 0, W);
    if (this.q) for (const b of this.loop) if (!b.picked && !(cl.hold === b)) this.crate(g, b.x, by - 34, Math.min(130, W / 4.4), 62, LETTERS[b.i], COLORS[b.i], this.q.opts[b.i].length <= 14 ? this.q.opts[b.i] : '');
    // rail + claw
    const ry = this.railY();
    g.fillStyle = '#555c70'; g.fillRect(0, ry, W, 12);
    const cy = ry + 12 + cl.y;
    g.strokeStyle = '#aaa'; g.lineWidth = 3; g.beginPath(); g.moveTo(cl.x, ry + 12); g.lineTo(cl.x, cy); g.stroke();
    g.fillStyle = '#ffd23f'; g.fillRect(cl.x - 22, ry - 6, 44, 20);
    g.strokeStyle = '#ddd'; g.lineWidth = 5; g.beginPath(); g.moveTo(cl.x - 24, cy + 22); g.lineTo(cl.x - 10, cy); g.lineTo(cl.x + 10, cy); g.lineTo(cl.x + 24, cy + 22); g.stroke();
    if (cl.hold) this.crate(g, cl.x, cy + 50, Math.min(130, W / 4.4), 62, LETTERS[cl.hold.i], COLORS[cl.hold.i]);
    this.text('Drag to move the crane · tap / Space to grab', W / 2, this.H - 60, { size: 12, color: '#bbb', stroke: false, weight: 600 });
  }
  gear(g, x, y, r, a) {
    g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = '#4a5163';
    for (let i = 0; i < 8; i++) { g.rotate(Math.PI / 4); g.fillRect(-5, -r - 6, 10, 12); }
    g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.fillStyle = '#2b2f3a'; g.beginPath(); g.arc(0, 0, r * 0.35, 0, 7); g.fill(); g.restore();
  }
}
