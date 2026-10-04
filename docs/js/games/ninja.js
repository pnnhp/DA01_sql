// M1 – Info Ninja: slice the flying labels that match the call-out. Boss: slice the correct answer scroll.
import { Game, rand, randi, pick, clamp, roundRect, LETTERS } from '../core/engine.js';
import { sfx } from '../core/audio.js';
import { sortSets, nextQuestion } from '../core/questions.js';

export default class Ninja extends Game {
  static id = 'ninja'; static mod = 1; static music = 'ninja'; static theme = 'ninja';
  init() {
    this.sets = sortSets(['info', 'famafa', 'ma1']);
    this.lives = 3; this.items = []; this.trail = []; this.spawnT = 1; this.phaseT = 0; this.roundTime = 70;
    this.newPrompt(); this.boss = null; this.stars = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), s: rand(0.5, 2) }));
  }
  newPrompt() {
    this.set = pick(this.sets); this.cat = randi(0, this.set.cats.length - 1); this.phaseT = 12;
    this.toast(`SLICE: ${this.set.cats[this.cat]}`, '#ffd23f', 1600); sfx('swoosh');
  }
  launch(item) {
    const g = 700, apex = rand(this.H * 0.18, this.H * 0.45);
    item.x = rand(this.W * 0.12, this.W * 0.88); item.y = this.H + 30;
    item.vy = -Math.sqrt(2 * g * (this.H + 30 - apex)); item.vx = (this.W / 2 - item.x) * rand(0.1, 0.45) + rand(-40, 40);
    item.g = g; item.rot = 0; item.vr = rand(-1, 1); this.items.push(item);
  }
  spawn() {
    if (Math.random() < 0.1) { this.launch({ bomb: true, label: pick(['💣 Sunk cost', '💣 Absorbed OH', '💣 Info overload']), w: 130, h: 40 }); return; }
    const want = Math.random() < 0.5;
    const pool = this.set.items.filter(i => (i[1] === this.cat) === want);
    const it = pick(pool.length ? pool : this.set.items);
    this.g.font = '700 15px Outfit, system-ui, sans-serif'; const w = Math.min(this.W * 0.6, this.g.measureText(it[0]).width + 26);
    this.launch({ label: it[0], c: it[1], why: it[2], set: this.set, w, h: 38 });
  }
  startBoss() {
    this.items = []; this.boss = { hp: 5, max: 5, q: null, scrolls: [], hitT: 0 }; this.toast('🐉 BOSS: slice the right scroll!', '#ff3f7a', 1800); sfx('alarm');
    setTimeout(() => this.nextBossQ(), 1200);
  }
  nextBossQ() {
    if (this.over || !this.boss) return;
    const q = nextQuestion({ mods: [1], kind: 'concept' }); this.boss.q = q; this.boss.wait = false; this.qpanel(q, { title: 'DRAGON QUESTION' });
    this.boss.scrolls = q.opts.map((o, i) => ({ i, x: this.W * (0.14 + i * 0.24), y: this.H + 40 + i * 30, vy: -rand(130, 170), label: LETTERS[i], w: 64, h: 64, sliced: false }));
  }
  update(dt) {
    if (!this.boss) {
      this.roundTime -= dt; this.phaseT -= dt; this.spawnT -= dt;
      if (this.phaseT <= 0) this.newPrompt();
      if (this.spawnT <= 0) { this.spawn(); if (Math.random() < 0.35 + this.t / 200) this.spawn(); this.spawnT = rand(0.7, 1.3) * Math.max(0.55, 1 - this.t / 150); }
      if (this.roundTime <= 0) this.startBoss();
    } else {
      const b = this.boss; b.hitT = Math.max(0, b.hitT - dt);
      for (const s of b.scrolls) { s.y += s.vy * dt; if (s.y < this.H * 0.42) s.vy = Math.abs(s.vy) * 0.15; }
      if (!b.wait && b.scrolls.length && b.scrolls.every(s => s.y > this.H + 80 && s.vy > 0)) { this.nextBossQ(); }
    }
    for (const it of this.items) { it.x += it.vx * dt; it.y += it.vy * dt; it.vy += it.g * dt; it.rot += it.vr * dt; }
    this.items = this.items.filter(it => it.y < this.H + 80 && !it.dead);
    this.trail = this.trail.filter(p => (p.life -= dt) > 0);
  }
  onDown(x, y) { this.trail.push({ x, y, life: 0.25 }); this.lastP = { x, y }; }
  onMove(x, y) {
    if (!this.pointer.down || !this.lastP) return;
    const p0 = this.lastP; this.trail.push({ x, y, life: 0.25 }); this.lastP = { x, y };
    if (Math.hypot(x - p0.x, y - p0.y) < 4) return;
    const hits = obj => { for (let k = 0; k <= 6; k++) { const px = p0.x + (x - p0.x) * k / 6, py = p0.y + (y - p0.y) * k / 6; if (Math.abs(px - obj.x) < obj.w / 2 && Math.abs(py - obj.y) < obj.h / 2) return true; } return false; };
    if (this.boss) {
      for (const s of this.boss.scrolls) if (!s.sliced && hits(s)) this.sliceScroll(s);
      return;
    }
    for (const it of this.items) if (!it.dead && hits(it)) this.slice(it);
  }
  onUp() { this.lastP = null; }
  slice(it) {
    it.dead = true; sfx('slice'); this.burst(it.x, it.y, it.bomb ? '#ff3f7a' : '#3fd2ff', 16);
    if (it.bomb) { this.lives--; this.shake(10); sfx('boom'); this.float(it.x, it.y, 'BOOM −1 ♥', '#ff3f7a'); this.checkDead(); return; }
    const ok = it.c === this.cat;
    this.answerSort(it.set.lo, it.label, ok, it.why ? `${it.why} (→ ${it.set.cats[it.c]})` : `It belongs to: ${it.set.cats[it.c]}.`, it.set.cats[it.c]);
    if (ok) { const pts = 10 * (1 + Math.min(this.combo, 10) * 0.2); this.score += pts; this.float(it.x, it.y, `+${Math.round(pts)}${this.combo > 2 ? ' ×' + this.combo : ''}`, '#3fff8b'); sfx('coin'); }
    else { this.lives--; this.shake(8); sfx('wrong'); this.float(it.x, it.y, `✗ ${it.set.cats[it.c]}`, '#ff3f7a', 18); this.explain({ q: '', opts: [it.set.cats[it.c]], a: 0, ex: it.why || '' }, 2500); this.checkDead(); }
  }
  sliceScroll(s) {
    const b = this.boss; if (b.wait) return; b.wait = true; s.sliced = true; sfx('slice'); this.burst(s.x, s.y, '#ffd23f', 20);
    const ok = this.answer(b.q, s.i);
    if (ok) { b.hp--; b.hitT = 0.4; this.score += 50; this.shake(8); this.float(this.W / 2, this.H * 0.25, '−1 🐉', '#ffd23f', 30); }
    else { this.lives--; this.checkDead(); }
    b.scrolls.forEach(x => { x.vy = 400; });
    if (b.hp <= 0) { this.qpanel(null); this.score += 200; setTimeout(() => this.end({ title: 'Dragon defeated!', win: true }), 600); }
    else setTimeout(() => this.nextBossQ(), ok ? 700 : 4200);
  }
  checkDead() { if (this.lives <= 0) { this.qpanel(null); setTimeout(() => this.end({ title: 'Out of lives', win: false }), 400); } }

  draw(g) {
    const W = this.W, H = this.H;
    const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, '#1a0b2e'); grd.addColorStop(1, '#0b1a2a'); g.fillStyle = grd; g.fillRect(0, 0, W, H);
    // moon + ink mountains
    g.fillStyle = '#ffe9b0'; g.globalAlpha = 0.9; g.beginPath(); g.arc(W * 0.8, H * 0.2, Math.min(W, H) * 0.09, 0, 7); g.fill(); g.globalAlpha = 1;
    for (const s of this.stars) { g.fillStyle = '#fff6'; g.fillRect(s.x * W, s.y * H * 0.6, s.s, s.s); }
    g.fillStyle = '#0a0612'; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 40) g.lineTo(x, H * 0.78 - Math.sin(x * 0.012) * 40 - Math.sin(x * 0.03) * 15); g.lineTo(W, H); g.fill();
    // items
    for (const it of this.items) {
      g.save(); g.translate(it.x, it.y); g.rotate(Math.sin(it.rot) * 0.15);
      roundRect(g, -it.w / 2, -it.h / 2, it.w, it.h, 12);
      g.fillStyle = it.bomb ? '#3a0a14' : '#f7f1e3'; g.fill(); g.lineWidth = 3; g.strokeStyle = it.bomb ? '#ff3f7a' : '#2b1d0e'; g.stroke();
      g.fillStyle = it.bomb ? '#ff9ab8' : '#2b1d0e'; g.font = '700 15px Outfit, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      let label = it.label; while (g.measureText(label).width > it.w - 14 && label.length > 4) label = label.slice(0, -2);
      g.fillText(label === it.label ? label : label + '…', 0, 1); g.restore();
    }
    // boss
    if (this.boss) {
      const b = this.boss, cx = W / 2, cy = H * 0.3 + Math.sin(this.t * 2) * 8;
      g.save(); g.translate(cx, cy); if (b.hitT > 0) g.translate(rand(-6, 6), rand(-6, 6));
      g.fillStyle = b.hitT > 0 ? '#fff' : '#c21f4a'; g.beginPath(); g.ellipse(0, 0, 90, 55, 0, 0, 7); g.fill();
      g.fillStyle = '#7a0f2c'; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 22 - 10, -48); g.lineTo(i * 22, -78 - Math.abs(i) * -4); g.lineTo(i * 22 + 10, -48); g.fill(); }
      g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(-32, -10, 9, 0, 7); g.arc(32, -10, 9, 0, 7); g.fill();
      g.fillStyle = '#000'; g.fillRect(-34, -16, 4, 12); g.fillRect(30, -16, 4, 12);
      g.restore();
      g.fillStyle = '#0008'; g.fillRect(W / 2 - 100, cy - 100, 200, 10); g.fillStyle = '#ff3f7a'; g.fillRect(W / 2 - 100, cy - 100, 200 * b.hp / b.max, 10);
      for (const s of b.scrolls) {
        if (s.sliced) continue;
        g.save(); g.translate(s.x, s.y); g.fillStyle = '#f2dfb0'; roundRect(g, -30, -32, 60, 64, 8); g.fill(); g.fillStyle = '#8b5a2b'; g.fillRect(-34, -34, 68, 8); g.fillRect(-34, 26, 68, 8);
        g.fillStyle = '#2b1d0e'; g.font = '900 30px Outfit, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s.label, 0, 2); g.restore();
      }
    }
    // trail
    if (this.trail.length > 1) {
      g.lineCap = 'round'; for (let i = 1; i < this.trail.length; i++) { const a = this.trail[i - 1], b = this.trail[i]; g.strokeStyle = `rgba(160,240,255,${b.life * 4})`; g.lineWidth = 2 + b.life * 30; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
    }
    // HUD
    if (!this.boss) {
      this.text(`SLICE: ${this.set.cats[this.cat]}`, W / 2, 30 + (this.hud.querySelector('.qpanel') ? 80 : 0), { size: 22, color: '#ffd23f' });
      this.text(`⏱ ${Math.ceil(this.roundTime)}s`, W / 2, 58, { size: 14, color: '#fff' });
    }
    this.text('♥'.repeat(Math.max(0, this.lives)), 14, H - 24, { size: 26, color: '#ff3f7a', align: 'left' });
    this.text(`${Math.round(this.score)}`, W - 14, H - 24, { size: 26, color: '#fff', align: 'right' });
  }
}
