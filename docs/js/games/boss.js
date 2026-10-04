// Final Boss – mock exam with real pacing (3h15m / 100 Q ≈ 1.95 min each), flag & review, navigator.
// Exam mode: no feedback until you submit (like Pearson VUE). Practice mode: instant feedback + explanation.
import { Game, rand, esc, LETTERS } from '../core/engine.js';
import { sfx, music } from '../core/audio.js';
import { examPaper } from '../core/questions.js';
import { MODULES } from '../content/syllabus.js';

export default class Boss extends Game {
  static id = 'boss'; static music = 'boss'; static theme = 'boss';
  init() {
    this.embers = Array.from({ length: 50 }, () => ({ x: Math.random(), y: Math.random(), s: rand(1, 3), v: rand(0.02, 0.08) }));
    this.bossHP = 1; this.showHP = false; this.menu();
  }
  menu() {
    const el = document.createElement('div'); el.className = 'overlay menu-ov';
    el.innerHTML = `<div class="panel"><h2>🐉 Final Boss: Mock Exam</h2>
      <p class="muted">Real exam: 100 questions · 3 h 15 min · ~1.95 min per question · weighted by module.</p>
      <div class="row"><button class="btn" data-n="20">Quick 20</button><button class="btn" data-n="50">Half 50</button><button class="btn" data-n="100">Full 100</button></div>
      <label class="row tog">Practice mode (instant feedback) <input type="checkbox" id="prac"></label>
      <button class="btn ghost" id="back">← Back</button></div>`;
    this.stage.appendChild(el);
    el.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { this.practice = el.querySelector('#prac').checked; el.remove(); this.begin(+b.dataset.n); });
    el.querySelector('#back').onclick = () => this.quit();
  }
  begin(n) {
    this.qs = examPaper(n); this.sel = new Array(n).fill(-1); this.flag = new Array(n).fill(false); this.locked = new Array(n).fill(false);
    this.i = 0; this.limit = Math.round(n * 1.95 * 60); this.left = this.limit; this.started = true; this.showHP = this.practice; this.hits = 0;
    this.ui = document.createElement('div'); this.ui.className = 'exam hit'; this.hud.appendChild(this.ui); sfx('alarm'); this.render();
  }
  render() {
    const q = this.qs[this.i], n = this.qs.length, s = this.sel[this.i], lk = this.locked[this.i];
    const mm = Math.floor(this.left / 60), ss = Math.floor(this.left % 60);
    this.ui.innerHTML = `<div class="eq"><h3>QUESTION ${this.i + 1} OF ${n} · ${MODULES[q.mod - 1].short} · ⏱ ${Math.floor(mm / 60)}:${String(mm % 60).padStart(2, '0')}:${String(ss).padStart(2, '0')} ${this.flag[this.i] ? '· 🚩 flagged' : ''}</h3>
      ${q.intro ? `<details class="scen" open><summary>📄 Scenario</summary><div>${q.intro}</div></details>` : ''}<p>${esc(q.q)}</p>
      ${q.opts.map((o, k) => { let c = s === k ? 'sel' : ''; if (lk) c = k === q.a ? 'good' : (s === k ? 'bad' : ''); return `<button class="opt ${c}" data-k="${k}"><b>${LETTERS[k]}</b>${esc(o)}</button>`; }).join('')}
      ${lk && this.practice ? `<div class="ex">${s === q.a ? '✔ Correct. ' : '✗ '}${esc(q.ex || '')}</div>` : ''}</div>
      <div class="nav"><button class="btn ghost" id="prev">◀ Prev</button><button class="btn ghost" id="flg">${this.flag[this.i] ? 'Unflag' : '🚩 Flag'}</button>
        ${this.practice && !lk ? '<button class="btn" id="chk">Check</button>' : ''}<button class="btn ghost" id="next">Next ▶</button><button class="btn" id="sub" style="background:#ff3f7a;color:#fff;box-shadow:0 4px 0 #a0103e">Submit exam</button></div>
      <div class="grid">${this.qs.map((x, k) => `<button data-g="${k}" class="${this.sel[k] >= 0 ? 'done' : ''} ${this.flag[k] ? 'flag' : ''} ${k === this.i ? 'cur' : ''}">${k + 1}</button>`).join('')}</div>`;
    this.ui.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { if (this.locked[this.i]) return; this.sel[this.i] = +b.dataset.k; sfx('click'); if (!this.practice) this.attack(); this.render(); });
    this.ui.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { this.i = +b.dataset.g; this.render(); });
    this.ui.querySelector('#prev').onclick = () => { this.i = Math.max(0, this.i - 1); this.render(); };
    this.ui.querySelector('#next').onclick = () => { this.i = Math.min(n - 1, this.i + 1); this.render(); this.ui.scrollTop = 0; };
    this.ui.querySelector('#flg').onclick = () => { this.flag[this.i] = !this.flag[this.i]; this.render(); };
    const chk = this.ui.querySelector('#chk'); if (chk) chk.onclick = () => this.check();
    this.ui.querySelector('#sub').onclick = () => { const un = this.sel.filter(x => x < 0).length, fl = this.flag.filter(Boolean).length; if (confirm(`Submit now?${un ? `\n${un} unanswered` : ''}${fl ? `\n${fl} flagged` : ''}`)) this.submit(); };
  }
  check() {
    if (this.sel[this.i] < 0 || this.locked[this.i]) return;
    this.locked[this.i] = true; const q = this.qs[this.i];
    const ok = this.answer(q, this.sel[this.i], { noExplain: true });
    if (ok) { this.bossHP -= 1 / this.qs.length * 1.6; this.hits = 0.5; this.score += 10; } else this.hurt = 0.5;
    this.render();
  }
  attack() { this.hits = 0.4; sfx('hit'); }
  onKey(k, down) {
    if (!down || !this.started || this.over) return;
    const kk = '1234'.includes(k) ? +k - 1 : 'abcd'.includes(k) && k.length === 1 ? 'abcd'.indexOf(k) : -1;
    if (kk >= 0 && !this.locked[this.i]) { this.sel[this.i] = kk; if (!this.practice) this.attack(); this.render(); }
    if (k === 'ArrowRight' || k === 'n') { this.i = Math.min(this.qs.length - 1, this.i + 1); this.render(); }
    if (k === 'ArrowLeft') { this.i = Math.max(0, this.i - 1); this.render(); }
    if (k === 'f') { this.flag[this.i] = !this.flag[this.i]; this.render(); }
    if (k === 'Enter' && this.practice) this.check();
  }
  submit() {
    if (this.over) return;
    const n = this.qs.length; let right = 0; const per = {};
    this.qs.forEach((q, k) => { const ok = this.locked[k] ? this.sel[k] === q.a : this.answer(q, this.sel[k], { silent: true, noExplain: true }); if (this.locked[k]) {/* already recorded */} if (ok) right++; per[q.mod] = per[q.mod] || [0, 0]; per[q.mod][1]++; if (ok) per[q.mod][0]++; });
    // practice-mode answers were recorded when checked; make sure all appear in results
    if (this.practice) { const recorded = new Set(this.answers.map(a => a.q.id)); this.qs.forEach((q, k) => { if (!recorded.has(q.id)) this.answers.push({ q, idx: this.sel[k], ok: this.sel[k] === q.a, botOk: false }); }); }
    const pct = Math.round(right / n * 100); this.score = right * 10 + Math.round(this.left / 30);
    this.ui.remove(); this.showHP = true; this.bossHP = 1 - pct / 100;
    const table = `<div class="modbars">${Object.keys(per).sort().map(m => { const [r, t] = per[m]; const mm = MODULES[m - 1]; return `<div class="mb"><span>${mm.short}</span><div class="bars"><div class="bar me" style="--c:${mm.color}"><i style="width:${Math.round(r / t * 100)}%"></i></div></div><em>${r}/${t}</em></div>`; }).join('')}</div>`;
    setTimeout(() => this.end({ title: pct >= 60 ? `Boss slain — ${pct}%` : pct >= 50 ? `Boss wounded — ${pct}%` : `The boss survives — ${pct}%`, win: pct >= 60, extra: `<p class="center muted">Time used ${Math.round((this.limit - this.left) / 60)} of ${Math.round(this.limit / 60)} min. Aim for 70%+ to walk in confident.</p>${table}` }), 1500);
  }
  update(dt) {
    for (const e of this.embers) { e.y -= e.v * dt; if (e.y < 0) { e.y = 1; e.x = Math.random(); } }
    this.hits = Math.max(0, (this.hits || 0) - dt); this.hurt = Math.max(0, (this.hurt || 0) - dt);
    if (this.started && !this.over) {
      const prev = Math.floor(this.left); this.left -= dt;
      if (Math.floor(this.left) !== prev) { const h = this.ui && this.ui.querySelector('.eq h3'); if (h) { const mm = Math.floor(this.left / 60), ss = Math.floor(this.left % 60); h.innerHTML = h.innerHTML.replace(/⏱ [\d:]+/, `⏱ ${Math.floor(mm / 60)}:${String(mm % 60).padStart(2, '0')}:${String(ss).padStart(2, '0')}`); } }
      if (this.left <= 0) { this.left = 0; this.submit(); }
    }
  }
  draw(g) {
    const W = this.W, H = this.H;
    const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, '#12040c'); grd.addColorStop(1, '#4a0f1e'); g.fillStyle = grd; g.fillRect(0, 0, W, H);
    for (const e of this.embers) { g.fillStyle = `rgba(255,${120 + e.s * 30},40,0.7)`; g.fillRect(e.x * W, e.y * H, e.s, e.s); }
    // dragon silhouette
    const cx = W * 0.5, cy = H * 0.42, sc = Math.min(W, H) / 500, br = Math.sin(this.t * 1.5) * 6;
    g.save(); g.translate(cx + (this.hits > 0 ? rand(-5, 5) : 0), cy + br); g.scale(sc, sc); g.fillStyle = this.hits > 0 ? '#5a1020' : '#22060e';
    g.beginPath(); g.moveTo(-220, -40); g.quadraticCurveTo(-120, -160, -30, -60); g.quadraticCurveTo(0, -90, 30, -60); g.quadraticCurveTo(120, -160, 220, -40); g.quadraticCurveTo(80, -20, 40, 40); g.lineTo(0, 120); g.lineTo(-40, 40); g.quadraticCurveTo(-80, -20, -220, -40); g.fill();
    g.fillStyle = '#ff5a2a'; g.beginPath(); g.arc(-14, -40, 5, 0, 7); g.arc(14, -40, 5, 0, 7); g.fill(); g.restore();
    if (this.hurt > 0) { g.fillStyle = `rgba(255,80,20,${this.hurt})`; g.fillRect(0, 0, W, H); }
    if (this.showHP) { g.fillStyle = '#0009'; g.fillRect(W / 2 - 120, 20, 240, 12); g.fillStyle = '#ff3f7a'; g.fillRect(W / 2 - 120, 20, 240 * Math.max(0, this.bossHP), 12); }
  }
}
