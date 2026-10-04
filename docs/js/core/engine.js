// Shared game runtime: canvas loop, input (touch/mouse/keyboard), particles, HUD, answers, results.
import { sfx, music, vibrate, unlock } from './audio.js';
import { record, addXP, logGame, state, readiness } from './store.js';
import { CARDS, modById } from '../content/syllabus.js';

export const rand = (a, b) => a + Math.random() * (b - a);
export const randi = (a, b) => Math.floor(rand(a, b + 1));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const dist = (a, b, c, d) => Math.hypot(a - c, b - d);
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const LETTERS = ['A', 'B', 'C', 'D'];

export function roundRect(g, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
export function wrapLines(g, text, maxW) {
  const words = String(text).split(' '); const lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
export function fitText(g, text, maxW, size, font = 'Outfit, system-ui, sans-serif', weight = 700) {
  let s = size; g.font = `${weight} ${s}px ${font}`;
  while (g.measureText(text).width > maxW && s > 8) { s--; g.font = `${weight} ${s}px ${font}`; }
  return s;
}

export class Game {
  constructor(app, opts = {}) {
    this.app = app; this.opts = opts; this.t = 0; this.paused = false; this.over = false;
    this.particles = []; this.floaters = []; this.shakeT = 0; this.shakeMag = 0;
    this.answers = []; this.score = 0; this.combo = 0; this.bestCombo = 0;
    this.keys = new Set(); this.pointer = { x: 0, y: 0, down: false, id: null };
  }
  // ── lifecycle hooks for subclasses
  init() {} update(dt) {} draw(g) {} onDown(x, y, e) {} onMove(x, y, e) {} onUp(x, y, e) {} onKey(k, down) {} destroy() {}

  get W() { return this.cw; } get H() { return this.ch; }

  mount(root) {
    this.root = root;
    root.innerHTML = `<div class="stage ${this.constructor.theme || ''}"><canvas></canvas><div class="hud"></div>
      <button class="pausebtn" aria-label="Pause">❚❚</button></div>`;
    this.stage = root.querySelector('.stage'); this.canvas = root.querySelector('canvas'); this.hud = root.querySelector('.hud');
    this.g = this.canvas.getContext('2d');
    this.resize = () => {
      const r = this.stage.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.cw = r.width; this.ch = r.height; this.dpr = dpr;
      this.canvas.width = Math.round(r.width * dpr); this.canvas.height = Math.round(r.height * dpr);
      this.onResize && this.onResize();
    };
    this.resize(); window.addEventListener('resize', this.resize);
    const pos = e => { const r = this.canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    this.canvas.addEventListener('pointerdown', e => { unlock(); if (this.paused || this.over) return; this.canvas.setPointerCapture?.(e.pointerId); const [x, y] = pos(e); Object.assign(this.pointer, { x, y, down: true, id: e.pointerId }); this.onDown(x, y, e); });
    this.canvas.addEventListener('pointermove', e => { const [x, y] = pos(e); if (e.pointerId === this.pointer.id || !this.pointer.down) Object.assign(this.pointer, { x, y }); if (!this.paused) this.onMove(x, y, e); });
    const up = e => { const [x, y] = pos(e); if (e.pointerId === this.pointer.id) this.pointer.down = false; if (!this.paused) this.onUp(x, y, e); };
    this.canvas.addEventListener('pointerup', up); this.canvas.addEventListener('pointercancel', up);
    this.keyDown = e => {
      if (e.key === 'Escape' || e.key === 'p') { this.togglePause(); return; }
      if (this.paused || this.over) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (!this.keys.has(k)) this.onKey(k, true); this.keys.add(k);
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    };
    this.keyUp = e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; this.keys.delete(k); this.onKey(k, false); };
    window.addEventListener('keydown', this.keyDown); window.addEventListener('keyup', this.keyUp);
    root.querySelector('.pausebtn').onclick = () => this.togglePause();
    this.visHandler = () => { if (document.hidden && !this.paused && !this.over) this.togglePause(); };
    document.addEventListener('visibilitychange', this.visHandler);
  }

  async start() {
    const mod = this.constructor.mod;
    if (mod && !this.opts.skipCard) await this.showCard(mod);
    unlock(); music(this.constructor.music || 'menu');
    this.init(); this.last = performance.now(); this.running = true;
    const loop = now => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      if (!this.paused && !this.over) { this.t += dt; this.update(dt); this.updateFx(dt); }
      const g = this.g; g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      g.save();
      if (this.shakeT > 0) { this.shakeT -= dt; g.translate(rand(-1, 1) * this.shakeMag, rand(-1, 1) * this.shakeMag); }
      this.draw(g); this.drawFx(g); g.restore();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false; cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize); window.removeEventListener('keydown', this.keyDown); window.removeEventListener('keyup', this.keyUp);
    document.removeEventListener('visibilitychange', this.visHandler);
    this.destroy();
  }

  // ── power-up card
  showCard(modId) {
    const c = CARDS[modId], m = modById(modId);
    return new Promise(res => {
      const el = document.createElement('div'); el.className = 'overlay card-ov';
      el.innerHTML = `<div class="panel powercard" style="--mc:${m.color}">
        <div class="pc-tag">POWER-UP CARD · ${m.short}</div><h2>${c.title}</h2>
        <ul>${c.lines.map(l => `<li>${l}</li>`).join('')}</ul>
        <button class="btn big go">▶ Let's go</button></div>`;
      this.stage.appendChild(el);
      el.querySelector('.go').onclick = () => { unlock(); sfx('power'); el.remove(); res(); };
    });
  }

  // ── answering
  answer(q, idx, opts = {}) {
    const ok = idx === q.a;
    if (opts.norecord) { if (!opts.silent) sfx(ok ? 'correct' : 'wrong'); if (!ok && !opts.noExplain) this.explain(q); return ok; }
    const botOk = record(q.lo, ok);
    this.answers.push({ q, idx, ok, botOk });
    if (ok) { this.combo++; this.bestCombo = Math.max(this.bestCombo, this.combo); if (!opts.silent) sfx('correct'); }
    else { this.combo = 0; if (!opts.silent) { sfx('wrong'); vibrate(60); } if (!opts.noExplain) this.explain(q); }
    return ok;
  }
  // record a sorting decision (item with lo + correct bool)
  answerSort(lo, label, ok, why, correctLabel) {
    const q = { lo, q: `Classify: "${label}"`, opts: [correctLabel], a: 0, ex: why || `Correct category: ${correctLabel}.` };
    const botOk = record(lo, ok);
    this.answers.push({ q, idx: ok ? 0 : -1, ok, botOk, sort: true });
    if (ok) { this.combo++; this.bestCombo = Math.max(this.bestCombo, this.combo); } else { this.combo = 0; vibrate(50); }
    return ok;
  }
  explain(q, ms = 4200) {
    const el = document.createElement('div'); el.className = 'explain';
    el.innerHTML = `<b>✗ Answer: ${esc(q.opts[q.a])}</b><span>${esc(q.ex || '')}</span>`;
    this.hud.querySelectorAll('.explain').forEach(e => e.remove());
    this.hud.appendChild(el); setTimeout(() => el.remove(), ms);
  }
  toast(text, color = '#fff', ms = 1400) {
    const el = document.createElement('div'); el.className = 'toast'; el.style.color = color; el.innerHTML = text;
    this.hud.appendChild(el); setTimeout(() => el.remove(), ms);
  }
  // Question panel at top of screen (DOM, so long text wraps nicely)
  qpanel(q, { title = '', compact = false, timer = 0 } = {}) {
    let el = this.hud.querySelector('.qpanel');
    if (!el) { el = document.createElement('div'); el.className = 'qpanel'; this.hud.appendChild(el); }
    if (!q) { el.remove(); return null; }
    el.className = 'qpanel' + (compact ? ' compact' : '');
    el.innerHTML = `${title ? `<div class="qp-title">${title}</div>` : ''}<div class="qp-q">${esc(q.q)}</div>
      ${compact ? '' : `<div class="qp-opts">${q.opts.map((o, i) => `<div class="qp-o"><b>${LETTERS[i]}</b> ${esc(o)}</div>`).join('')}</div>`}
      ${timer ? '<div class="qp-timer"><i></i></div>' : ''}`;
    return el;
  }
  setTimerBar(frac) { const i = this.hud.querySelector('.qp-timer i'); if (i) i.style.width = (clamp(frac, 0, 1) * 100) + '%'; }

  // ── fx
  burst(x, y, color = '#ffd23f', n = 18, speed = 220, size = 4) {
    for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), s = rand(speed * 0.3, speed); this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.4, 0.9), max: 0.9, color, size: rand(size * 0.5, size * 1.4) }); }
  }
  float(x, y, text, color = '#fff', size = 20) { this.floaters.push({ x, y, text, color, size, life: 1.1 }); }
  shake(mag = 6, t = 0.25) { this.shakeMag = mag; this.shakeT = t; }
  updateFx(dt) {
    for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt * (p.grav ?? 1); p.vx *= 0.98; p.life -= dt; }
    this.particles = this.particles.filter(p => p.life > 0);
    for (const f of this.floaters) { f.y -= 50 * dt; f.life -= dt; }
    this.floaters = this.floaters.filter(f => f.life > 0);
  }
  drawFx(g) {
    for (const p of this.particles) { g.globalAlpha = clamp(p.life / p.max, 0, 1); g.fillStyle = p.color; g.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); }
    g.globalAlpha = 1;
    for (const f of this.floaters) { g.globalAlpha = clamp(f.life, 0, 1); g.font = `800 ${f.size}px Outfit, system-ui`; g.textAlign = 'center'; g.lineWidth = 4; g.strokeStyle = 'rgba(0,0,0,.6)'; g.strokeText(f.text, f.x, f.y); g.fillStyle = f.color; g.fillText(f.text, f.x, f.y); }
    g.globalAlpha = 1;
  }

  // ── pause / end
  togglePause() {
    if (this.over) return;
    this.paused = !this.paused; sfx('click');
    const ex = this.stage.querySelector('.pause-ov');
    if (!this.paused) { ex && ex.remove(); this.last = performance.now(); return; }
    const el = document.createElement('div'); el.className = 'overlay pause-ov';
    el.innerHTML = `<div class="panel"><h2>Paused</h2><button class="btn big res">▶ Resume</button>
      <button class="btn card">📜 Power-up card</button><button class="btn ghost quit">✕ Quit to map</button></div>`;
    this.stage.appendChild(el);
    el.querySelector('.res').onclick = () => this.togglePause();
    el.querySelector('.quit').onclick = () => this.quit();
    el.querySelector('.card').onclick = () => { const m = this.constructor.mod; if (m) this.showCard(m); };
  }
  quit() { this.over = true; this.stop(); this.app.go('map'); }

  end({ title = 'Mission complete', win = true, extra = '' } = {}) {
    if (this.over) return; this.over = true;
    const n = this.answers.length, right = this.answers.filter(a => a.ok).length, botRight = this.answers.filter(a => a.botOk).length;
    const acc = n ? Math.round(right / n * 100) : 0, botAcc = n ? Math.round(botRight / n * 100) : 0;
    const xp = Math.round(this.score / 10 + right * 10 + this.bestCombo * 3 + (win ? 25 : 0));
    addXP(xp);
    logGame({ game: this.constructor.id, score: Math.round(this.score), right, n, acc, win });
    sfx(win ? 'win' : 'lose'); music('calm');
    const wrong = this.answers.filter(a => !a.ok);
    const s = state();
    const el = document.createElement('div'); el.className = 'overlay end-ov';
    el.innerHTML = `<div class="panel results">
      <h2>${win ? '🏆' : '💥'} ${esc(title)}</h2>${extra}
      <div class="stats"><div><b>${Math.round(this.score)}</b><span>score</span></div><div><b>${acc}%</b><span>accuracy (${right}/${n})</span></div>
      <div><b>+${xp}</b><span>XP</span></div><div><b>×${this.bestCombo}</b><span>best combo</span></div></div>
      <div class="vsbot ${acc >= botAcc ? 'ahead' : 'behind'}">🤖 ${esc(s.settings.botName)} studied the same ${n} questions and got <b>${botAcc}%</b> → you're <b>${acc >= botAcc ? 'ahead' : 'behind'}</b>. Readiness: <b>${readiness()}%</b> vs bot <b>${readiness('bot')}%</b></div>
      ${wrong.length ? `<details class="review" open><summary>Review ${wrong.length} mistake${wrong.length > 1 ? 's' : ''}</summary>${wrong.slice(0, 25).map(a => `<div class="rv"><div class="rv-q">${esc(a.q.q)}</div><div class="rv-a">✔ ${esc(a.q.opts[a.q.a])}</div><div class="rv-e">${esc(a.q.ex || '')}</div>${a.q.lesson && a.q.lessonTitle ? `<button class="rv-l" data-rev="${a.q.lesson}">📖 Revise: ${esc(a.q.lessonTitle)}</button>` : ''}</div>`).join('')}</details>` : (n ? '<p class="perfect">Flawless! ✨</p>' : '')}
      <div class="row"><button class="btn big again">↻ Play again</button><button class="btn ghost map">🗺 Map</button></div></div>`;
    this.stage.appendChild(el);
    el.querySelector('.again').onclick = () => { this.stop(); if (this.opts.online) this.app.go('lobby'); else this.app.play(this.constructor.id, { ...this.opts, skipCard: true }); };
    el.querySelector('.map').onclick = () => { this.stop(); this.app.go('map'); };
    el.querySelectorAll('[data-rev]').forEach(b => b.onclick = () => { this.stop(); this.app.lesson(b.dataset.rev); });
  }

  // ── drawing helpers
  text(str, x, y, { size = 18, color = '#fff', align = 'center', weight = 800, stroke = true, font = 'Outfit, system-ui, sans-serif', base = 'middle' } = {}) {
    const g = this.g; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = base;
    if (stroke) { g.lineWidth = Math.max(3, size / 5); g.strokeStyle = 'rgba(0,0,0,.65)'; g.lineJoin = 'round'; g.strokeText(str, x, y); }
    g.fillStyle = color; g.fillText(str, x, y);
  }
  isTouch() { return matchMedia('(pointer: coarse)').matches; }
}

// Virtual joystick helper for touch shooters
export class Stick {
  constructor(side) { this.side = side; this.active = false; this.id = null; this.ox = 0; this.oy = 0; this.x = 0; this.y = 0; this.dx = 0; this.dy = 0; this.mag = 0; }
  down(x, y, id) { this.active = true; this.id = id; this.ox = x; this.oy = y; this.x = x; this.y = y; this.dx = this.dy = this.mag = 0; }
  move(x, y) { const dx = x - this.ox, dy = y - this.oy, d = Math.hypot(dx, dy), m = Math.min(d, 50); this.x = this.ox + (d ? dx / d * m : 0); this.y = this.oy + (d ? dy / d * m : 0); this.dx = d ? dx / d : 0; this.dy = d ? dy / d : 0; this.mag = m / 50; }
  up() { this.active = false; this.id = null; this.mag = 0; }
  draw(g) {
    if (!this.active) return;
    g.globalAlpha = 0.35; g.fillStyle = '#fff'; g.beginPath(); g.arc(this.ox, this.oy, 52, 0, 7); g.fill();
    g.globalAlpha = 0.7; g.beginPath(); g.arc(this.x, this.y, 24, 0, 7); g.fill(); g.globalAlpha = 1;
  }
}
