// M2 – Cost Runner (retro pixel): run through the gate matching the cost, dodge sunk-cost bombs.
// Every few gates a "number gate" appears: high-low, relevant costs, deprival value.
import { Game, rand, randi, pick, clamp, LETTERS } from '../core/engine.js';
import { sfx } from '../core/audio.js';
import { sortSets, questionFor, nextQuestion } from '../core/questions.js';

const PX = '"Press Start 2P", ui-monospace, monospace';
const CALC = ['highlow_vc', 'highlow_fixed', 'highlow_forecast', 'rel_material', 'deprival'];

export default class Runner extends Game {
  static id = 'runner'; static mod = 2; static music = 'pixel'; static theme = 'pixel';
  init() {
    this.sets = sortSets(['behaviour', 'relevant']);
    this.lane = 1; this.px = 1; this.lives = 3; this.speed = 230; this.dist = 0; this.objs = []; this.gates = 0;
    this.nextGate = 260; this.nextObj = 120; this.anim = 0; this.goal = 24; this.inv = 0;
    this.trees = Array.from({ length: 14 }, (_, i) => ({ y: i * 70, side: i % 2, k: randi(0, 2) }));
  }
  get road() { const w = Math.min(this.W - 40, 520); return { x: (this.W - w) / 2, w, lw: w / 4 }; }
  get py() { return this.H - 120; }
  laneX(l) { const r = this.road; return r.x + r.lw * (l + 0.5); }

