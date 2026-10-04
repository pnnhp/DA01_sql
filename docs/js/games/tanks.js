// Ledger Tanks – DDTank-style artillery duel.
// Each turn: answer a question to choose your ammo (correct = MEGA shell, wrong = dud), then move,
// set angle & power (wind matters!) and fire. Modes: vs rival bot, same-device 2P, online vs friend.
import { Game, rand, randi, pick, clamp, LETTERS, esc } from '../core/engine.js';
import { sfx, vibrate } from '../core/audio.js';
import { nextQuestion } from '../core/questions.js';
import { state, botAccuracy } from '../core/store.js';
import { net } from '../core/net.js';

const WW = 1000, WH = 600, G = 450;
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export default class Tanks extends Game {
  static id = 'tanks'; static music = 'tanks'; static theme = 'tanks';
  init() {
    this.mods = this.opts.mods || null;
    this.bar = document.createElement('div'); this.bar.className = 'hudbar'; this.bar.style.cssText = 'left:0;right:0;justify-content:center;bottom:calc(8px + var(--safe-b))'; this.hud.appendChild(this.bar);
    if (this.opts.online) this.setupOnline(); else this.menu();
  }
  menu() {
    const el = document.createElement('div'); el.className = 'overlay menu-ov';
    el.innerHTML = `<div class="panel"><h2>💣 Ledger Tanks</h2><p class="muted">Right answer = MEGA shell 💥. Wrong = dud 💨. 3 right in a row = TRIPLE SHOT. Mind the wind!</p>
      <button class="btn big" data-m="bot">🤖 vs ${esc(state().settings.botName)} (your rival bot)</button>
      <button class="btn" data-m="local">👥 2 players on this device</button>
      <button class="btn ghost" data-m="online">🌐 Online vs a friend (lobby)</button>
      <p class="muted small">Tip: turn your phone sideways for a bigger battlefield.</p></div>`;
    this.stage.appendChild(el);
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { el.remove(); if (b.dataset.m === 'online') { this.stop(); this.app.go('lobby'); return; } this.mode = b.dataset.m; this.setup(Math.floor(Math.random() * 1e9)); });
  }
  setupOnline() {
    this.mode = 'online'; this.me = net.status().isHost ? 0 : 1;
    net.on('tinit', d => { if (!this.ready) this.setup(d.seed, d.mods); });
    net.on('shot', d => this.remoteShot(d));
    net.on('move', d => { const t = this.tanks[d.p]; t.x = d.x; t.ang = d.ang; t.pow = d.pow; });
    net.on('ammo', d => { this.remoteAmmo = d; this.toast(d.mega ? `${this.tanks[d.p].name}: MEGA shell loaded 💥` : `${this.tanks[d.p].name} loaded a dud 💨`, d.mega ? '#ffd23f' : '#aaa', 1300); });
    net.on('result', d => this.applyResult(d));
    net.on('__close', () => { if (!this.over) this.end({ title: 'Friend disconnected', win: true }); });
    // handshake: guest keeps saying "ready" until the host sends the battlefield seed
    if (this.me === 0) { this.seedOut = Math.floor(Math.random() * 1e9); net.on('tready', () => { net.send('tinit', { seed: this.seedOut, mods: this.mods }); if (!this.ready) this.setup(this.seedOut); }); this.toast('Waiting for friend…', '#fff'); }
    else { const ping = () => { if (!this.ready && !this.over) { net.send('tready', {}); setTimeout(ping, 800); } }; ping(); }
  }
  setup(seed, mods) {
    if (mods) this.mods = mods;
    this.seed = seed; const r = rng(seed);
    const p = [r() * 6, r() * 6, r() * 6];
    this.ground = new Float32Array(WW + 1);
    for (let x = 0; x <= WW; x++) this.ground[x] = WH * 0.62 + Math.sin(x * 0.006 + p[0]) * 60 + Math.sin(x * 0.017 + p[1]) * 28 + Math.sin(x * 0.041 + p[2]) * 10;
    const s = state().settings;
    const names = this.mode === 'bot' ? [state().profile.name || 'You', `🤖 ${s.botName}`] : this.mode === 'local' ? ['Player 1', 'Player 2'] : (this.me === 0 ? [state().profile.name, net.status().peerName || 'Friend'] : [net.status().peerName || 'Friend', state().profile.name]);
    this.tanks = [{ x: 120 + r() * 80, hp: 100, ang: 45, pow: 60, name: names[0], col: '#3fd2ff', streak: 0, fuel: 100 }, { x: WW - 120 - r() * 80, hp: 100, ang: 135, pow: 60, name: names[1], col: '#ff7a3f', streak: 0, fuel: 100 }];
    this.turn = 0; this.turnNo = 0; this.shells = []; this.clouds = Array.from({ length: 6 }, () => ({ x: r() * WW, y: 40 + r() * 120, s: 0.6 + r() })); this.ready = true;
    this.startTurn();
  }
  windFor(n) { return Math.round((rng(this.seed + n * 7919)() * 2 - 1) * 70); }
  isMine() { return this.mode === 'local' || (this.mode === 'bot' && this.turn === 0) || (this.mode === 'online' && this.turn === this.me); }
  startTurn() {
    if (this.over) return;
    this.turnNo++; this.wind = this.windFor(this.turnNo); this.phase = 'ammo'; this.mega = false; this.triple = false; this.charging = false;
    const t = this.tanks[this.turn]; t.fuel = 100; this.remoteAmmo = null;
    this.toast(`${t.name}'s turn`, t.col, 1100);
    if (this.isMine()) this.askAmmo();
    else if (this.mode === 'bot') this.botTurn();
    else { this.qpanel(null); this.bar.innerHTML = `<span class="hudbtn">⏳ ${esc(t.name)} is answering…</span>`; }
  }
  askAmmo() {
    const q = nextQuestion(this.mods ? { mods: this.mods } : {}); this.q = q; this.qTime = 40;
    this.qpanel(q, { title: `💣 ${this.tanks[this.turn].name}: choose your ammo`, timer: true });
    this.bar.innerHTML = q.opts.map((o, i) => `<button class="hudbtn hit" data-i="${i}" style="background:${['#ff3f7a', '#3fd2ff', '#ffd23f', '#3fff8b'][i]};color:#000">${LETTERS[i]}${o.length <= 12 ? '<br><small>' + esc(o) + '</small>' : ''}</button>`).join('');
    this.bar.querySelectorAll('button').forEach(b => b.onclick = () => this.pickAmmo(+b.dataset.i));
  }
  pickAmmo(i) {
    if (!this.q || this.phase !== 'ammo') return; const q = this.q; this.q = null;
    const t = this.tanks[this.turn];
    const ok = this.answer(q, i, { norecord: this.mode === 'local' && this.turn === 1, noExplain: false });
    this.mega = ok; t.streak = ok ? t.streak + 1 : 0; this.triple = ok && t.streak >= 3 && t.streak % 3 === 0;
    if (ok) { this.score += 50; this.toast(this.triple ? 'TRIPLE SHOT! 🔥🔥🔥' : 'MEGA SHELL 💥', '#ffd23f', 1200); } else this.toast('Dud shell 💨', '#aaa', 1200);
    if (this.mode === 'online') net.send('ammo', { p: this.turn, mega: this.mega, triple: this.triple });
    this.qpanel(null);
    setTimeout(() => this.startAim(), ok ? 500 : 2600);
  }
  startAim() {
    if (this.over) return;
    this.phase = 'aim'; this.aimTime = 25;
    this.bar.innerHTML = `<button class="hudbtn hit" data-a="ml">◀</button><button class="hudbtn hit" data-a="mr">▶</button>
      <button class="hudbtn hit" data-a="au">⤴</button><button class="hudbtn hit" data-a="ad">⤵</button>
      <button class="hudbtn hit" data-a="fire" style="background:#ff3f7a;min-width:90px">🔥 HOLD</button>`;
    const hold = (sel, on, off) => { const b = this.bar.querySelector(`[data-a="${sel}"]`); b.addEventListener('pointerdown', e => { e.preventDefault(); on(); }); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); };
    hold('ml', () => this.btnMove = -1, () => this.btnMove = 0); hold('mr', () => this.btnMove = 1, () => this.btnMove = 0);
    hold('au', () => this.btnAng = 1, () => this.btnAng = 0); hold('ad', () => this.btnAng = -1, () => this.btnAng = 0);
    hold('fire', () => this.beginCharge(), () => this.releaseCharge());
  }
  beginCharge() { if (this.phase !== 'aim' || !this.isMine()) return; this.charging = true; this.tanks[this.turn].pow = 0; }
  releaseCharge() { if (!this.charging) return; this.charging = false; this.fire(); }
  fire() {
    if (this.phase !== 'aim') return; this.phase = 'fly'; this.bar.innerHTML = '';
    const t = this.tanks[this.turn];
    const shot = { p: this.turn, ang: t.ang, pow: t.pow, mega: this.mega, triple: this.triple, x: t.x };
    if (this.mode === 'online') net.send('shot', shot);
    this.launch(shot, true);
  }
  remoteShot(d) { const t = this.tanks[d.p]; t.ang = d.ang; t.pow = d.pow; t.x = d.x; this.mega = d.mega; this.triple = d.triple; this.phase = 'fly'; this.bar.innerHTML = ''; this.launch(d, false); }
  launch(shot, authoritative) {
    const t = this.tanks[shot.p]; const ty = this.ground[Math.round(t.x)] - 14;
    const angs = shot.triple ? [shot.ang - 4, shot.ang, shot.ang + 4] : [shot.ang];
    this.shells = angs.map(a => { const r = a * Math.PI / 180, v = shot.pow * 7.5; return { x: t.x + Math.cos(r) * 22, y: ty - Math.sin(r) * 22, vx: Math.cos(r) * v, vy: -Math.sin(r) * v, mega: shot.mega, alive: true, trail: [] }; });
    this.authoritative = authoritative; this.pendingHits = []; sfx(shot.mega ? 'bigboom' : 'shoot'); this.shake(4);
  }
  explode(s) {
    const R = s.mega ? 62 : 24, DMG = s.mega ? 36 : 9;
    const hits = this.tanks.map(t => { const d = Math.hypot(t.x - s.x, this.ground[Math.round(t.x)] - 10 - s.y); return d < R + 18 ? Math.round(DMG * (1 - d / (R + 18) * 0.6)) : 0; });
    this.pendingHits.push({ x: s.x, y: s.y, R, hits });
    this.carve(s.x, s.y, R); this.boomFx(s.x, s.y, R, s.mega);
  }
  boomFx(x, y, R, mega) { const p = this.toScreen(x, y); this.burst(p.x, p.y, mega ? '#ffd23f' : '#aaa', mega ? 50 : 14, mega ? 380 : 160, mega ? 6 : 3); this.shake(mega ? 14 : 4); sfx(mega ? 'bigboom' : 'boom'); vibrate(mega ? 80 : 20); }
  carve(cx, cy, r) { for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(WW, Math.ceil(cx + r)); x++) { const dy = Math.sqrt(Math.max(0, r * r - (x - cx) ** 2)); if (this.ground[x] >= cy - dy) this.ground[x] = Math.min(WH + 40, Math.max(this.ground[x], cy + dy)); } }
  allLanded() {
    // shooter's device decides the result (avoids float drift between devices)
    const dmg = [0, 0]; for (const h of this.pendingHits) h.hits.forEach((d, i) => dmg[i] += d);
    const res = { craters: this.pendingHits.map(h => ({ x: h.x, y: h.y, R: h.R })), hp: this.tanks.map((t, i) => Math.max(0, t.hp - dmg[i])), dmg };
    if (this.mode !== 'online') return this.applyResult(res, true);
    if (this.authoritative) { net.send('result', res); this.applyResult(res, true); }
  }
  applyResult(res, local) {
    if (!local) for (const c of res.craters) { this.carve(c.x, c.y, c.R); }
    this.tanks.forEach((t, i) => { if (res.dmg[i] > 0) { const p = this.toScreen(t.x, this.ground[Math.round(t.x)] - 30); this.float(p.x, p.y, `−${res.dmg[i]}`, '#ff3f7a', 22); } t.hp = res.hp[i]; });
    const mine = this.mode === 'local' ? 0 : this.mode === 'online' ? this.me : 0;
    if (res.dmg[1 - mine] > 0) this.score += res.dmg[1 - mine] * 3;
    this.phase = 'wait';
    setTimeout(() => {
      if (this.over) return;
      const dead = this.tanks.findIndex(t => t.hp <= 0);
      if (dead >= 0) {
        this.qpanel(null); this.bar.innerHTML = '';
        const winner = this.tanks[1 - dead].name; const iWon = this.mode === 'local' ? true : (1 - dead) === mine;
        return this.end({ title: this.mode === 'local' ? `${winner} wins!` : iWon ? 'Victory!' : `${winner} wins`, win: iWon });
      }
      this.turn = 1 - this.turn; this.startTurn();
    }, 1200);
  }
  // ── bot
  botTurn() {
    this.qpanel(null); this.bar.innerHTML = `<span class="hudbtn">${esc(this.tanks[1].name)} is thinking…</span>`;
    const q = nextQuestion(this.mods ? { mods: this.mods } : {});
    setTimeout(() => {
      if (this.over) return;
      const ok = Math.random() < botAccuracy(q.lo); const t = this.tanks[1];
      this.mega = ok; t.streak = ok ? t.streak + 1 : 0; this.triple = ok && t.streak >= 3 && t.streak % 3 === 0;
      this.toast(ok ? `🤖 got it right → MEGA shell` : `🤖 got it wrong → dud`, ok ? '#ffd23f' : '#aaa', 1300);
      // search angle/power to hit player, then add human-ish error
      let best = null; const target = this.tanks[0].x;
      for (let a = 100; a <= 170; a += 3) for (let pw = 30; pw <= 100; pw += 2) { const x = this.simulate(t.x, a, pw); const err = Math.abs(x - target); if (!best || err < best.err) best = { a, pw, err }; }
      const skill = 0.4 + 0.6 * Math.min(1, this.turnNo / 12);
      t.ang = clamp(best.a + rand(-6, 6) * (1.2 - skill), 95, 175); t.pow = clamp(best.pw + rand(-8, 8) * (1.2 - skill), 20, 100);
      setTimeout(() => { if (!this.over) { this.phase = 'aim'; this.fire(); } }, 900);
    }, 1500 + Math.random() * 1500);
  }
  simulate(x0, ang, pow) {
    const r = ang * Math.PI / 180, v = pow * 7.5; let x = x0 + Math.cos(r) * 22, y = this.ground[Math.round(x0)] - 14 - Math.sin(r) * 22, vx = Math.cos(r) * v, vy = -Math.sin(r) * v;
    for (let i = 0; i < 600; i++) { vx += this.wind * 0.016; vy += G * 0.016; x += vx * 0.016; y += vy * 0.016; if (x < 0 || x > WW) return x; if (y >= this.ground[Math.round(x)]) return x; }
    return x;
  }
  // ── input
  onKey(k, down) {
    if (this.phase === 'ammo' && this.q && down && '1234abcd'.includes(k) && k.length === 1) return this.pickAmmo('1234'.includes(k) ? +k - 1 : 'abcd'.indexOf(k));
    if (this.phase !== 'aim' || !this.isMine()) return;
    if (k === ' ') { if (down) this.beginCharge(); else this.releaseCharge(); }
  }
  onDown(x, y) { if (this.phase === 'aim' && this.isMine()) { this.sling = { x, y, cx: x, cy: y }; } }
  onMove(x, y) {
    if (!this.sling || !this.pointer.down) return; this.sling.cx = x; this.sling.cy = y;
    const dx = this.sling.x - x, dy = this.sling.y - y, d = Math.hypot(dx, dy);
    if (d > 12) { const t = this.tanks[this.turn]; t.ang = clamp(Math.atan2(dy, dx) * -180 / Math.PI, 5, 175); t.pow = clamp(d / this.sc / 2.2, 10, 100); }
  }
  onUp() { if (this.sling) { const d = Math.hypot(this.sling.x - this.sling.cx, this.sling.y - this.sling.cy); this.sling = null; if (d > 30) this.fire(); } }
  update(dt) {
    if (!this.ready) return;
    for (const c of this.clouds) { c.x += this.wind * dt * 0.3; if (c.x > WW + 100) c.x = -100; if (c.x < -100) c.x = WW + 100; }
    if (this.phase === 'ammo' && this.q) { this.qTime -= dt; this.setTimerBar(this.qTime / 40); if (this.qTime <= 0) this.pickAmmo(-1); }
    if (this.phase === 'aim' && this.isMine()) {
      const t = this.tanks[this.turn];
      this.aimTime -= dt; if (this.aimTime <= 0 && !this.charging) { t.pow = Math.max(t.pow, 30); this.fire(); return; }
      let mv = this.btnMove || 0; if (this.keys.has('ArrowLeft') || this.keys.has('a')) mv = -1; if (this.keys.has('ArrowRight') || this.keys.has('d')) mv = 1;
      if (mv && t.fuel > 0) { const nx = clamp(t.x + mv * 60 * dt, 20, WW - 20); if (Math.abs(this.ground[Math.round(nx)] - this.ground[Math.round(t.x)]) < 6) { t.x = nx; t.fuel -= 40 * dt; } }
      let av = this.btnAng || 0; if (this.keys.has('ArrowUp') || this.keys.has('w')) av = 1; if (this.keys.has('ArrowDown') || this.keys.has('s')) av = -1;
      if (av) t.ang = clamp(t.ang + av * 50 * dt * (t.ang <= 90 ? 1 : -1), 5, 175); // ↑ always raises the barrel
      if (this.charging) { t.pow = Math.min(100, t.pow + 55 * dt); if (Math.floor(t.pow) % 10 === 0) sfx('charge'); }
      if (this.mode === 'online' && (this.netT = (this.netT || 0) + dt) > 0.12) { this.netT = 0; net.send('move', { p: this.turn, x: t.x, ang: t.ang, pow: t.pow }); }
    }
    if (this.phase === 'fly') {
      let anyAlive = false;
      for (const s of this.shells) {
        if (!s.alive) continue; anyAlive = true;
        for (let k = 0; k < 2; k++) {
          const h = dt / 2; s.vx += this.wind * h; s.vy += G * h; s.x += s.vx * h; s.y += s.vy * h;
          if (s.x < -50 || s.x > WW + 50 || s.y > WH + 50) { s.alive = false; break; }
          const hitTank = this.tanks.some(t => Math.hypot(t.x - s.x, this.ground[Math.round(clamp(t.x, 0, WW))] - 10 - s.y) < 16);
          if (hitTank || (s.x >= 0 && s.x <= WW && s.y >= this.ground[Math.round(s.x)])) { s.alive = false; this.explode(s); break; }
        }
        s.trail.push({ x: s.x, y: s.y }); if (s.trail.length > 40) s.trail.shift();
      }
      if (!anyAlive && this.shells.length) { this.shells = []; this.allLanded(); }
    }
  }
  toScreen(x, y) { return { x: this.ox + x * this.sc, y: this.oy + y * this.sc }; }
  draw(g) {
    const W = this.W, H = this.H;
    const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, '#7fd3ff'); grd.addColorStop(1, '#fff1c9'); g.fillStyle = grd; g.fillRect(0, 0, W, H);
    if (!this.ready) return;
    this.sc = Math.min(W / WW, (H - 150) / WH); this.ox = (W - WW * this.sc) / 2; this.oy = H - 90 - WH * this.sc;
    g.save(); g.translate(this.ox, this.oy); g.scale(this.sc, this.sc);
    g.fillStyle = '#ffffffcc'; for (const c of this.clouds) { g.beginPath(); g.ellipse(c.x, c.y, 50 * c.s, 18 * c.s, 0, 0, 7); g.ellipse(c.x + 30 * c.s, c.y - 10, 30 * c.s, 16 * c.s, 0, 0, 7); g.fill(); }
    // terrain
    g.beginPath(); g.moveTo(0, WH + 60); for (let x = 0; x <= WW; x += 2) g.lineTo(x, this.ground[x]); g.lineTo(WW, WH + 60); g.closePath();
    const tg = g.createLinearGradient(0, WH * 0.4, 0, WH); tg.addColorStop(0, '#8bc34a'); tg.addColorStop(0.15, '#a0703c'); tg.addColorStop(1, '#5a3a1e'); g.fillStyle = tg; g.fill();
    g.strokeStyle = '#5a9a2a'; g.lineWidth = 5; g.beginPath(); for (let x = 0; x <= WW; x += 2) x ? g.lineTo(x, this.ground[x]) : g.moveTo(x, this.ground[x]); g.stroke();
    // tanks
    this.tanks.forEach((t, i) => {
      const y = this.ground[Math.round(t.x)];
      g.save(); g.translate(t.x, y - 10);
      const r = t.ang * Math.PI / 180; g.strokeStyle = '#333'; g.lineWidth = 7; g.beginPath(); g.moveTo(0, -6); g.lineTo(Math.cos(r) * 28, -6 - Math.sin(r) * 28); g.stroke();
      g.fillStyle = t.col; g.beginPath(); g.arc(0, -6, 12, Math.PI, 0); g.fill(); g.fillRect(-20, -6, 40, 12); g.fillStyle = '#333'; g.fillRect(-22, 4, 44, 8);
      g.restore();
      if (i === this.turn && this.phase !== 'wait') { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(t.x - 8, y - 66); g.lineTo(t.x + 8, y - 66); g.lineTo(t.x, y - 54); g.fill(); }
      // aim preview (short)
      if (i === this.turn && this.phase === 'aim') { const rr = t.ang * Math.PI / 180, v = t.pow * 7.5; let x = t.x, yy = y - 24, vx = Math.cos(rr) * v, vy = -Math.sin(rr) * v; g.fillStyle = '#fff'; for (let k = 0; k < 14; k++) { for (let j = 0; j < 3; j++) { vx += this.wind * 0.016; vy += G * 0.016; x += vx * 0.016; yy += vy * 0.016; } g.globalAlpha = 1 - k / 14; g.beginPath(); g.arc(x, yy, 4, 0, 7); g.fill(); } g.globalAlpha = 1; }
    });
    for (const s of this.shells) { g.strokeStyle = s.mega ? '#ff7a3f' : '#888'; g.lineWidth = 3; g.beginPath(); s.trail.forEach((p, k) => k ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.stroke(); if (s.alive) { g.fillStyle = s.mega ? '#ffd23f' : '#555'; g.beginPath(); g.arc(s.x, s.y, s.mega ? 9 : 5, 0, 7); g.fill(); } }
    g.restore();
    // HUD: hp bars + wind
    const top = this.hud.querySelector('.qpanel') ? this.hud.querySelector('.qpanel').offsetHeight + 16 : 14;
    this.tanks.forEach((t, i) => { const x = i ? W - 14 - 150 : 14, y = top; g.fillStyle = '#0008'; g.fillRect(x, y, 150, 30); g.fillStyle = t.col; g.fillRect(x + 3, y + 18, 144 * t.hp / 100, 8); this.text(`${t.name} ${t.hp}`, x + 6, y + 10, { size: 12, align: 'left' }); });
    this.text(`Wind ${this.wind > 0 ? '→' : this.wind < 0 ? '←' : '·'} ${Math.abs(this.wind)}`, W / 2, top + 14, { size: 15, color: '#fff' });
    if (this.phase === 'aim') { const t = this.tanks[this.turn]; this.text(`Angle ${Math.round(t.ang)}° · Power ${Math.round(t.pow)} · ⏱${Math.ceil(this.aimTime || 0)}`, W / 2, top + 40, { size: 14 });
      g.fillStyle = '#0008'; g.fillRect(W / 2 - 100, top + 54, 200, 10); g.fillStyle = '#ff3f7a'; g.fillRect(W / 2 - 100, top + 54, 2 * t.pow, 10);
      if (this.isTouch()) this.text('Drag back from anywhere & release to fire (like a slingshot)', W / 2, top + 78, { size: 11, stroke: false, color: '#333', weight: 600 });
      else this.text('←/→ move · ↑/↓ angle · hold SPACE to charge power, release to fire (or drag with mouse)', W / 2, top + 78, { size: 12, stroke: false, color: '#333', weight: 600 }); }
    if (this.sling) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(this.sling.x, this.sling.y); g.lineTo(this.sling.cx, this.sling.cy); g.stroke(); g.setLineDash([]); }
    if (W < H && !this.rotHint) this.text('↻ rotate for a bigger battlefield', W / 2, H - 70, { size: 11, color: '#333', stroke: false, weight: 600 });
  }
  destroy() { if (this.mode === 'online') ['tinit', 'tready', 'shot', 'move', 'ammo', 'result', '__close'].forEach(t => net.off(t)); }
}
