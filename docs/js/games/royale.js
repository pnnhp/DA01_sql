// Audit Royale – a PUBG-style top-down battle royale.
// Drop in, loot weapons/armour/medkits and fight 20 bots (including your rival bot).
// Each phase a question appears and 4 lettered flags are planted in the zone:
// the next safe zone forms around the CORRECT flag — be near it when the timer ends or eat storm damage.
// Solo, or online duo (co-op) with a friend: the host simulates, the guest streams inputs.
import { Game, rand, randi, pick, clamp, LETTERS, esc, Stick } from '../core/engine.js';
import { sfx, vibrate } from '../core/audio.js';
import { nextQuestion } from '../core/questions.js';
import { state, botAccuracy } from '../core/store.js';
import { net } from '../core/net.js';

const WS = 2400;
const ZONES = [1150, 713, 442, 274, 170, 105, 65];
const STORM = [1, 2, 3, 5, 7, 10, 14, 18];
const WEAP = {
  pistol: { n: 'Pistol', dmg: 14, rate: 0.36, spd: 900, spr: 0.05, life: 0.55, tier: 0, col: '#ccc' },
  smg: { n: 'SMG', dmg: 9, rate: 0.09, spd: 950, spr: 0.13, life: 0.5, tier: 1, col: '#3fd2ff' },
  shotgun: { n: 'Shotgun', dmg: 9, rate: 0.85, spd: 850, spr: 0.32, life: 0.35, tier: 2, pellets: 6, col: '#ff7a3f' },
  rifle: { n: 'AR Rifle', dmg: 20, rate: 0.17, spd: 1250, spr: 0.035, life: 0.65, tier: 3, col: '#ffd23f' },
};
const BOTNAMES = ['Debit', 'Credit', 'Accrual', 'Ledger', 'Audit', 'Equity', 'Margin', 'Variance', 'Payback', 'Kaizen', 'Overhead', 'Deprival', 'Cashflow', 'Contrib', 'Kanban', 'Prudence', 'Solvent', 'Liquid', 'Capex'];
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export default class Royale extends Game {
  static id = 'royale'; static music = 'royale'; static theme = 'royale';
  init() {
    this.online = !!this.opts.online; this.isHost = !this.online || net.status().isHost; this.mods = this.opts.mods || null;
    this.lstick = new Stick('L'); this.rstick = new Stick('R'); this.ready = false;
    if (!this.online) { this.makeWorld(Math.floor(Math.random() * 1e9)); this.begin(); return; }
    this.toast('Connecting to squad…', '#fff');
    if (this.isHost) {
      this.seed = Math.floor(Math.random() * 1e9);
      net.on('rready', () => { net.send('rinit', { seed: this.seed, mods: this.mods }); if (!this.ready) { this.makeWorld(this.seed); this.begin(); } });
      net.on('input', d => { const p = this.humans[1]; if (!p || !p.alive) return; p.x = d.x; p.y = d.y; p.ang = d.ang; if (d.fire) this.tryFire(p); });
    } else {
      net.on('rinit', d => { if (!this.ready) { this.mods = d.mods; this.makeWorld(d.seed); this.begin(); } });
      net.on('snap', d => this.applySnap(d));
      net.on('rq', d => this.showQuestion(d.q, d.flags, d.k));
      net.on('rlock', d => this.lockResult(d.correct));
      net.on('rend', d => this.finish(d.win, d.title));
      const ping = () => { if (!this.ready && !this.over) { net.send('rready', {}); setTimeout(ping, 800); } }; ping();
    }
    net.on('__close', () => { if (!this.over) { this.online = false; this.toast('Squadmate disconnected', '#ff3f7a'); if (!this.isHost) this.finish(false, 'Connection lost'); else if (this.humans[1]) this.humans[1].alive = false; } });
  }
  makeWorld(seed) {
    const r = rng(seed); this.seed = seed;
    this.buildings = []; this.walls = []; this.trees = []; this.rocks = []; this.loot = [];
    for (let i = 0; i < 12; i++) {
      const w = 170 + r() * 90, h = 130 + r() * 70, x = 150 + r() * (WS - 300 - w), y = 150 + r() * (WS - 300 - h);
      if (this.buildings.some(b => x < b.x + b.w + 60 && x + w + 60 > b.x && y < b.y + b.h + 60 && y + h + 60 > b.y)) continue;
      const b = { x, y, w, h, roof: ['#8a4a3a', '#4a5a8a', '#6a6a4a'][i % 3] }; this.buildings.push(b);
      const t = 10, door = 60, side = Math.floor(r() * 4);
      const seg = (x1, y1, w1, h1) => this.walls.push({ x: x1, y: y1, w: w1, h: h1 });
      // top
      if (side === 0) { seg(x, y, (w - door) / 2, t); seg(x + (w + door) / 2, y, (w - door) / 2, t); } else seg(x, y, w, t);
      if (side === 1) { seg(x, y + h - t, (w - door) / 2, t); seg(x + (w + door) / 2, y + h - t, (w - door) / 2, t); } else seg(x, y + h - t, w, t);
      if (side === 2) { seg(x, y, t, (h - door) / 2); seg(x, y + (h + door) / 2, t, (h - door) / 2); } else seg(x, y, t, h);
      if (side === 3) { seg(x + w - t, y, t, (h - door) / 2); seg(x + w - t, y + (h + door) / 2, t, (h - door) / 2); } else seg(x + w - t, y, t, h);
      for (let k = 0; k < 2; k++) this.loot.push({ id: this.loot.length, x: x + 30 + r() * (w - 60), y: y + 30 + r() * (h - 60), type: pick2(r, ['rifle', 'shotgun', 'smg', 'armor', 'med']) });
    }
    const free = (x, y, rad) => !this.buildings.some(b => x > b.x - rad && x < b.x + b.w + rad && y > b.y - rad && y < b.y + b.h + rad);
    for (let i = 0; i < 110; i++) { const x = r() * WS, y = r() * WS, rad = 16 + r() * 14; if (free(x, y, rad + 10)) this.trees.push({ x, y, r: rad }); }
    for (let i = 0; i < 40; i++) { const x = r() * WS, y = r() * WS, rad = 14 + r() * 16; if (free(x, y, rad + 10)) this.rocks.push({ x, y, r: rad }); }
    for (let i = 0; i < 55; i++) { const x = 60 + r() * (WS - 120), y = 60 + r() * (WS - 120); if (free(x, y, 20)) this.loot.push({ id: this.loot.length, x, y, type: pick2(r, ['smg', 'smg', 'shotgun', 'rifle', 'med', 'med', 'armor']) }); }
    this.patches = Array.from({ length: 70 }, () => ({ x: r() * WS, y: r() * WS, r: 40 + r() * 120 }));
    this.blockers = [...this.trees, ...this.rocks];
  }
  begin() {
    this.ready = true;
    const s = state();
    const mk = (name, col, human, know) => { let x, y; do { x = 200 + Math.random() * (WS - 400); y = 200 + Math.random() * (WS - 400); } while (this.collides(x, y, 16)); return { x, y, hp: 100, armor: 0, w: 'pistol', cd: 0, ang: 0, alive: true, name, col, human, know, kills: 0, vx: 0, vy: 0, target: null, think: 0, flagPick: null, hitT: 0 }; };
    this.humans = [mk(s.profile.name || 'You', '#3fff8b', true)];
    if (this.online) this.humans.push(mk(net.status().peerName || 'Squadmate', '#3fd2ff', true));
    if (this.online && !this.isHost) this.humans.reverse(); // local player always humans[0]
    this.me = this.humans[0];
    this.bots = BOTNAMES.slice(0, this.online ? 18 : 19).map(n => mk(n, '#ff7a3f', false, rand(0.3, 0.72)));
    this.bots.push(mk(`🤖 ${s.settings.botName}`, '#b04bff', false, -1)); // the rival bot uses YOUR rival's real knowledge
    this.all = [...this.humans, ...this.bots];
    this.bullets = []; this.zone = { x: WS / 2, y: WS / 2, r: ZONES[0] }; this.from = null; this.to = null;
    this.k = 0; this.phase = 'drop'; this.pT = 8; this.flags = null; this.q = null; this.placement = null;
    this.toast('🪂 Dropping in — grab loot!', '#ffd23f', 2000); sfx('swoosh');
  }
  collides(x, y, rad) {
    if (x < rad || y < rad || x > WS - rad || y > WS - rad) return true;
    for (const b of this.blockers) if (Math.hypot(b.x - x, b.y - y) < b.r + rad) return true;
    for (const w of this.walls) { const cx = clamp(x, w.x, w.x + w.w), cy = clamp(y, w.y, w.y + w.h); if (Math.hypot(cx - x, cy - y) < rad) return true; }
    return false;
  }
  moveEnt(e, dx, dy) { if (!this.collides(e.x + dx, e.y, 15)) e.x += dx; if (!this.collides(e.x, e.y + dy, 15)) e.y += dy; }

  // ── phases (host only)
  nextQuestion() {
    const R = this.zone.r, a0 = rand(0, Math.PI * 2), q = nextQuestion(this.mods ? { mods: this.mods } : {});
    const flags = [0, 1, 2, 3].map(i => { const a = a0 + i * Math.PI / 2 + rand(-0.25, 0.25), d = R * rand(0.5, 0.6); return { x: clamp(this.zone.x + Math.cos(a) * d, 80, WS - 80), y: clamp(this.zone.y + Math.sin(a) * d, 80, WS - 80) }; });
    this.showQuestion(q, flags, this.k);
    if (this.online) net.send('rq', { q, flags, k: this.k });
    for (const b of this.bots) { b.flagPick = null; b.decideAt = rand(3, 14); }
  }
  showQuestion(q, flags, k) {
    this.q = q; this.flags = flags; this.k = k; this.phase = 'question'; this.pT = k < 2 ? 32 : 26; this.qMax = this.pT;
    this.qpanel(q, { title: `🚩 ZONE ${k + 1}/${ZONES.length - 1}: run to the CORRECT flag`, timer: true }); sfx('alarm');
  }
  lock() {
    const q = this.q, cor = q.a;
    this.lockResult(cor);
    if (this.online) net.send('rlock', { correct: cor });
    const f = this.flags[cor]; this.from = { ...this.zone }; this.to = { x: f.x, y: f.y, r: ZONES[this.k + 1] }; this.phase = 'shrink'; this.pT = 7;
  }
  lockResult(cor) {
    if (!this.q) return; const q = this.q, me = this.me;
    if (me.alive) {
      const d = this.flags.map(f => Math.hypot(f.x - me.x, f.y - me.y)); const near = d.indexOf(Math.min(...d));
      const idx = d[near] < this.zone.r * 0.45 ? near : -1;
      const ok = this.answer(q, idx, { noExplain: true });
      if (!ok) this.explain(q, 5200);
      this.toast(ok ? '✔ Safe zone is yours!' : idx < 0 ? '✗ You picked no flag!' : '✗ Wrong flag — RUN!', ok ? '#3fff8b' : '#ff3f7a', 1500);
      if (ok) { this.score += 100; me.hp = Math.min(100, me.hp + 15); }
    }
    this.qpanel(null); this.q = null; this.correctFlag = cor;
  }
  hostPhase(dt) {
    this.pT -= dt;
    if (this.phase === 'drop' && this.pT <= 0) this.nextQuestion();
    else if (this.phase === 'question') { this.setTimerBar(this.pT / this.qMax); if (this.pT <= 0) this.lock(); }
    else if (this.phase === 'shrink') {
      const t = 1 - Math.max(0, this.pT) / 7; this.zone = { x: this.from.x + (this.to.x - this.from.x) * t, y: this.from.y + (this.to.y - this.from.y) * t, r: this.from.r + (this.to.r - this.from.r) * t };
      if (this.pT <= 0) { this.k++; this.flags = null; this.phase = 'fight'; this.pT = this.k >= ZONES.length - 1 ? 60 : 9; }
    } else if (this.phase === 'fight' && this.pT <= 0) {
      if (this.k >= ZONES.length - 1) return this.hostEnd(true);
      this.nextQuestion();
    }
  }
  // ── combat
  tryFire(e) {
    if (e.cd > 0 || !e.alive) return; const W = WEAP[e.w]; e.cd = W.rate;
    const n = W.pellets || 1;
    for (let i = 0; i < n; i++) { const a = e.ang + rand(-W.spr, W.spr) * (e.human ? 1 : 1.6); this.bullets.push({ x: e.x + Math.cos(e.ang) * 20, y: e.y + Math.sin(e.ang) * 20, vx: Math.cos(a) * W.spd, vy: Math.sin(a) * W.spd, life: W.life, dmg: W.dmg, owner: e }); }
    if (e === this.me || this.dist2(e, this.me) < 600 * 600) sfx('gun');
  }
  dist2(a, b) { return (a.x - b.x) ** 2 + (a.y - b.y) ** 2; }
  hurt(e, dmg, by) {
    if (!e.alive) return;
    if (e.armor > 0) { const ab = Math.min(e.armor, dmg * 0.6); e.armor -= ab; dmg -= ab; }
    e.hp -= dmg; e.hitT = 0.15;
    if (e === this.me) { vibrate(30); this.shake(4, 0.12); }
    if (e.hp <= 0) {
      e.alive = false; if (by) by.kills++;
      this.loot.push({ id: this.loot.length + 1000 + Math.floor(Math.random() * 1e5), x: e.x, y: e.y, type: e.w !== 'pistol' ? e.w : 'med' });
      if (by === this.me) { this.score += 60; this.toast(`☠ Eliminated ${e.name}`, '#ffd23f', 1200); sfx('boom'); }
      if (e.human && e === this.me) this.placement = this.all.filter(x => x.alive).length + 1;
    }
  }
  update(dt) {
    if (!this.ready) return;
    const me = this.me;
    // local player input (both host & guest)
    if (me.alive) {
      let mx = 0, my = 0;
      if (this.keys.has('w') || this.keys.has('ArrowUp')) my -= 1; if (this.keys.has('s') || this.keys.has('ArrowDown')) my += 1;
      if (this.keys.has('a') || this.keys.has('ArrowLeft')) mx -= 1; if (this.keys.has('d') || this.keys.has('ArrowRight')) mx += 1;
      if (this.lstick.active) { mx = this.lstick.dx * this.lstick.mag; my = this.lstick.dy * this.lstick.mag; }
      const m = Math.hypot(mx, my); if (m > 1) { mx /= m; my /= m; }
      this.moveEnt(me, mx * 210 * dt, my * 210 * dt);
      let fire = false;
      if (this.rstick.active && this.rstick.mag > 0.25) { me.ang = Math.atan2(this.rstick.dy, this.rstick.dx); fire = this.rstick.mag > 0.55; }
      else if (!this.isTouch()) { const c = this.cam(); me.ang = Math.atan2(this.pointer.y - (me.y - c.y) * c.z - c.oy, this.pointer.x - (me.x - c.x) * c.z - c.ox); fire = this.pointer.down || this.keys.has(' '); }
      else if (this.autoAim) { const t = this.nearestEnemy(me, 420); if (t) me.ang = Math.atan2(t.y - me.y, t.x - me.x); }
      me.cd -= dt;
      if (fire) { if (this.isHost) this.tryFire(me); else if (me.cd <= 0) { me.cd = WEAP[me.w].rate; sfx('gun'); } }
      if (this.online && !this.isHost) { this.netT = (this.netT || 0) + dt; if (this.netT > 0.05) { this.netT = 0; net.send('input', { x: me.x, y: me.y, ang: me.ang, fire }); } }
    }
    if (!this.isHost) { this.interp(dt); return; }
    this.hostPhase(dt);
    // bots
    for (const b of this.bots) if (b.alive) this.botAI(b, dt);
    for (const e of this.all) { e.hitT = Math.max(0, e.hitT - dt); if (!e.human) e.cd -= dt; if (e !== me && e.human) e.cd -= dt; }
    // loot pickup
    for (const e of this.all) {
      if (!e.alive) continue;
      for (const l of this.loot) {
        if (l.taken || Math.abs(l.x - e.x) > 26 || Math.abs(l.y - e.y) > 26) continue;
        if (WEAP[l.type]) { if (WEAP[l.type].tier > WEAP[e.w].tier) { e.w = l.type; l.taken = true; if (e === me) { sfx('pickup'); this.toast(`🔫 ${WEAP[l.type].n}`, WEAP[l.type].col, 900); } } }
        else if (l.type === 'med' && e.hp < 95) { e.hp = Math.min(100, e.hp + 40); l.taken = true; if (e === me) { sfx('power'); this.toast('➕ Medkit', '#3fff8b', 900); } }
        else if (l.type === 'armor' && e.armor < 50) { e.armor = 75; l.taken = true; if (e === me) { sfx('pickup'); this.toast('🛡 Armour', '#3fd2ff', 900); } }
      }
    }
    // bullets
    for (const bl of this.bullets) {
      bl.x += bl.vx * dt; bl.y += bl.vy * dt; bl.life -= dt;
      if (bl.life <= 0) { bl.dead = true; continue; }
      for (const t of this.blockers) if ((t.x - bl.x) ** 2 + (t.y - bl.y) ** 2 < t.r * t.r) { bl.dead = true; break; }
      if (!bl.dead) for (const w of this.walls) if (bl.x > w.x && bl.x < w.x + w.w && bl.y > w.y && bl.y < w.y + w.h) { bl.dead = true; break; }
      if (!bl.dead) for (const e of this.all) {
        if (!e.alive || e === bl.owner || (e.human && bl.owner.human)) continue;
        if ((e.x - bl.x) ** 2 + (e.y - bl.y) ** 2 < 17 * 17) { bl.dead = true; this.hurt(e, bl.dmg, bl.owner); break; }
      }
    }
    this.bullets = this.bullets.filter(b => !b.dead);
    // storm
    this.stormTick = (this.stormTick || 0) + dt;
    if (this.stormTick > 0.5) { this.stormTick = 0; for (const e of this.all) if (e.alive && Math.hypot(e.x - this.zone.x, e.y - this.zone.y) > this.zone.r) { this.hurt(e, STORM[this.k] * 0.5, null); if (e === me) sfx('storm'); } }
    // end conditions
    const humansAlive = this.humans.filter(h => h.alive).length, botsAlive = this.bots.filter(b => b.alive).length;
    if (!humansAlive) return this.hostEnd(false);
    if (!botsAlive) return this.hostEnd(true);
    if (this.online) { this.snapT = (this.snapT || 0) + dt; if (this.snapT > 0.066) { this.snapT = 0; this.sendSnap(); } }
  }
  nearestEnemy(e, range) { let best = null, bd = range * range; for (const o of this.all) { if (!o.alive || o === e || (o.human && e.human)) continue; const d = this.dist2(o, e); if (d < bd) { bd = d; best = o; } } return best; }
  botAI(b, dt) {
    b.think -= dt;
    // choose a flag during questions
    if (this.phase === 'question' && b.flagPick == null && (this.qMax - this.pT) > b.decideAt) {
      const p = b.know < 0 ? botAccuracy(this.q.lo) : b.know;
      b.flagPick = Math.random() < p ? this.q.a : pick([0, 1, 2, 3].filter(i => i !== this.q.a));
    }
    if (b.think <= 0) {
      b.think = rand(0.3, 0.7);
      const en = this.nearestEnemy(b, 380); b.enemy = en;
      let tx, ty;
      const dz = Math.hypot(b.x - this.zone.x, b.y - this.zone.y);
      if (this.phase === 'question' && b.flagPick != null) { const f = this.flags[b.flagPick]; tx = f.x + rand(-40, 40); ty = f.y + rand(-40, 40); }
      else if (this.phase === 'shrink' || dz > this.zone.r * 0.85) { const z = this.to && this.phase === 'shrink' ? this.to : this.zone; tx = z.x + rand(-z.r * 0.4, z.r * 0.4); ty = z.y + rand(-z.r * 0.4, z.r * 0.4); }
      else if (en) { const a = Math.atan2(en.y - b.y, en.x - b.x) + (Math.random() < 0.5 ? 1.4 : -1.4); tx = b.x + Math.cos(a) * 120; ty = b.y + Math.sin(a) * 120; }
      else { const l = this.loot.find(l => !l.taken && Math.abs(l.x - b.x) < 400 && Math.abs(l.y - b.y) < 400 && (WEAP[l.type] ? WEAP[l.type].tier > WEAP[b.w].tier : l.type !== 'armor' || b.armor < 50)); if (l) { tx = l.x; ty = l.y; } else { tx = b.x + rand(-250, 250); ty = b.y + rand(-250, 250); } }
      b.target = { x: tx, y: ty };
    }
    if (b.target) { const dx = b.target.x - b.x, dy = b.target.y - b.y, d = Math.hypot(dx, dy); if (d > 10) { const sp = 165; const px = b.x, py = b.y; this.moveEnt(b, dx / d * sp * dt, dy / d * sp * dt); if (Math.abs(b.x - px) + Math.abs(b.y - py) < 0.5) b.think = 0; } }
    if (b.enemy && b.enemy.alive) {
      const d2 = this.dist2(b, b.enemy);
      if (d2 < 380 * 380) { const lead = Math.atan2(b.enemy.y - b.y, b.enemy.x - b.x); b.ang += ((lead - b.ang + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 5); if (Math.random() < dt * 2.2) this.tryFire(b); }
    }
  }
  hostEnd(win) {
    if (this.over) return;
    const title = win ? (this.me.alive ? '🍗 Winner winner, balanced-budget dinner!' : 'Your squad won!') : `Eliminated — placed #${this.placement || this.all.filter(x => x.alive).length + 1}`;
    if (this.online) net.send('rend', { win, title: win ? 'Your squad won! 🍗' : 'Squad wiped out' });
    this.finish(win, title);
  }
  finish(win, title) { this.qpanel(null); if (!this.over) setTimeout(() => this.end({ title, win, extra: `<p class="center">Kills: <b>${this.me.kills}</b> · Zones answered: <b>${this.answers.filter(a => a.ok).length}/${this.answers.length}</b></p>` }), 600); }

  // ── online snapshots
  sendSnap() {
    const r1 = v => Math.round(v);
    net.send('snap', {
      e: this.all.map(e => [r1(e.x), r1(e.y), +e.ang.toFixed(2), r1(e.hp), r1(e.armor), e.alive ? 1 : 0, e.w]),
      b: this.bullets.map(b => [r1(b.x), r1(b.y)]), z: [r1(this.zone.x), r1(this.zone.y), r1(this.zone.r)], ph: this.phase, pT: +this.pT.toFixed(1), k: this.k,
      lt: this.loot.filter(l => l.taken).map(l => l.id), nl: this.loot.filter(l => l.id >= 1000).map(l => [l.id, r1(l.x), r1(l.y), l.type]), kills: this.humans[1] ? this.humans[1].kills : 0,
    });
  }
  applySnap(d) {
    if (!this.ready) return;
    // host order: [hostHuman, guestHuman, ...bots]; guest's own list is [me, host, ...bots]
    const order = [this.humans[1], this.humans[0], ...this.bots];
    d.e.forEach((s, i) => { const e = order[i]; if (!e) return; const wasAlive = e.alive; if (e !== this.me) { e.tx = s[0]; e.ty = s[1]; e.ang = s[2]; } else if (Math.hypot(e.x - s[0], e.y - s[1]) > 120) { e.x = s[0]; e.y = s[1]; }
      if (s[3] < e.hp && e === this.me) { vibrate(30); this.shake(4, 0.12); } e.hp = s[3]; e.armor = s[4]; e.alive = !!s[5]; e.w = s[6]; if (wasAlive && !e.alive && e === this.me) this.placement = 0; });
    this.netBullets = d.b; this.zone = { x: d.z[0], y: d.z[1], r: d.z[2] }; this.phase = d.ph; this.pT = d.pT; this.k = d.k; this.me.kills = d.kills;
    const taken = new Set(d.lt); for (const l of this.loot) l.taken = taken.has(l.id);
    for (const [id, x, y, type] of d.nl) if (!this.loot.some(l => l.id === id)) this.loot.push({ id, x, y, type });
    if (this.phase === 'question') this.setTimerBar(this.pT / (this.qMax || 30));
  }
  interp(dt) { for (const e of this.all) if (e !== this.me && e.tx != null) { e.x += (e.tx - e.x) * Math.min(1, dt * 12); e.y += (e.ty - e.y) * Math.min(1, dt * 12); } }

  // ── input (touch twin-stick)
  onDown(x, y, ev) {
    if (!this.isTouch()) return;
    if (x < this.W / 2) this.lstick.down(x, y, ev.pointerId); else this.rstick.down(x, y, ev.pointerId);
  }
  onMove(x, y, ev) { if (this.lstick.id === ev.pointerId) this.lstick.move(x, y); if (this.rstick.id === ev.pointerId) this.rstick.move(x, y); }
  onUp(x, y, ev) { if (this.lstick.id === ev.pointerId) this.lstick.up(); if (this.rstick.id === ev.pointerId) { if (this.rstick.mag < 0.25 && this.isHost) { const t = this.nearestEnemy(this.me, 420); if (t) { this.me.ang = Math.atan2(t.y - this.me.y, t.x - this.me.x); this.tryFire(this.me); } } this.rstick.up(); } }
  cam() { const z = clamp(Math.min(this.W, this.H) / 560, 0.55, 1.15); return { x: this.me.x, y: this.me.y, z, ox: this.W / 2, oy: this.H / 2 }; }

  draw(g) {
    const W = this.W, H = this.H;
    g.fillStyle = '#5b8c3a'; g.fillRect(0, 0, W, H);
    if (!this.ready) return;
    const c = this.cam();
    g.save(); g.translate(c.ox, c.oy); g.scale(c.z, c.z); g.translate(-c.x, -c.y);
    const vx0 = c.x - c.ox / c.z - 60, vx1 = c.x + c.ox / c.z + 60, vy0 = c.y - c.oy / c.z - 60, vy1 = c.y + c.oy / c.z + 60;
    const vis = (x, y) => x > vx0 && x < vx1 && y > vy0 && y < vy1;
    g.fillStyle = '#527f33'; for (const p of this.patches) if (vis(p.x, p.y)) { g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); }
    g.strokeStyle = '#3b5f22'; g.lineWidth = 8; g.strokeRect(0, 0, WS, WS);
    for (const b of this.buildings) if (vis(b.x + b.w / 2, b.y + b.h / 2) || vis(b.x, b.y)) { g.fillStyle = '#b9a98a'; g.fillRect(b.x, b.y, b.w, b.h); g.fillStyle = '#a8977a'; for (let y = b.y + 14; y < b.y + b.h; y += 18) g.fillRect(b.x, y, b.w, 2); }
    g.fillStyle = '#4b3b2b'; for (const w of this.walls) if (vis(w.x, w.y)) g.fillRect(w.x, w.y, w.w, w.h);
    for (const l of this.loot) if (!l.taken && vis(l.x, l.y)) this.drawLoot(g, l);
    // flags
    if (this.flags) this.flags.forEach((f, i) => {
      const col = ['#ff3f7a', '#3fd2ff', '#ffd23f', '#3fff8b'][i]; const rr = ZONES[Math.min(this.k + 1, ZONES.length - 1)];
      g.globalAlpha = 0.16; g.fillStyle = col; g.beginPath(); g.arc(f.x, f.y, rr, 0, 7); g.fill(); g.globalAlpha = 0.6; g.strokeStyle = col; g.lineWidth = 4; g.setLineDash([16, 12]); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
      g.fillStyle = '#5a3a1e'; g.fillRect(f.x - 3, f.y - 70, 6, 70); g.fillStyle = col; g.beginPath(); g.moveTo(f.x + 3, f.y - 70); g.lineTo(f.x + 50, f.y - 56); g.lineTo(f.x + 3, f.y - 42); g.fill();
      g.font = '900 22px Outfit, system-ui'; g.fillStyle = '#000'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(LETTERS[i], f.x + 20, f.y - 56);
    });
    // trees & rocks (draw entities between trunk and canopy)
    for (const r of this.rocks) if (vis(r.x, r.y)) { g.fillStyle = '#8a8a8a'; g.beginPath(); g.arc(r.x, r.y, r.r, 0, 7); g.fill(); g.fillStyle = '#a5a5a5'; g.beginPath(); g.arc(r.x - r.r * 0.3, r.y - r.r * 0.3, r.r * 0.45, 0, 7); g.fill(); }
    // bullets
    g.fillStyle = '#ffec8a';
    if (this.isHost) for (const b of this.bullets) { if (vis(b.x, b.y)) g.fillRect(b.x - 2.5, b.y - 2.5, 5, 5); }
    else if (this.netBullets) for (const b of this.netBullets) if (vis(b[0], b[1])) g.fillRect(b[0] - 2.5, b[1] - 2.5, 5, 5);
    for (const e of this.all) if (e.alive && vis(e.x, e.y)) this.drawEnt(g, e);
    for (const t of this.trees) if (vis(t.x, t.y)) { g.fillStyle = '#2f6b25'; g.beginPath(); g.arc(t.x, t.y, t.r * 1.5, 0, 7); g.fill(); g.fillStyle = '#3d8a30'; g.beginPath(); g.arc(t.x - t.r * 0.3, t.y - t.r * 0.3, t.r * 0.9, 0, 7); g.fill(); }
    for (const b of this.buildings) if (vis(b.x + b.w / 2, b.y + b.h / 2) && !(this.me.x > b.x && this.me.x < b.x + b.w && this.me.y > b.y && this.me.y < b.y + b.h)) { g.globalAlpha = 0.92; g.fillStyle = b.roof; g.fillRect(b.x - 6, b.y - 6, b.w + 12, b.h + 12); g.fillStyle = '#0002'; g.fillRect(b.x - 6, b.y + b.h / 2, b.w + 12, b.h / 2 + 6); g.globalAlpha = 1; }
    // storm
    g.fillStyle = 'rgba(120,40,200,0.28)'; g.beginPath(); g.rect(-4000, -4000, WS + 8000, WS + 8000); g.arc(this.zone.x, this.zone.y, this.zone.r, 0, Math.PI * 2, true); g.fill('evenodd');
    g.strokeStyle = '#d6a2ff'; g.lineWidth = 6; g.beginPath(); g.arc(this.zone.x, this.zone.y, this.zone.r, 0, 7); g.stroke();
    if (this.phase === 'shrink' && this.to) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.setLineDash([10, 10]); g.beginPath(); g.arc(this.to.x, this.to.y, this.to.r, 0, 7); g.stroke(); g.setLineDash([]); }
    g.restore();
    this.drawHUD(g, c);
  }
  drawLoot(g, l) {
    const W = WEAP[l.type]; g.save(); g.translate(l.x, l.y);
    g.fillStyle = '#0004'; g.beginPath(); g.ellipse(0, 10, 16, 6, 0, 0, 7); g.fill();
    if (W) { g.fillStyle = W.col; g.fillRect(-14, -4, 28, 8); g.fillStyle = '#333'; g.fillRect(-4, 2, 6, 8); }
    else if (l.type === 'med') { g.fillStyle = '#fff'; g.fillRect(-11, -11, 22, 22); g.fillStyle = '#e22'; g.fillRect(-3, -8, 6, 16); g.fillRect(-8, -3, 16, 6); }
    else { g.fillStyle = '#3fd2ff'; g.beginPath(); g.moveTo(0, -12); g.lineTo(11, -6); g.lineTo(9, 8); g.lineTo(0, 13); g.lineTo(-9, 8); g.lineTo(-11, -6); g.fill(); }
    g.restore();
  }
  drawEnt(g, e) {
    g.save(); g.translate(e.x, e.y);
    g.fillStyle = '#0004'; g.beginPath(); g.ellipse(2, 6, 16, 9, 0, 0, 7); g.fill();
    g.rotate(e.ang); g.fillStyle = '#333'; g.fillRect(8, -3, e.w === 'rifle' ? 26 : e.w === 'shotgun' ? 22 : 16, 6); g.rotate(-e.ang);
    g.fillStyle = e.hitT > 0 ? '#fff' : e.col; g.beginPath(); g.arc(0, 0, 15, 0, 7); g.fill();
    if (e.armor > 0) { g.strokeStyle = '#3fd2ff'; g.lineWidth = 3; g.stroke(); }
    g.fillStyle = '#ffdcb0'; g.beginPath(); g.arc(Math.cos(e.ang - 0.6) * 12, Math.sin(e.ang - 0.6) * 12, 5, 0, 7); g.arc(Math.cos(e.ang + 0.6) * 12, Math.sin(e.ang + 0.6) * 12, 5, 0, 7); g.fill();
    g.restore();
    if (e !== this.me) { g.font = '700 11px Outfit, system-ui'; g.textAlign = 'center'; g.fillStyle = e.human ? '#3fd2ff' : '#fff'; g.fillText(e.name, e.x, e.y - 26); g.fillStyle = '#0008'; g.fillRect(e.x - 16, e.y - 22, 32, 4); g.fillStyle = '#ff3f7a'; g.fillRect(e.x - 16, e.y - 22, 32 * Math.max(0, e.hp) / 100, 4); }
  }
  drawHUD(g, c) {
    const W = this.W, H = this.H, me = this.me;
    // health/armour
    g.fillStyle = '#0009'; g.fillRect(W / 2 - 110, H - 46, 220, 30); g.fillStyle = '#3fff8b'; g.fillRect(W / 2 - 106, H - 42, 212 * Math.max(0, me.hp) / 100, 12); g.fillStyle = '#3fd2ff'; g.fillRect(W / 2 - 106, H - 26, 212 * me.armor / 100, 6);
    this.text(`${WEAP[me.w].n}`, W / 2, H - 58, { size: 14, color: WEAP[me.w].col });
    const alive = this.all.filter(e => e.alive).length;
    const qp = this.hud.querySelector('.qpanel'); const top = qp ? qp.offsetTop + qp.offsetHeight + 8 : 12;
    this.text(`👥 ${alive} alive · ☠ ${me.kills}`, 12, top + 12, { size: 14, align: 'left' });
    const phaseTxt = this.phase === 'drop' ? `Drop & loot ${Math.ceil(this.pT)}s` : this.phase === 'question' ? `Flag locks in ${Math.ceil(this.pT)}s` : this.phase === 'shrink' ? 'Zone moving!' : this.k >= ZONES.length - 1 ? `Final circle ${Math.ceil(this.pT)}s` : `Next question ${Math.ceil(this.pT)}s`;
    this.text(phaseTxt, 12, top + 34, { size: 13, align: 'left', color: this.phase === 'question' ? '#ffd23f' : '#fff' });
    // minimap
    const ms = Math.min(110, W * 0.26), mx = W - ms - 10, my = top + 4, sc = ms / WS;
    g.fillStyle = '#0009'; g.fillRect(mx, my, ms, ms); g.strokeStyle = '#fff6'; g.strokeRect(mx, my, ms, ms);
    g.strokeStyle = '#d6a2ff'; g.lineWidth = 2; g.beginPath(); g.arc(mx + this.zone.x * sc, my + this.zone.y * sc, this.zone.r * sc, 0, 7); g.stroke();
    if (this.flags) this.flags.forEach((f, i) => { g.fillStyle = ['#ff3f7a', '#3fd2ff', '#ffd23f', '#3fff8b'][i]; g.font = '900 11px Outfit, system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(LETTERS[i], mx + f.x * sc, my + f.y * sc); });
    for (const h of this.humans) if (h.alive) { g.fillStyle = h === me ? '#3fff8b' : '#3fd2ff'; g.fillRect(mx + h.x * sc - 3, my + h.y * sc - 3, 6, 6); }
    // off-screen arrows to flags
    if (this.flags) this.flags.forEach((f, i) => {
      const sx = (f.x - c.x) * c.z + c.ox, sy = (f.y - c.y) * c.z + c.oy;
      if (sx > 20 && sx < W - 20 && sy > 20 && sy < H - 20) return;
      const a = Math.atan2(sy - H / 2, sx - W / 2), R = Math.min(W, H) / 2 - 40;
      const ax = W / 2 + Math.cos(a) * R, ay = H / 2 + Math.sin(a) * R;
      g.fillStyle = ['#ff3f7a', '#3fd2ff', '#ffd23f', '#3fff8b'][i]; g.beginPath(); g.arc(ax, ay, 15, 0, 7); g.fill();
      g.fillStyle = '#000'; g.font = '900 14px Outfit, system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(LETTERS[i], ax, ay);
    });
    this.lstick.draw(g); this.rstick.draw(g);
    if (this.isTouch() && this.t < 12) this.text('Left thumb: move · Right thumb: aim & shoot', W / 2, H - 80, { size: 12, stroke: true });
    else if (!this.isTouch() && this.t < 12) this.text('WASD move · mouse aim · click / hold to shoot', W / 2, H - 80, { size: 13 });
    if (!me.alive && !this.over) this.text('Spectating squadmate…', W / 2, H / 2, { size: 22, color: '#ff3f7a' });
  }
  destroy() { if (this.online) ['rready', 'rinit', 'input', 'snap', 'rq', 'rlock', 'rend', '__close'].forEach(t => net.off(t)); }
}
function pick2(r, arr) { return arr[Math.floor(r() * arr.length)]; }