  makeGate() {
    this.gates++;
    if (this.gates % 5 === 0) {
      const q = Math.random() < 0.8 ? questionFor(pick(CALC)) : nextQuestion({ mods: [2], kind: 'concept' });
      this.objs.push({ type: 'gate', y: -60, q, segs: q.opts.map((o, i) => ({ l0: i, l1: i, label: LETTERS[i], sub: o.length <= 11 ? o : '' })) });
      this.qpanel(q, { title: '🔢 NUMBER GATE — run into the right letter' }); this.slow = true; sfx('alarm');
      return;
    }
    const set = pick(this.sets); const it = pick(set.items);
    let segs;
    if (set.cats.length === 4) { const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5); segs = order.map((c, l) => ({ l0: l, l1: l, label: set.cats[c], c })); }
    else { const flip = Math.random() < 0.5; segs = [{ l0: 0, l1: 1, label: set.cats[flip ? 1 : 0], c: flip ? 1 : 0 }, { l0: 2, l1: 3, label: set.cats[flip ? 0 : 1], c: flip ? 0 : 1 }]; }
    this.objs.push({ type: 'gate', y: -60, set, item: it, segs });
  }
  update(dt) {
    const sp = this.slow ? (this.py + 60) / 20 : this.speed; // number gates give ~20s to calculate
    this.dist += sp * dt; this.anim += dt * (sp / 40);
    this.px += (this.lane - this.px) * Math.min(1, dt * 14);
    this.inv = Math.max(0, this.inv - dt);
    this.nextGate -= sp * dt; this.nextObj -= sp * dt;
    const gateOnScreen = this.objs.some(o => o.type === 'gate');
    if (this.nextGate <= 0 && !gateOnScreen) { this.makeGate(); this.nextGate = rand(520, 640); }
    if (this.nextObj <= 0) {
      this.nextObj = rand(70, 140);
      const t = Math.random(); const lane = randi(0, 3);
      const nearGate = this.objs.some(o => o.type === 'gate' && o.y < 160);
      if (!nearGate) this.objs.push({ type: t < 0.55 ? 'coin' : t < 0.82 ? 'rock' : 'bomb', lane, y: -30 });
    }
    for (const o of this.objs) o.y += sp * dt;
    for (const t of this.trees) { t.y += sp * dt; if (t.y > this.H + 40) t.y -= 14 * 70; }
    const pl = Math.round(this.px);
    for (const o of this.objs) {
      if (o.done) continue;
      if (o.type === 'gate' && o.y >= this.py - 10) { o.done = true; this.passGate(o); }
      else if (o.type !== 'gate' && Math.abs(o.y - this.py) < 24 && o.lane === pl) {
        o.done = true;
        if (o.type === 'coin') { this.score += 5; sfx('coin'); this.burst(this.laneX(o.lane), this.py, '#ffd23f', 8, 120, 5); }
        else if (this.inv <= 0) { this.lives--; this.inv = 1.2; this.shake(8); sfx(o.type === 'bomb' ? 'boom' : 'hit'); this.float(this.laneX(o.lane), this.py - 30, o.type === 'bomb' ? 'SUNK COST!' : 'OUCH', '#ff3f7a', 14); this.checkDead(); }
      }
    }
    this.objs = this.objs.filter(o => o.y < this.H + 80);
    this.speed = Math.min(430, 230 + this.gates * 7);
  }
  passGate(o) {
    const pl = Math.round(this.px); const seg = o.segs.find(s => pl >= s.l0 && pl <= s.l1);
    if (o.q) {
      const idx = o.segs.indexOf(seg); const ok = this.answer(o.q, idx);
      this.qpanel(null); this.slow = false;
      if (ok) { this.score += 60; this.toast('✔ +60', '#3fff8b'); } else { this.lives--; this.checkDead(); }
    } else {
      const ok = seg.c === o.item[1];
      this.answerSort(o.set.lo, o.item[0], ok, `${o.item[2] || ''} → ${o.set.cats[o.item[1]]}`, o.set.cats[o.item[1]]);
      if (ok) { const pts = 20 + Math.min(this.combo, 10) * 4; this.score += pts; this.float(this.laneX(pl), this.py - 40, `+${pts}`, '#3fff8b', 14); sfx('correct'); }
      else { this.lives--; sfx('wrong'); this.shake(8); this.explain({ opts: [o.set.cats[o.item[1]]], a: 0, ex: `"${o.item[0]}" → ${o.set.cats[o.item[1]]}. ${o.item[2] || ''}` }, 2600); this.checkDead(); }
    }
    this.burst(this.laneX(pl), this.py - 20, '#3fd2ff', 14);
    if (this.gates >= this.goal && !this.over && this.lives > 0) setTimeout(() => this.end({ title: `Finished ${this.goal} gates!`, win: true }), 500);
  }
  checkDead() { if (this.lives <= 0) { this.qpanel(null); setTimeout(() => this.end({ title: 'Wiped out!', win: false }), 300); } }
  move(d) { const nl = clamp(this.lane + d, 0, 3); if (nl !== this.lane) { this.lane = nl; sfx('jump'); } }
  onKey(k, down) { if (!down) return; if (k === 'ArrowLeft' || k === 'a') this.move(-1); if (k === 'ArrowRight' || k === 'd') this.move(1); if ('1234'.includes(k)) this.lane = +k - 1; }
  onDown(x, y) { this.sx = x; this.sy = y; this.swiped = false; }
  onMove(x) { if (this.pointer.down && !this.swiped && Math.abs(x - this.sx) > 30) { this.move(Math.sign(x - this.sx)); this.swiped = true; } }
  onUp(x) { if (!this.swiped) this.move(x < this.W / 2 ? -1 : 1); }

  draw(g) {
    const W = this.W, H = this.H, r = this.road;
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#3a8f3a'; g.fillRect(0, 0, W, H);
    for (let y = (this.dist % 32) - 32; y < H; y += 32) { g.fillStyle = '#358535'; g.fillRect(0, y, r.x, 16); g.fillRect(r.x + r.w, y + 16, W, 16); }
    for (const t of this.trees) { const x = t.side ? r.x + r.w + 14 + t.k * 14 : r.x - 44 - t.k * 14; this.tree(g, x, t.y); }
    g.fillStyle = '#4a4458'; g.fillRect(r.x, 0, r.w, H); g.fillStyle = '#fff'; g.fillRect(r.x - 6, 0, 6, H); g.fillRect(r.x + r.w, 0, 6, H);
    g.fillStyle = '#ffffff70';
    for (let l = 1; l < 4; l++) for (let y = (this.dist % 60) - 60; y < H; y += 60) g.fillRect(r.x + r.lw * l - 2, y, 4, 30);
    for (const o of this.objs) {
      if (o.type === 'gate') this.drawGate(g, o);
      else { const x = this.laneX(o.lane); if (o.done) continue;
        if (o.type === 'coin') { g.fillStyle = '#ffd23f'; g.fillRect(x - 8, o.y - 8, 16, 16); g.fillStyle = '#fff6a0'; g.fillRect(x - 4, o.y - 6, 4, 8); }
        if (o.type === 'rock') { g.fillStyle = '#777'; g.fillRect(x - 16, o.y - 10, 32, 20); g.fillStyle = '#555'; g.fillRect(x - 12, o.y - 14, 20, 8); }
        if (o.type === 'bomb') { g.fillStyle = '#111'; g.fillRect(x - 12, o.y - 12, 24, 24); g.fillStyle = '#ff3f7a'; g.fillRect(x - 2, o.y - 20, 4, 8); this.text('SUNK', x, o.y + 22, { size: 8, font: PX, color: '#ff9ab8', weight: 400 }); }
      }
    }
    // player
    const x = this.laneX(this.px), y = this.py; const f = Math.floor(this.anim) % 2;
    if (!(this.inv > 0 && Math.floor(this.t * 12) % 2)) {
      g.fillStyle = '#000'; g.globalAlpha = .3; g.fillRect(x - 12, y + 18, 24, 6); g.globalAlpha = 1;
      g.fillStyle = '#ffd23f'; g.fillRect(x - 8, y - 22, 16, 14); g.fillStyle = '#000'; g.fillRect(x - 4, y - 18, 3, 3); g.fillRect(x + 2, y - 18, 3, 3);
      g.fillStyle = '#ff3f7a'; g.fillRect(x - 10, y - 8, 20, 16); g.fillStyle = '#1d2f8a';
      g.fillRect(x - 8 + (f ? 0 : 4), y + 8, 6, 12); g.fillRect(x + 2 - (f ? 0 : 4), y + 8, 6, 12);
    }
    // HUD
    const gate = this.objs.find(o => o.type === 'gate' && !o.done && !o.q);
    if (gate) {
      g.fillStyle = '#000c'; g.fillRect(0, 0, W, 64); this.text(gate.set.title.toUpperCase(), W / 2, 18, { size: 9, font: PX, color: '#ffd23f', weight: 400 });
      this.text(gate.item[0], W / 2, 44, { size: Math.min(20, 520 / Math.max(10, gate.item[0].length)), color: '#fff' });
    }
    this.text('♥'.repeat(Math.max(0, this.lives)), 12, H - 22, { size: 16, font: PX, color: '#ff3f7a', align: 'left', weight: 400 });
    this.text(`${Math.round(this.score)}`, W - 12, H - 22, { size: 14, font: PX, align: 'right', weight: 400 });
    this.text(`GATE ${Math.min(this.gates, this.goal)}/${this.goal}`, W / 2, H - 22, { size: 10, font: PX, weight: 400 });
  }
  drawGate(g, o) {
    const r = this.road, colors = ['#3fd2ff', '#ff7a3f', '#b04bff', '#3fff8b'];
    o.segs.forEach((s, i) => {
      const x0 = r.x + r.lw * s.l0 + 3, w = r.lw * (s.l1 - s.l0 + 1) - 6;
      g.fillStyle = colors[i % 4]; g.fillRect(x0, o.y - 26, w, 52); g.fillStyle = '#0009'; g.fillRect(x0 + 3, o.y - 23, w - 6, 46);
      const lbl = s.label; const words = lbl.split(/[\s-]+/);
      if (o.q) { this.text(lbl, x0 + w / 2, o.y - (s.sub ? 7 : 0), { size: 18, font: PX, color: colors[i % 4], weight: 400 }); if (s.sub) this.text(s.sub, x0 + w / 2, o.y + 14, { size: 11, color: '#fff' }); }
      else if (words.length > 1 && w < 140) { this.text(words[0], x0 + w / 2, o.y - 8, { size: 9, font: PX, color: '#fff', weight: 400 }); this.text(words.slice(1).join(' '), x0 + w / 2, o.y + 9, { size: 9, font: PX, color: '#fff', weight: 400 }); }
      else this.text(lbl, x0 + w / 2, o.y, { size: Math.min(10, (w - 8) / lbl.length * 1.3), font: PX, color: '#fff', weight: 400 });
    });
  }
  tree(g, x, y) { g.fillStyle = '#5b3a1e'; g.fillRect(x + 12, y + 16, 8, 14); g.fillStyle = '#1f6b2a'; g.fillRect(x, y, 32, 20); g.fillRect(x + 6, y - 10, 20, 12); }
}
