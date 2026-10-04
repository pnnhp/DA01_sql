// M4 – Variance Strike (synthwave space shooter).
// Asteroids carry answer options; shoot the right one. Drones shoot back. Boss: operating-statement mothership.
import { Game, rand, randi, pick, clamp, LETTERS } from '../core/engine.js';
import { sfx } from '../core/audio.js';
import { questionFor, nextQuestion } from '../core/questions.js';
import { varianceScenario } from '../content/generators.js';

const CALC = ['mat_price', 'mat_usage', 'lab_rate', 'lab_eff', 'idle', 'voh', 'foh_exp', 'foh_vol', 'sales_price', 'sales_vol', 'prod_budget', 'purch_budget', 'cash_receipts', 'flex', 'investigate'];
const COL = ['#ff3fd2', '#3fd2ff', '#ffd23f', '#3fff8b'];

export default class Strike extends Game {
  static id = 'strike'; static mod = 4; static music = 'neon'; static theme = 'neon';
  init() {
    this.ship = { x: this.W / 2, y: this.H - 110 }; this.shield = 5; this.bullets = []; this.enemyShots = []; this.drones = []; this.rocks = [];
    this.qn = 0; this.qTotal = 10; this.fireCD = 0; this.droneT = 3; this.boss = null;
    this.stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), z: rand(0.2, 1) }));
    const bar = document.createElement('div'); bar.className = 'hudbar'; bar.style.left = 'auto'; bar.style.right = '10px';
    bar.innerHTML = '<button class="hudbtn hit" style="width:84px;height:84px;border-radius:50%;font-size:18px;background:#ff3fd2aa">FIRE</button>';
    this.hud.appendChild(bar); const fb = bar.querySelector('button');
    fb.addEventListener('pointerdown', e => { e.preventDefault(); this.firing = true; }); fb.addEventListener('pointerup', () => this.firing = false); fb.addEventListener('pointerleave', () => this.firing = false);
    setTimeout(() => this.nextQ(), 600);
  }
  nextQ() {
    if (this.over) return;
    if (this.qn >= this.qTotal) return this.startBoss();
    this.qn++;
    const q = Math.random() < 0.6 ? questionFor(pick(CALC)) : nextQuestion({ mods: [4], kind: 'concept' });
    this.spawnRocks(q, `WAVE ${this.qn}/${this.qTotal}`, 26);
  }
  spawnRocks(q, title, secs) {
    this.q = q; this.qpanel(q, { title: `🎯 ${title} — shoot the correct asteroid`, timer: true });
    const top = this.panelBottom();
    const fall = (this.ship.y - 60 - top) / secs;
    this.qMax = secs; this.qT = secs;
    const idx = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    this.rocks = idx.map((i, k) => ({ i, x: this.W * (0.13 + k * 0.248), y: top + 30 + rand(-10, 10), vy: fall, r: Math.min(46, this.W / 9), wob: rand(0, 6), alive: true }));
  }
  panelBottom() { const qp = this.hud.querySelector('.qpanel'); return qp ? qp.offsetTop + qp.offsetHeight + 10 : 80; }
  startBoss() {
    const sc = varianceScenario(); this.boss = { sc, k: 0, hp: sc.qs.length, max: sc.qs.length, x: this.W / 2, hit: 0, laser: 0 };
    this.toast('⚠ MOTHERSHIP: Operating Statement', '#ff3fd2', 2000); sfx('alarm');
    setTimeout(() => this.bossQ(), 1800);
  }
  bossQ() {
    if (this.over) return; const b = this.boss; const q = b.sc.qs[b.k];
    q.q = `${b.sc.intro} → ${q.q}`; // keep data visible for every step
    const prep = { ...q, id: Math.random() }; const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    prep.opts = order.map(i => q.opts[i]); prep.a = order.indexOf(0); prep.lo = q.lo;
    this.spawnRocks(prep, `BOSS ${b.k + 1}/${b.max}`, 45);
  }
  shoot() { if (this.fireCD > 0) return; this.fireCD = 0.2; this.bullets.push({ x: this.ship.x - 10, y: this.ship.y - 20 }, { x: this.ship.x + 10, y: this.ship.y - 20 }); sfx('laser'); }
  update(dt) {
    const s = this.ship; this.fireCD -= dt;
    let mv = 0; if (this.keys.has('ArrowLeft') || this.keys.has('a')) mv -= 1; if (this.keys.has('ArrowRight') || this.keys.has('d')) mv += 1;
    s.x += mv * 420 * dt;
    if (this.pointer.down && this.pointer.y > this.H * 0.45) s.x += (this.pointer.x - s.x) * Math.min(1, dt * 14);
    else if (!this.isTouch() && this.mouseSteer != null) s.x += (this.mouseSteer - s.x) * Math.min(1, dt * 10);
    s.x = clamp(s.x, 24, this.W - 24); s.y = this.H - 110;
    if (this.firing || this.keys.has(' ') || (!this.isTouch() && this.pointer.down)) this.shoot();
    for (const st of this.stars) { st.y += st.z * dt * 0.25; if (st.y > 1) { st.y = 0; st.x = Math.random(); } }
    for (const b of this.bullets) b.y -= 700 * dt;
    this.bullets = this.bullets.filter(b => b.y > -20 && !b.dead);
    // rocks
    if (this.q) {
      this.qT -= dt; this.setTimerBar(this.qT / this.qMax);
      for (const r of this.rocks) { if (!r.alive) continue; r.y += r.vy * dt; r.wob += dt;
        for (const b of this.bullets) if (!b.dead && Math.hypot(b.x - r.x, b.y - r.y) < r.r) { b.dead = true; this.hitRock(r); break; } }
      if (this.qT <= 0 && this.q) { this.answer(this.q, -1); this.damage(); this.toast('⏰ Time!', '#ff3f7a'); this.resolve(false); }
    }
    // drones
    this.droneT -= dt;
    if (this.droneT <= 0 && !this.boss) { this.droneT = rand(3, 6); this.drones.push({ x: rand(40, this.W - 40), y: this.panelBottom(), t: 0, hp: 2, cd: rand(1, 2) }); }
    for (const d of this.drones) {
      d.t += dt; d.y += 40 * dt; d.x += Math.sin(d.t * 2) * 90 * dt; d.cd -= dt;
      if (d.cd <= 0) { d.cd = rand(1.5, 2.5); const a = Math.atan2(s.y - d.y, s.x - d.x); this.enemyShots.push({ x: d.x, y: d.y, vx: Math.cos(a) * 200, vy: Math.sin(a) * 200 }); }
      for (const b of this.bullets) if (!b.dead && Math.hypot(b.x - d.x, b.y - d.y) < 18) { b.dead = true; d.hp--; if (d.hp <= 0) { d.dead = true; this.score += 15; this.burst(d.x, d.y, '#ff3fd2', 14); sfx('hit'); } }
    }
    this.drones = this.drones.filter(d => !d.dead && d.y < this.H);
    if (this.boss) { const b = this.boss; b.hit = Math.max(0, b.hit - dt); b.laser = Math.max(0, b.laser - dt); b.x = this.W / 2 + Math.sin(this.t * 0.8) * this.W * 0.25;
      if (Math.random() < dt * 0.6) for (let k = -1; k <= 1; k++) this.enemyShots.push({ x: b.x, y: this.panelBottom() + 20, vx: k * 80, vy: 220 }); }
    for (const e of this.enemyShots) { e.x += e.vx * dt; e.y += e.vy * dt; if (Math.hypot(e.x - s.x, e.y - s.y) < 16) { e.dead = true; this.damage(0.5); } }
    this.enemyShots = this.enemyShots.filter(e => !e.dead && e.y < this.H + 10 && e.y > -10);
  }
  hitRock(r) {
    if (!this.q) return;
    r.alive = false; const ok = this.answer(this.q, r.i);
    this.burst(r.x, r.y, ok ? '#3fff8b' : '#ff3f7a', 34, 300, 5); this.shake(ok ? 6 : 10); sfx(ok ? 'boom' : 'hit');
    if (ok) { const pts = 100 + Math.round(this.qT * 4) + this.combo * 10; this.score += pts; this.float(r.x, r.y, `+${pts}`, '#3fff8b', 24); }
    else this.damage();
    this.resolve(ok);
  }
  resolve(ok) {
    this.q = null; this.rocks.forEach(r => { if (r.alive) { r.alive = false; this.burst(r.x, r.y, '#888', 10); } });
    if (this.shield <= 0) return;
    if (this.boss) {
      const b = this.boss; if (ok) { b.hp--; b.hit = 0.5; } else b.laser = 0.6; b.k++;
      if (b.k >= b.max) { this.qpanel(null); this.score += b.hp === 0 ? 500 : 200; return setTimeout(() => this.end({ title: b.hp <= b.max / 2 ? 'Mothership destroyed!' : 'You survived the mothership', win: b.hp <= b.max / 2 }), 700); }
      setTimeout(() => this.bossQ(), ok ? 800 : 3800);
    } else setTimeout(() => this.nextQ(), ok ? 700 : 3600);
  }
  damage(n = 1) { this.shield -= n; this.shake(10); sfx('hit'); if (this.shield <= 0 && !this.over) { this.qpanel(null); this.burst(this.ship.x, this.ship.y, '#ffd23f', 50, 350); sfx('bigboom'); setTimeout(() => this.end({ title: 'Ship destroyed', win: false }), 600); } }
  onMove(x, y) { this.mouseSteer = x; }
  onKey(k, down) { if (down && '1234'.includes(k) && this.q) { const r = this.rocks.find(r => r.i === +k - 1 && r.alive); if (r) this.ship.x = r.x; } }

  draw(g) {
    const W = this.W, H = this.H;
    const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, '#0a0221'); grd.addColorStop(0.6, '#2b0b4a'); grd.addColorStop(1, '#ff3f7a'); g.fillStyle = grd; g.fillRect(0, 0, W, H);
    for (const s of this.stars) { g.fillStyle = `rgba(255,255,255,${s.z})`; g.fillRect(s.x * W, s.y * H, s.z * 2, s.z * 2); }
    // synth grid floor
    g.strokeStyle = '#ff3fd255'; g.lineWidth = 1; const hy = H * 0.82;
    for (let i = -10; i <= 10; i++) { g.beginPath(); g.moveTo(W / 2 + i * 20, hy); g.lineTo(W / 2 + i * W * 0.15, H); g.stroke(); }
    for (let k = 0; k < 8; k++) { const y = hy + ((k * 18 + this.t * 40) % (H - hy)); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    // boss
    if (this.boss) { const b = this.boss, y = this.panelBottom() + 10;
      g.save(); g.translate(b.x, y); if (b.hit > 0) g.globalAlpha = 0.5 + Math.sin(this.t * 60) * 0.5;
      g.fillStyle = '#2a0b3a'; g.beginPath(); g.ellipse(0, 0, 110, 30, 0, 0, 7); g.fill(); g.strokeStyle = '#ff3fd2'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#ff3fd2'; for (let i = -3; i <= 3; i++) g.fillRect(i * 28 - 4, 6, 8, 8); g.restore();
      if (b.laser > 0) { g.fillStyle = `rgba(255,63,122,${b.laser})`; g.fillRect(this.ship.x - 8, y, 16, this.ship.y - y); }
      g.fillStyle = '#0008'; g.fillRect(W / 2 - 90, H - 40, 180, 8); g.fillStyle = '#ff3fd2'; g.fillRect(W / 2 - 90, H - 40, 180 * b.hp / b.max, 8);
    }
    // rocks
    for (const r of this.rocks) {
      if (!r.alive) continue; const c = COL[r.i];
      g.save(); g.translate(r.x, r.y); g.rotate(Math.sin(r.wob) * 0.3);
      g.fillStyle = '#1b1530'; g.strokeStyle = c; g.lineWidth = 3; g.shadowColor = c; g.shadowBlur = 14;
      g.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, rr = r.r * (0.82 + ((k * 37) % 7) / 30); g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill(); g.stroke(); g.restore();
      const sub = this.q && this.q.opts[r.i].length <= 13 ? this.q.opts[r.i] : '';
      this.text(LETTERS[r.i], r.x, r.y - (sub ? 9 : 0), { size: 26, color: c }); if (sub) this.text(sub, r.x, r.y + 14, { size: 11 });
    }
    for (const d of this.drones) { g.fillStyle = '#ff3fd2'; g.beginPath(); g.moveTo(d.x, d.y + 12); g.lineTo(d.x - 14, d.y - 8); g.lineTo(d.x + 14, d.y - 8); g.fill(); }
    g.fillStyle = '#3fd2ff'; for (const b of this.bullets) g.fillRect(b.x - 2, b.y - 8, 4, 14);
    g.fillStyle = '#ff9ab8'; for (const e of this.enemyShots) { g.beginPath(); g.arc(e.x, e.y, 5, 0, 7); g.fill(); }
    // ship
    const s = this.ship; g.save(); g.translate(s.x, s.y); g.shadowColor = '#3fd2ff'; g.shadowBlur = 16;
    g.fillStyle = '#e8f6ff'; g.beginPath(); g.moveTo(0, -24); g.lineTo(20, 18); g.lineTo(0, 10); g.lineTo(-20, 18); g.closePath(); g.fill();
    g.fillStyle = '#ffd23f'; g.fillRect(-5, 12, 10, 8 + Math.random() * 8); g.restore();
    this.text('🛡'.repeat(Math.max(0, Math.ceil(this.shield))), 12, H - 22, { size: 18, align: 'left' });
    this.text(`${Math.round(this.score)}`, W / 2, H - 22, { size: 20, color: '#ffd23f' });
  }
}
