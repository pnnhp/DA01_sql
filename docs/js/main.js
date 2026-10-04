// App shell: navigation, world map, ranks, study plan, settings, multiplayer lobby.
import { MODULES, ALL_LOS, loName, buildPlan, CARDS } from './content/syllabus.js';
import * as store from './core/store.js';
import { unlock, sfx, music, refreshMusic } from './core/audio.js';
import { esc } from './core/engine.js';
import { net } from './core/net.js';
import { LESSONS, lessonById, lessonsForModule, dueLessons, lessonSchedule, iso } from './lessons/index.js';
import { playLesson } from './lessons/player.js';
import { playReels, retest } from './reels/reels.js';
import { playBook, bookRows, bookCount, nextBookSet, bookQsForLesson } from './book/book.js';
import { KIND } from './content/book/index.js';
import { forecast, STATUS, fmtDate } from './core/forecast.js';
import { READING, readingSections, sectionKey } from './content/reading.js';

const S = store.state;
export const GAMES = {
  ninja:     { title: 'Info Ninja', emoji: '🥷', mod: 1, style: 'Ink & neon slicing', desc: 'Slice only what matches the call-out. Combos, bombs and a scroll-slicing boss.' },
  runner:    { title: 'Cost Runner', emoji: '🏃', mod: 2, style: 'Retro pixel runner', desc: 'Sprint through the right cost gate, dodge sunk-cost bombs, beat the high-low boss.' },
  factory:   { title: 'Overhead Factory', emoji: '🏭', mod: 3, style: 'Industrial cartoon', desc: 'Route overheads down chutes, then crane-grab the right answer crates off the conveyor.' },
  strike:    { title: 'Variance Strike', emoji: '🚀', mod: 4, style: 'Synthwave space shooter', desc: 'Blast the asteroid carrying the right variance. Boss: full operating-statement mothership.' },
  tycoon:    { title: 'Division Tycoon', emoji: '🏢', mod: 5, style: 'Corporate sim', desc: 'Run 3 divisions: accept goal-congruent projects, sort KPIs onto the balanced scorecard.' },
  rush:      { title: 'Factory Rush', emoji: '⚙️', mod: 6, style: 'Bright flat arcade', desc: 'Juggle scarce hours, hit break-even on the live CVP chart, pop the right investment bubbles.' },
  warehouse: { title: 'Warehouse Panic', emoji: '📦', mod: 7, style: '8-bit warehouse sim', desc: 'Keep stock alive in real time. Correct answers draw your reorder lines.' },
  royale:    { title: 'Audit Royale', emoji: '🪂', mod: null, style: 'Battle royale (PUBG-style)', desc: 'Drop in, loot, fight 20 bots. The safe zone moves to the CORRECT answer — run there!', mp: true },
  tanks:     { title: 'Ledger Tanks', emoji: '💣', mod: null, style: 'Artillery duel (DDTank-style)', desc: 'Pick the right ammo (answer) then aim angle & power with wind. Vs bot, friend or online.', mp: true },
  boss:      { title: 'Final Boss: Mock Exam', emoji: '🐉', mod: null, style: 'Dark fantasy exam sim', desc: 'Real exam pacing (~2 min/Q), flag & review, weighted like the real paper.' },
};

const app = {
  el: null, current: null, screen: 'map',
  async play(id, opts = {}) {
    unlock(); sfx('click');
    if (this.current) { try { this.current.stop(); } catch (e) { /* ignore */ } this.current = null; }
    if (!opts.anyway && !opts.online && !opts.skipCard && this.gate(id, opts)) return;
    const mod = await import(`./games/${id}.js`);
    document.body.classList.add('ingame');
    this.el.innerHTML = '<div class="gameroot"></div>';
    const G = mod.default; const game = new G(this, opts);
    this.current = game; game.mount(this.el.querySelector('.gameroot')); game.start();
  },
  // Games only ask about lessons you've finished. If you haven't started the module yet, suggest the first lesson.
  gate(id, opts) {
    const g = GAMES[id]; if (!g || id === 'boss' || S().settings.lockLessons === false) return false;
    const pool = g.mod ? lessonsForModule(g.mod) : LESSONS.filter(L => L.lo);
    const done = pool.filter(L => store.lessonDone(L.id));
    if (done.length) return false;
    const first = pool[0];
    this.screen = 'gate'; document.body.classList.remove('ingame');
    this.el.innerHTML = `<section class="panel gate"><h2>${g.emoji} ${esc(g.title)}</h2>
      <div class="say">This game only asks about things you've learned in your lessons. You haven't done any ${g.mod ? 'Module ' + g.mod + ' ' : ''}lessons yet, so let's start with one!</div>
      <p>📖 <b>${esc(first.title)}</b> · ~${first.mins} min</p>
      <div class="row"><button class="btn big" id="gl">Do the lesson first</button><button class="btn ghost" id="ga">Play anyway (all ${g.mod ? 'module' : 'course'} questions)</button><button class="btn ghost" id="gb">◀ Back</button></div></section>`;
    this.el.querySelector('#gl').onclick = () => this.lesson(first.id);
    this.el.querySelector('#ga').onclick = () => this.play(id, { ...opts, anyway: true });
    this.el.querySelector('#gb').onclick = () => this.go('map');
    return true;
  },
  book(opts = {}) { if (this.current) { try { this.current.stop(); } catch (e) { /* ignore */ } this.current = null; } unlock(); sfx('click'); this.screen = 'bookplay'; playBook(this, opts); },
  reels(opts = {}) { if (this.current) { try { this.current.stop(); } catch (e) { /* ignore */ } this.current = null; } unlock(); sfx('click'); this.screen = 'reels'; playReels(this, opts); },
  lesson(id) { if (this.current) { try { this.current.stop(); } catch (e) { /* ignore */ } this.current = null; } unlock(); sfx('click'); playLesson(this, id); },
  go(screen, arg) {
    if (this.current) { try { this.current.stop(); } catch (e) { /* ignore */ } this.current = null; }
    document.body.classList.remove('ingame');
    this.screen = screen; render(screen, arg);
    document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.s === (screen === 'plan' ? 'learn' : screen)));
    window.scrollTo(0, 0);
  },
};
window.__app = app;

// ───────── helpers
const pct = v => Math.round(v * 100);
const ring = (v, color, size = 64, label = '') => {
  const r = size / 2 - 5, c = 2 * Math.PI * r;
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-dasharray="${c * v} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})" class="ring-fg"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle">${label}</text></svg>`;
};
const daysTo = d => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

function header() {
  const s = S(), r = store.readiness(), rk = store.rankFor(r), lv = store.level();
  return `<header class="top">
    <div class="who"><div class="avatar">${rk.icon}</div><div><div class="nm">${esc(s.profile.name || 'Player')}</div><div class="rk">${rk.name} · Lv ${lv}</div>
      <div class="xpbar"><i style="width:${pct(store.levelProgress())}%"></i></div></div></div>
    <div class="chips"><span class="chip">🔥 ${s.streak.days}d</span><span class="chip">📅 ${daysTo(s.settings.examDate)}d to exam</span><span class="chip">🪙 ${s.coins}</span></div>
  </header>`;
}

function render(screen, arg) {
  const root = app.el;
  if (!S().profile.name) return renderWelcome();
  music(screen === 'map' ? 'menu' : 'calm');
  const views = { map: viewMap, arcade: viewArcade, ranks: viewRanks, plan: viewLearn, learn: viewLearn, settings: viewSettings, lobby: viewLobby, module: viewModule, fix: viewFix, book: viewBook };
  root.innerHTML = `<div class="screen">${header()}<main>${(views[screen] || viewMap)(arg)}</main></div>`;
  bind(root);
}

function renderWelcome() {
  app.el.innerHTML = `<div class="screen welcome"><div class="hero">
    <div class="logo">COST<span>COMMANDO</span></div><p>Management Accounting exam prep, played as action games.<br>CPA Australia Foundation · 7 modules · 2 multiplayer modes.</p>
    <label>Your player name<input id="nm" maxlength="18" placeholder="e.g. Phuong" autocomplete="off"></label>
    <label>Name your rival bot (it starts knowing nothing, just like you)<input id="bn" maxlength="14" value="Ghost"></label>
    <button class="btn big" id="startbtn">Start the mission ▶</button></div></div>`;
  app.el.querySelector('#startbtn').onclick = () => {
    unlock(); const n = app.el.querySelector('#nm').value.trim();
    if (!n) { app.el.querySelector('#nm').focus(); return; }
    S().profile.name = n; S().settings.botName = app.el.querySelector('#bn').value.trim() || 'Ghost'; store.save(); sfx('power');
    const j = pendingJoin(); app.go(j ? 'lobby' : 'map', j);
  };
}

function todaysMission() {
  const { plan } = buildPlan(S().settings.examDate, new Date(S().settings.planStart));
  const now = new Date(); const cur = plan.find(p => now >= p.start && now <= new Date(p.end.getTime() + 86399000)) || plan[0];
  const weak = store.weakestLOs(3);
  const mod = cur.mod || +weak[0].split('.')[0];
  const gid = Object.keys(GAMES).find(k => GAMES[k].mod === mod);
  return { cur, mod, gid, weak };
}

function todayClass(compact) {
  const s = S(); const t = dueLessons(s.settings.examDate, s.settings.planStart, store.lessonDone);
  const dayNo = Math.max(1, Math.floor((new Date(iso(new Date())) - new Date(s.settings.planStart)) / 86400000) + 1);
  const row = (x, done) => { const L = lessonById(x.id); const m = MODULES.find(mm => mm.id === L.mod);
    return `<button class="lrow ${done ? 'done' : ''} ${!done && x.date < iso(new Date()) ? 'late' : ''}" data-lesson="${L.id}" style="--mc:${m ? m.color : '#ffd23f'}"><span class="lck">${done ? '✅' : '📖'}</span><span class="lt"><b>${esc(L.title)}</b><i>${m ? m.short : 'Start'} · ~${L.mins} min${!done && x.date < iso(new Date()) ? ' · catch-up' : ''}</i></span><span class="lgo">▶</span></button>`; };
  const list = [...t.doneToday.map(x => row(x, true)), ...t.due.slice(0, compact ? 3 : 12).map(x => row(x, false))].join('');
  const more = t.due.length > (compact ? 3 : 12) ? `<p class="muted small">+${t.due.length - (compact ? 3 : 12)} more to catch up</p>` : '';
  const empty = !t.due.length ? (t.next ? `<p>🎉 You're all caught up for today! Want to get ahead?</p><button class="lrow" data-lesson="${t.next.id}"><span class="lck">⏭</span><span class="lt"><b>${esc(lessonById(t.next.id).title)}</b><i>scheduled ${t.next.date}</i></span><span class="lgo">▶</span></button>` : '<p>🏁 All lessons done! Now it\'s revision time: play Final Boss mock exams daily.</p>') : '';
  return `<section class="classcard"><div class="mtag">📚 TODAY'S CLASS · DAY ${dayNo}</div><h3>${t.due.length ? `${t.due.length} lesson${t.due.length > 1 ? 's' : ''} to do` : 'Lessons done ✔'}</h3>
    <div class="lrows">${list}</div>${more}${empty}${(() => { const nr = nextReading(); return nr ? `<p class="muted small" style="margin:10px 0 4px">📖 Also read in the study guide:</p><div class="lrows"><button class="lrow readrow" data-read="${sectionKey(nr.mod, nr.sec.n)}"><span class="lck">⬜</span><span class="lt"><b>M${nr.mod} §${nr.sec.n} ${esc(nr.sec.title)}</b><i>~${hm(nr.sec.mins)} · tap when read</i></span></button></div>` : ''; })()}</section>`;
}

function viewMap() {
  const tm = todaysMission(); const m = MODULES.find(x => x.id === tm.mod);
  const nodes = MODULES.map((mm, i) => {
    const v = store.moduleMastery(mm.id), bv = store.moduleMastery(mm.id, 'bot'), g = Object.keys(GAMES).find(k => GAMES[k].mod === mm.id);
    return `<button class="node ${i % 2 ? 'right' : 'left'}" data-mod="${mm.id}" style="--mc:${mm.color}">
      ${ring(v, mm.color, 70, mm.short)}<div class="nd"><div class="ndt">${mm.name}</div>
      <div class="nds">${GAMES[g].emoji} ${GAMES[g].title} · ${mm.weight}% of exam</div>
      <div class="ndb"><span>You ${pct(v)}%</span><span>🤖 ${pct(bv)}%</span></div></div></button>`;
  }).join('<div class="path"></div>');
  return `${todayClass(true)}${forecastLine()}${fixCard()}${bookCard()}<section class="mission" style="--mc:${m.color}"><div class="mtag">🎮 THEN PLAY</div>
      <h3>${tm.cur.mod ? `${m.short}: ${m.name}` : 'Revision sprint'} </h3><p>Plan: ~${tm.cur.hoursPerDay} h/day. Weak spots: ${tm.weak.map(lo => `<b>${lo}</b>`).join(', ')}</p>
      <div class="row"><button class="btn" data-play="${tm.gid}">${GAMES[tm.gid].emoji} Play ${GAMES[tm.gid].title}</button><button class="btn ghost" data-play="royale">🪂 Quick Royale</button></div></section>
    <section class="specials">
      <button class="special royale" data-play="royale"><span>🪂</span><b>Audit Royale</b><i>PUBG-style · solo or duo</i></button>
      <button class="special tanks" data-play="tanks"><span>💣</span><b>Ledger Tanks</b><i>DDTank-style · vs bot/friend</i></button>
      <button class="special boss" data-play="boss"><span>🐉</span><b>Final Boss</b><i>Mock exam</i></button>
      <button class="special friends" data-go="lobby"><span>👥</span><b>Play with a friend</b><i>Invite link</i></button>
    </section>
    <h2 class="sec">World map</h2><div class="worldmap">${nodes}<div class="path"></div>
      <button class="node examnode" data-play="boss">${ring(store.readiness() / 100, '#ff3f7a', 70, 'EXAM')}<div class="nd"><div class="ndt">Exam day</div><div class="nds">${new Date(S().settings.examDate).toDateString()} · predicted ${store.predictedScore()}%</div></div></button></div>`;
}

function viewModule(id) {
  const m = MODULES.find(x => x.id === +id); const gid = Object.keys(GAMES).find(k => GAMES[k].mod === m.id);
  return `<button class="btn ghost small" data-go="map">← Map</button>
  <section class="modhead" style="--mc:${m.color}"><h2>${m.short} · ${m.name}</h2><p>${m.weight}% of the exam · study-map time ${m.hours} h</p></section>
  <div class="gamecard big" data-play="${gid}" style="--mc:${m.color}"><div class="ge">${GAMES[gid].emoji}</div><div><b>${GAMES[gid].title}</b><i>${GAMES[gid].style}</i><p>${GAMES[gid].desc}</p></div><span class="playbtn">▶</span></div>
  <div class="row"><button class="btn ghost" data-royale="${m.id}">🪂 Royale: ${m.short} only</button><button class="btn ghost" data-tanks="${m.id}">💣 Tanks: ${m.short} only</button></div>
  <h3 class="sec">📚 Lessons</h3><div class="lrows">${lessonsForModule(m.id).map(L => `<button class="lrow ${store.lessonDone(L.id) ? 'done' : ''}" data-lesson="${L.id}" style="--mc:${m.color}"><span class="lck">${store.lessonDone(L.id) ? '✅' : '📖'}</span><span class="lt"><b>${esc(L.title)}</b><i>~${L.mins} min</i></span><span class="lgo">▶</span></button>`).join('')}</div>
  <h3 class="sec">📕 From the book <button class="btn ghost small" data-bookrand="${m.id}">🎲 Random 10</button></h3><div class="lrows">${bookRows(m.id)}</div>
  <h3 class="sec">📖 Study-guide reading</h3><div class="lrows">${readingRows(m.id)}</div>
  <h3 class="sec">Learning objectives</h3>
  <div class="lolist">${Object.entries(m.los).map(([lo, n]) => { const v = store.loMastery(lo), b = store.loMastery(lo, 'bot'); return `<div class="lo"><div><b>${lo}</b> ${n}</div>
    <div class="bars"><div class="bar me"><i style="width:${pct(v)}%"></i></div><div class="bar bot"><i style="width:${pct(b)}%"></i></div></div><span>${pct(v)}% · 🤖${pct(b)}%</span></div>`; }).join('')}</div>
  <h3 class="sec">Power-up card</h3><div class="panel powercard inline" style="--mc:${m.color}"><h2>${CARDS[m.id].title}</h2><ul>${CARDS[m.id].lines.map(l => `<li>${l}</li>`).join('')}</ul></div>`;
}

function viewArcade() {
  return `<h2 class="sec">All games</h2><div class="gamegrid">${Object.entries(GAMES).map(([k, g]) => {
    const m = g.mod ? MODULES.find(x => x.id === g.mod) : null;
    return `<div class="gamecard" data-play="${k}" style="--mc:${m ? m.color : '#ff3f7a'}"><div class="ge">${g.emoji}</div><div><b>${g.title}</b><i>${m ? m.short + ' · ' : ''}${g.style}</i><p>${g.desc}</p>
      <small>Best: ${S().best[k] || 0}</small></div><span class="playbtn">▶</span></div>`; }).join('')}</div>`;
}

function viewRanks() {
  const lb = store.leaderboard(), r = store.readiness(), br = store.readiness('bot');
  const days = S().days; const cells = [];
  for (let i = 55; i >= 0; i--) { const d = iso(new Date(Date.now() - i * 86400000)); const n = days[d] || 0; cells.push(`<i title="${d}: ${n}" class="h${n === 0 ? 0 : n < 15 ? 1 : n < 40 ? 2 : 3}"></i>`); }
  return `${forecastLine()}<section class="readiness"><div>${ring(r / 100, '#3fff8b', 110, r + '%')}<b>You</b></div><div class="vs">VS</div><div>${ring(br / 100, '#b04bff', 110, br + '%')}<b>🤖 ${esc(S().settings.botName)}</b></div></section>
  <p class="center muted">Exam readiness = mastery × exam weighting. Predicted exam score ≈ <b>${store.predictedScore()}%</b>. ${r >= br ? 'You are ahead of your bot — keep the gap!' : 'Your bot is ahead — it studies at a typical pace, so beat it!'}</p>
  <h3 class="sec">Leaderboard</h3><div class="lb">${lb.map((p, i) => `<div class="lbrow ${p.me ? 'me' : ''} ${p.bot ? 'bot' : ''}"><span class="pos">${i + 1}</span><span class="nm">${esc(p.name)}${p.me ? ' (you)' : ''}</span><span class="rk">${p.rank}</span><b>${p.readiness}%</b></div>`).join('')}</div>
  <p class="muted small">Friends appear here after you play together (scores sync over the connection).</p>
  <h3 class="sec">Module mastery</h3><div class="modbars">${MODULES.map(m => `<div class="mb"><span>${m.short}</span><div class="bars"><div class="bar me" style="--c:${m.color}"><i style="width:${pct(store.moduleMastery(m.id))}%"></i></div><div class="bar bot"><i style="width:${pct(store.moduleMastery(m.id, 'bot'))}%"></i></div></div><em>${pct(store.moduleMastery(m.id))}%</em></div>`).join('')}</div><p class="muted small">Coloured bar = you · purple bar = 🤖 bot.</p>
  <h3 class="sec">Weakest topics → practise next</h3><div class="weak">${store.weakestLOs(6).map(lo => `<button class="chip" data-mod="${lo.split('.')[0]}">${lo} ${esc(loName(lo))} · ${pct(store.loMastery(lo))}%</button>`).join('')}</div>
  <h3 class="sec">Activity (last 8 weeks)</h3><div class="heat">${cells.join('')}</div>
  <h3 class="sec">Ranks</h3><div class="ranks">${store.RANKS.map(k => `<span class="${r >= k.min ? 'got' : ''}">${k.icon} ${k.name} <small>${k.min}%+</small></span>`).join('')}</div>`;
}

// ───────── Exam-ready forecast
const hm = m => m >= 90 ? `${(m / 60).toFixed(1)} h` : `${Math.round(m)} min`;
function forecastLine() {
  const f = forecast(); const [dot, name] = STATUS[f.status];
  if (!f.ready) return `<button class="fcline" data-go="learn">🔮 <b>Exam-ready forecast:</b> finish a lesson or tick a study-guide section to start it ▸</button>`;
  return `<button class="fcline ${f.status}" data-go="learn">🔮 ${dot} <b>${name}</b> · ready ~${fmtDate(f.ready)} · ${f.spare >= 0 ? f.spare + ' days spare' : -f.spare + ' days short'}${f.early ? ' · early estimate' : ''} ▸</button>`;
}
function fcChart(f) {
  const W = 340, H = 120, P = 22;
  const t0 = f.series.length ? f.series[0].d : Date.now();
  const t1 = Math.max(f.exam.getTime(), f.ready ? f.ready.getTime() : 0, f.revStart.getTime()) + 3 * 86400000;
  const X = t => P + (t - t0) / (t1 - t0) * (W - P - 6), Y = p => H - 18 - p * (H - 30);
  const you = f.series.map(x => `${X(x.d).toFixed(1)},${Y(x.p).toFixed(1)}`).join(' ');
  const last = f.series[f.series.length - 1] || { d: Date.now(), p: 0 };
  const learnEnd = f.learnDays != null ? last.d + f.learnDays * 86400000 : null;
  const v = (t, c, label) => `<line x1="${X(t)}" x2="${X(t)}" y1="8" y2="${H - 18}" stroke="${c}" stroke-width="1.5"/><text x="${X(t)}" y="${H - 4}" fill="${c}" font-size="9" text-anchor="middle">${label}</text>`;
  return `<svg class="fcchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Progress chart">
    <text x="2" y="${Y(1) + 3}" font-size="8" fill="#9a93b8">100%</text><text x="10" y="${Y(0) + 3}" font-size="8" fill="#9a93b8">0</text>
    <line x1="${P}" x2="${W - 6}" y1="${Y(0)}" y2="${Y(0)}" stroke="#ffffff22"/><line x1="${P}" x2="${W - 6}" y1="${Y(1)}" y2="${Y(1)}" stroke="#ffffff14"/>
    <line x1="${X(f.planStart.getTime())}" y1="${Y(0)}" x2="${X(f.revStart.getTime())}" y2="${Y(1)}" stroke="#b9a8ff" stroke-dasharray="5 4" stroke-width="1.5"/>
    ${learnEnd ? `<line x1="${X(last.d)}" y1="${Y(last.p)}" x2="${X(Math.min(learnEnd, t1))}" y2="${Y(learnEnd <= t1 ? 1 : last.p + (1 - last.p) * (t1 - last.d) / (learnEnd - last.d))}" stroke="#3fff8b" stroke-dasharray="2 3" stroke-width="2.5"/>` : ''}
    <polyline points="${you}" fill="none" stroke="#3fff8b" stroke-width="3" stroke-linejoin="round"/>
    ${v(f.exam.getTime(), '#ff3f7a', 'Exam')}${f.ready && f.ready.getTime() <= t1 ? v(f.ready.getTime(), f.status === 'behind' ? '#ff3f7a' : '#ffd23f', 'Ready') : ''}
  </svg><div class="fclegend"><span class="l1">━ You so far</span><span class="l2">┅ Your pace</span><span class="l3">╌ The plan</span></div>`;
}
function forecastPanel() {
  const f = forecast(); const [dot, name] = STATUS[f.status];
  const pct = f.avg != null ? Math.round(f.avg * 100) : null;
  if (!f.ready) return `<section class="panel forecast"><h2>🔮 Exam-ready forecast</h2><p>Finish your first lesson (or tick a study-guide section you've read) and I'll forecast the date you'll be exam-ready, compared with your exam on <b>${fmtDate(f.exam)}</b>.</p></section>`;
  const tips = [];
  tips.push(`To finish lessons + study-guide reading before revision starts on <b>${fmtDate(f.revStart)}</b>, aim for <b>${Math.ceil(f.needPerDay)} min/day</b>. You're averaging <b>${Math.round(f.speed)} min/day</b>.`);
  if (pct != null) tips.push(pct < 80 ? `Your lesson-check average is <b>${pct}%</b>. Getting it to 80%+ (re-read slides, use 🎬 Fix-it) removes the extra redo time.` : `Lesson checks average <b>${pct}%</b>. Great understanding, no redo time needed.`);
  if (f.low.length) tips.push(`Redo these lessons (under 60% on the check): ${f.low.map(L => `<button class="chipbtn" data-lesson="${L.id}">${esc(L.title)}</button>`).join(' ')}`);
  if (f.lastMock != null && f.lastMock < 75) tips.push(`Your latest mock exam was <b>${f.lastMock}%</b>, so I've added 30% more revision time. Aim for 75%+.`);
  if (f.status !== 'ontrack') tips.push(`Options: study a bit more each day, or move your exam date. At this pace, the earliest date with a week spare is <b>${fmtDate(f.earliestExam)}</b>.`);
  if (f.trend != null) tips.push(f.trend > 0 ? `📈 You're speeding up: your ready date is <b>${f.trend} days earlier</b> than a week ago.` : f.trend < 0 ? `📉 Your ready date has slipped <b>${-f.trend} days</b> since a week ago. A short study session today helps!` : 'Your ready date is the same as a week ago. Steady!');
  return `<section class="panel forecast ${f.status}"><h2>🔮 Exam-ready forecast</h2>
    <div class="fcstatus"><span class="fcbadge ${f.status}">${dot} ${name}</span>${f.early ? '<span class="fcbadge early">early estimate</span>' : ''}</div>
    <div class="fcnums"><div><b>${fmtDate(f.ready)}</b><span>you'd be ready</span><em class="${f.spare >= 0 ? 'ok' : 'no'}">${f.spare >= 0 ? '+' + f.spare : f.spare}</em><span>days ${f.spare >= 0 ? 'spare' : 'short'}</span></div>
      <div><b>${fmtDate(f.exam)}</b><span>exam date</span><em>${pct != null ? pct + '%' : '–'}</em><span>lesson checks</span></div></div>
    ${fcChart(f)}
    <ul class="fctips">${tips.map(t => `<li>${t}</li>`).join('')}</ul>
    <details class="fcmath"><summary>How this is worked out</summary><table class="t">
      <tr><td>Your learning speed</td><td>${Math.round(f.speed)} min/day <i>(lessons + guide reading, last ${f.win} day${f.win > 1 ? 's' : ''}, rest days count)</i></td></tr>
      <tr><td>Your total study effort</td><td>~${Math.round(f.effort)} min/day <i>(+ ~1 min per practice question)</i></td></tr>
      <tr><td>Lessons left</td><td>${f.lessonsLeft} of ${f.lessonsTotal} · ${hm(f.lessonMinsLeft)}</td></tr>
      <tr><td>Study-guide reading left</td><td>${hm(f.readLeft)} of ${hm(f.readTotal)} <i>(study-map hours)</i></td></tr>
      <tr><td>Redo time</td><td>${hm(f.redoMins)} <i>(lessons under 60%${pct != null && pct < 80 ? ' + check average below 80%' : ''})</i></td></tr>
      <tr><td>Days to finish learning</td><td>${hm(f.learnLeft)} ÷ ${Math.round(f.speed)} min/day = ${f.learnDays}</td></tr>
      <tr><td>Revision needed</td><td>${f.revisionH.toFixed(1)} h → ${f.revDays} days at your effort</td></tr>
      <tr><td><b>Ready date</b></td><td><b>today + ${f.learnDays} + ${f.revDays} = ${fmtDate(f.ready)}</b></td></tr></table>
      <p class="muted small">The early estimate firms up after about 3 study days. Lessons cover the key ideas (~13 h); the study-map hours (~120 h) assume you also read the study guide, so tick sections below as you read them.</p></details></section>`;
}

// ───────── Study-guide reading checklist
function readingRows(mod) {
  return readingSections(mod).map(sec => { const k = sectionKey(mod, sec.n), done = store.sectionRead(k);
    return `<button class="lrow readrow ${done ? 'done' : ''}" data-read="${k}"><span class="lck">${done ? '✅' : '⬜'}</span><span class="lt"><b>${sec.n}. ${esc(sec.title)}</b><i>~${hm(sec.mins)}${done ? ' · read ' + new Date(S().reading[k]).toLocaleDateString() : ''}</i></span></button>`; }).join('');
}
function readingPanel() {
  const tot = READING.reduce((a, m) => a + m.sections.length, 0), done = Object.keys(S().reading || {}).length;
  return `<h3 class="sec">📖 Study-guide reading <span class="muted small">${done}/${tot} sections</span></h3>
  ${MODULES.map(m => { const n = readingSections(m.id).filter(sec => store.sectionRead(sectionKey(m.id, sec.n))).length;
    return `<details class="course" style="--mc:${m.color}"><summary><b>${m.short} · ${m.name}</b><span>${n}/${readingSections(m.id).length}</span></summary><p class="muted small">Tick each section of the study guide once you've read it (and done its questions). It feeds your forecast.</p><div class="lrows">${readingRows(m.id)}</div></details>`; }).join('')}`;
}
function nextReading() {
  const plan = buildPlan(S().settings.examDate, new Date(S().settings.planStart)).plan;
  const now = new Date(); const cur = plan.find(p => p.mod && now >= p.start && now <= new Date(p.end.getTime() + 86399000));
  const order = cur ? [cur.mod, ...MODULES.map(m => m.id).filter(id => id !== cur.mod)] : MODULES.map(m => m.id);
  for (const mod of order) { const sec = readingSections(mod).find(x => !store.sectionRead(sectionKey(mod, x.n))); if (sec) return { mod, sec }; }
  return null;
}

// ───────── Book practice: every study-guide question
function bookCard(always) {
  const nx = nextBookSet(); const total = bookCount(); const done = Object.keys(S().book || {}).length;
  if (!nx && !always) return '';
  return `<section class="fixcard bookcard"><div class="mtag">📕 BOOK PRACTICE · ${total} STUDY-GUIDE QUESTIONS</div>
    ${nx ? `<h3>Next up: ${KIND[nx.kind].icon} M${nx.mod} · ${esc(nx.title)}</h3><p class="muted">${nx.qs.length} questions · you've done the lessons for it</p>` : `<p>Every question from the study guide, set by set. ${done} sets done.</p>`}
    <div class="row">${nx ? `<button class="btn" data-book="${nx.id}">▶ Start</button>` : ''}<button class="btn ghost" data-go="book">All book questions</button></div></section>`;
}
function viewBook(openMod) {
  const s = S(); const total = bookCount(); const sets = Object.values(s.book || {});
  const right = sets.reduce((a, r) => a + r.best, 0);
  return `<section class="panel fixhead"><h2>📕 Book practice</h2>
    <p>All <b>${total}</b> questions from the study guide (reworded), in book order. 🌱 <b>Before you begin</b> = warm-up. ❓ <b>In-module questions</b> and ⚡ <b>Quick revision</b> unlock once you've done the lessons they use. 🏁 <b>Revision questions</b> = end-of-module exam practice. Mistakes go to 🎬 Fix-it, and book questions also appear in your games, lesson checks and the mock exam.</p>
    <div class="stats"><div><b>${sets.length}</b><span>sets tried</span></div><div><b>${right}</b><span>best correct</span></div><div><b>${total}</b><span>questions</span></div><div><b>${s.lessons ? Object.keys(s.lessons).length : 0}</b><span>lessons done</span></div></div>
    <div class="row"><button class="btn" data-bookrand="0">🎲 Random 10 (all modules)</button></div></section>
  ${MODULES.map(m => { const ms = m.id; return `<details class="course" ${+openMod === ms ? 'open' : ''} style="--mc:${m.color}"><summary><b>${m.short} · ${m.name}</b><span>${Object.keys(s.book || {}).filter(id => id.startsWith('b' + ms + '-')).length} sets done</span></summary>
    <div class="lrows">${bookRows(ms)}</div><button class="btn ghost small" data-bookrand="${ms}">🎲 Random 10 from ${m.short}</button></details>`; }).join('')}`;
}

// ───────── Fix-it: mistake memory → reels → re-test
function fixCard() {
  const t = store.weakTopics(); if (!t.length) return '';
  const n = t.reduce((a, x) => a + x.items.length, 0);
  return `<section class="fixcard"><div class="mtag">🎬 FIX-IT REELS · ${n} WEAK SPOT${n > 1 ? 'S' : ''}</div>
    <h3>You keep missing these:</h3><ul>${t.slice(0, 3).map(x => `<li><b>${esc(lessonById(x.lesson).title)}</b> <i>×${x.wrong}</i></li>`).join('')}</ul>
    <div class="row"><button class="btn" data-reels>▶ Watch & re-test</button><button class="btn ghost" data-go="fix">My mistake memory</button></div></section>`;
}
function viewFix() {
  const s = S(), topics = store.weakTopics(), all = Object.values(s.mistakes || {});
  const fixed = all.filter(m => store.mistakeStatus(m) === 'fixed').sort((a, b) => b.fixedAt - a.fixedAt);
  const chip = m => ({ shaky: '<span class="mchip shaky">😬 shaky</span>', improving: '<span class="mchip imp">💪 right once · again on another day</span>', fixed: '<span class="mchip ok">✅ fixed</span>' })[store.mistakeStatus(m)];
  const ago = t => { const d = Math.floor((Date.now() - t) / 86400000); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago'; };
  const last = (s.retests || [])[0];
  return `<section class="panel fixhead"><h2>🎬 Fix-it: your mistake memory</h2>
    <p>Every question you get wrong is remembered here. Watch the <b>Fix-it Reels</b> (short videos made from the lesson that teaches it), then take a <b>re-test</b>. A mistake counts as fixed once you get it right <b>${store.FIXED_AFTER} times in a row, on different days</b> (so it really sticks).</p>
    <div class="stats"><div><b>${topics.reduce((a, t) => a + t.items.length, 0)}</b><span>to fix</span></div><div><b>${topics.length}</b><span>topics</span></div><div><b>${fixed.length}</b><span>fixed</span></div><div><b>${last ? last.score + '/' + last.total : '–'}</b><span>last re-test</span></div></div>
    ${topics.length ? `<div class="row"><button class="btn big" data-reels>▶ Watch my reels</button><button class="btn ghost" id="rtonly">🎯 Re-test only</button></div>` : '<p class="muted">Nothing to fix yet. Play games or lessons and your mistakes will show up here. 🌟</p>'}</section>
  ${topics.map(t => { const L = lessonById(t.lesson), m = MODULES.find(x => x.id === L.mod) || { color: '#ffd23f', short: '' };
    return `<details class="course fixtopic" style="--mc:${m.color}"><summary><b>${m.short} · ${esc(L.title)}</b><span>${t.items.length} to fix</span></summary>
      ${t.items.map(it => `<div class="mrow"><div>${chip(it)} <i>missed ×${it.wrong} · last ${ago(it.last)}</i></div><b>${esc(it.q)}</b><div class="ok">✔ ${esc(it.ans)}</div>${it.picked ? `<div class="no">✘ you said: ${esc(it.picked)}</div>` : ''}</div>`).join('')}
      <div class="row"><button class="btn small" data-reels="${t.lesson}">🎬 Reels for this</button><button class="btn ghost small" data-lesson="${t.lesson}">📖 Full lesson</button></div></details>`; }).join('')}
  ${fixed.length ? `<h3 class="sec">✅ Recently fixed</h3><div class="panel">${fixed.slice(0, 12).map(m => `<div class="mrow"><div>${chip(m)} <i>${esc((lessonById(m.lesson) || {}).title || '')}</i></div><b>${esc(m.q)}</b></div>`).join('')}</div>` : ''}
  ${(s.retests || []).length ? `<h3 class="sec">🎯 Re-test history</h3><div class="panel">${s.retests.slice(0, 8).map(r => `<div class="mrow"><b>${r.score}/${r.total}</b> <i>${new Date(r.at).toLocaleDateString()} · ${r.lessons.map(id => esc((lessonById(id) || {}).title || id)).join(', ')}</i></div>`).join('')}</div>` : ''}`;
}

function viewLearn() {
  const s = S(); const { items, plan } = lessonSchedule(s.settings.examDate, s.settings.planStart);
  const now = new Date(); const total = LESSONS.length, done = LESSONS.filter(l => store.lessonDone(l.id)).length;
  const todayIso = iso(new Date());
  const course = [{ id: 0, short: 'Start', name: 'Start here', color: '#ffd23f' }, ...MODULES].map(m => {
    const ls = LESSONS.filter(l => l.mod === m.id); const d = ls.filter(l => store.lessonDone(l.id)).length;
    return `<details class="course" ${ls.some(l => !store.lessonDone(l.id)) && d > 0 ? 'open' : ''} style="--mc:${m.color}"><summary><b>${m.short}${m.id ? ' · ' + m.name : ''}</b><span>${d}/${ls.length}</span></summary>
      <div class="lrows">${ls.map(L => { const it = items.find(x => x.id === L.id); const dn = store.lessonDone(L.id); const late = !dn && it && it.date < todayIso;
        return `<button class="lrow ${dn ? 'done' : ''} ${late ? 'late' : ''}" data-lesson="${L.id}" style="--mc:${m.color}"><span class="lck">${dn ? '✅' : late ? '⏰' : '📖'}</span><span class="lt"><b>${esc(L.title)}</b><i>${it ? 'Day ' + it.day + ' · ' + new Date(it.date).toLocaleDateString() : ''} · ~${L.mins} min</i></span><span class="lgo">▶</span></button>`; }).join('')}</div></details>`;
  }).join('');
  return `${todayClass(false)}${forecastPanel()}${fixCard()}${bookCard(true)}
  <section class="panel"><h2>📈 Course progress</h2><div class="bar me" style="height:12px"><i style="width:${Math.round(done / total * 100)}%"></i></div><p class="muted">${done} of ${total} lessons done. Each lesson is 5–14 minutes: slides, tap-to-reveal examples, 🔊 read-aloud and a 5-question check (with fresh calculations).</p></section>
  <h3 class="sec">All lessons</h3>${course}
  ${readingPanel()}
  <section class="panel"><h2>📅 Exam date & plan</h2><label class="row">Exam on <input type="date" id="exd" value="${s.settings.examDate}"></label>
    <p class="muted">Plan started ${new Date(s.settings.planStart).toLocaleDateString()}. Changing the exam date respreads the remaining lessons.</p>
    <button class="btn ghost small" id="replan">↻ Restart my plan from today</button></section>
  <div class="plan">${plan.map(p => {
    const m = MODULES.find(x => x.id === p.mod); const active = now >= p.start && now <= new Date(p.end.getTime() + 86399000);
    return `<div class="pl ${active ? 'on' : ''}" style="--mc:${m ? m.color : '#ff3f7a'}"><b>${m ? m.short + ' ' + m.name : '🔁 Revision + mock exams'}</b>
      <span>${p.start.toLocaleDateString()} → ${p.end.toLocaleDateString()} · ${p.days} days · ~${p.hoursPerDay} h/day</span>
      ${m ? `<em>Lessons ${lessonsForModule(m.id).filter(l => store.lessonDone(l.id)).length}/${lessonsForModule(m.id).length} · mastery ${pct(store.moduleMastery(m.id))}%</em>` : '<em>Final Boss mock exam daily</em>'}</div>`; }).join('')}</div>
  <section class="panel tips"><h3>Your daily routine</h3><ol>
    <li>📖 Do today's lessons first (they're short!). Tap 🔊 if you'd like them read to you.</li><li>🎮 Play that module's game 2–3 times to practise.</li>
    <li>🪂 Finish the week with an Audit Royale or Ledger Tanks mixed match.</li><li>🐉 In the revision block: one Final Boss mock exam a day.</li></ol></section>`;
}

function viewSettings() {
  const s = S();
  return `<section class="panel"><h2>⚙️ Settings</h2>
    <label class="row">Player name <input id="pn" value="${esc(s.profile.name)}" maxlength="18"></label>
    <label class="row">Bot name <input id="bn" value="${esc(s.settings.botName)}" maxlength="14"></label>
    <label class="row">Bot learning speed <select id="bl">${Object.entries(store.BOT_LEVELS).map(([k, v]) => `<option value="${k}" ${s.settings.botLevel === k ? 'selected' : ''}>${v.label}</option>`).join('')}</select></label>
    <label class="row tog">Sound effects <input type="checkbox" id="snd" ${s.settings.sound ? 'checked' : ''}></label>
    <label class="row tog">Music <input type="checkbox" id="mus" ${s.settings.music ? 'checked' : ''}></label>
    <label class="row tog">Vibration (Android) <input type="checkbox" id="hap" ${s.settings.haptics ? 'checked' : ''}></label>
    <label class="row tog">Games only ask about finished lessons <input type="checkbox" id="lockl" ${s.settings.lockLessons !== false ? 'checked' : ''}></label>
    <p class="muted small">iPhone: if there's no sound, flip off silent mode (the switch on the side).</p></section>
  <section class="panel"><h2>📲 Install on your phone / laptop</h2>
    <p><b>iPhone:</b> open this page in <b>Safari</b> → Share button → <b>Add to Home Screen</b>. It then opens full-screen and works offline.</p>
    <p><b>Laptop (Chrome/Edge):</b> click the install icon in the address bar, or just bookmark it. Keyboard: arrows/WASD, mouse to aim, Space to fire.</p></section>
  <section class="panel"><h2>💾 Move progress between devices</h2><p class="muted small">Progress is saved on each device. Copy this code on one device and paste it on the other.</p>
    <div class="row"><button class="btn" id="exp">Copy my save code</button><button class="btn ghost" id="imp">Paste a save code</button></div>
    <textarea id="code" rows="3" placeholder="Save code appears / paste here"></textarea></section>
  <section class="panel danger"><button class="btn ghost" id="rst">Reset all progress</button></section>
  <section class="panel credits"><h2>🙏 Credits (open source)</h2><ul class="muted small">
    <li>Lily is built from <b>ToonHead</b> by Johan Melin (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>), rendered with <a href="https://www.dicebear.com" target="_blank" rel="noopener">DiceBear</a> (MIT).</li>
    <li>Animated illustrations: <b>Noto Animated Emoji</b> by Google (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>), played with <b>lottie-web</b> (MIT).</li>
    <li>Online play: <b>PeerJS</b> (MIT).</li></ul></section>
  <p class="muted small center">Content written from the CPA Australia Management Accounting learning objectives (7th edn study guide, errata applied). Not affiliated with CPA Australia.</p>`;
}

function viewLobby(code) {
  const st = net.status();
  return `<section class="panel lobby"><h2>👥 Play with a friend</h2>
    <p>Two players, two devices (phone or laptop), anywhere. One person hosts and sends the invite link.</p>
    <div class="row"><button class="btn big" id="host">Host a game</button></div>
    <div class="row"><input id="jc" placeholder="Friend's code (e.g. K7Q2XM)" value="${esc(code || '')}" maxlength="8"><button class="btn" id="join">Join</button></div>
    <div id="lobbystate" class="lobbystate">${st.connected ? '✅ Connected to ' + esc(st.peerName || 'friend') : st.code ? `Waiting for friend… code <b>${st.code}</b>` : ''}</div>
    <div id="modepick" class="${st.connected && st.isHost ? '' : 'hidden'}"><h3>Choose a mode</h3>
      <button class="btn" data-mp="tanks">💣 Ledger Tanks duel (head to head)</button>
      <button class="btn" data-mp="royale">🪂 Audit Royale duo (team up vs 20 bots)</button></div>
    <p class="muted small">No friend online? Ledger Tanks also has <b>same-device 2 player</b> (pass the phone) — choose it in the Tanks menu.</p></section>`;
}

// ───────── events
function bind(root) {
  root.querySelectorAll('[data-play]').forEach(b => b.onclick = () => app.play(b.dataset.play));
  root.querySelectorAll('[data-read]').forEach(b => b.onclick = () => { const on = store.toggleSection(b.dataset.read); sfx(on ? 'coin' : 'click'); root.querySelectorAll(`[data-read="${b.dataset.read}"]`).forEach(x => { x.classList.toggle('done', on); x.querySelector('.lck').textContent = on ? '✅' : '⬜'; }); const fc = root.querySelector('.forecast'); if (fc) fc.outerHTML = forecastPanel(); });
  root.querySelectorAll('[data-book]').forEach(b => b.onclick = e => { e.stopPropagation(); app.book({ set: b.dataset.book }); });
  root.querySelectorAll('[data-bookrand]').forEach(b => b.onclick = e => { e.preventDefault(); e.stopPropagation(); app.book({ mod: +b.dataset.bookrand || undefined, random: 10 }); });
  root.querySelectorAll('[data-reels]').forEach(b => b.onclick = () => app.reels(b.dataset.reels ? { lessons: [b.dataset.reels] } : {}));
  if (root.querySelector('#rtonly')) root.querySelector('#rtonly').onclick = () => { unlock(); retest(app, store.weakTopics().slice(0, 3)); };
  root.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { sfx('click'); app.go(b.dataset.go); });
  root.querySelectorAll('[data-mod]').forEach(b => b.onclick = () => { sfx('click'); app.go('module', b.dataset.mod); });
  root.querySelectorAll('[data-royale]').forEach(b => b.onclick = () => app.play('royale', { mods: [+b.dataset.royale] }));
  root.querySelectorAll('[data-tanks]').forEach(b => b.onclick = () => app.play('tanks', { mods: [+b.dataset.tanks] }));
  const $ = id => root.querySelector('#' + id);
  if ($('exd')) $('exd').onchange = e => { S().settings.examDate = e.target.value; store.save(); app.go('learn'); };
  if ($('replan')) $('replan').onclick = () => { if (confirm('Restart the lesson schedule from today? (Finished lessons stay finished.)')) { S().settings.planStart = iso(new Date()); store.save(); app.go('learn'); } };
  root.querySelectorAll('[data-lesson]').forEach(b => b.onclick = () => app.lesson(b.dataset.lesson));
  if ($('pn')) {
    $('pn').onchange = e => { S().profile.name = e.target.value.trim() || S().profile.name; store.save(); };
    $('bn').onchange = e => { S().settings.botName = e.target.value.trim() || 'Ghost'; store.save(); };
    $('bl').onchange = e => { S().settings.botLevel = e.target.value; store.save(); };
    $('snd').onchange = e => { S().settings.sound = e.target.checked; store.save(); };
    $('mus').onchange = e => { S().settings.music = e.target.checked; store.save(); refreshMusic(); if (e.target.checked) music('calm'); };
    $('hap').onchange = e => { S().settings.haptics = e.target.checked; store.save(); };
    $('lockl').onchange = e => { S().settings.lockLessons = e.target.checked; store.save(); };
    $('exp').onclick = async () => { const c = store.exportCode(); $('code').value = c; try { await navigator.clipboard.writeText(c); $('exp').textContent = 'Copied ✔'; } catch (e) { $('code').select(); } };
    $('imp').onclick = () => { try { store.importCode($('code').value); alert('Progress imported!'); app.go('map'); } catch (e) { alert('That code did not work: ' + e.message); } };
    $('rst').onclick = () => { if (confirm('Erase ALL progress on this device?')) { store.reset(); app.go('map'); } };
  }
  if ($('host')) {
    const ls = $('lobbystate');
    const showConnected = () => { ls.innerHTML = '✅ Connected to <b>' + esc(net.status().peerName || 'friend') + '</b>'; if (net.status().isHost) $('modepick').classList.remove('hidden'); else ls.innerHTML += '<br>Waiting for host to pick a mode…'; sfx('power'); };
    net.onConnected = showConnected;
    net.onStart = (mode, opts) => app.play(mode, { ...opts, online: true });
    net.onError = msg => { ls.innerHTML = '⚠️ ' + esc(msg); };
    $('host').onclick = async () => {
      unlock(); ls.textContent = 'Creating room…';
      try {
        const code = await net.host();
        const link = location.origin + location.pathname + '#join=' + code;
        ls.innerHTML = `Room code <b class="bigcode">${code}</b><br><input readonly value="${link}" class="linkbox"><br>
          <button class="btn" id="share">📤 Share invite link</button><br><span class="muted">Waiting for your friend to open the link…</span>`;
        root.querySelector('#share').onclick = async () => { try { if (navigator.share) await navigator.share({ title: 'Cost Commando', text: `Join my Cost Commando game! Code ${code}`, url: link }); else { await navigator.clipboard.writeText(link); root.querySelector('#share').textContent = 'Link copied ✔'; } } catch (e) { /* cancelled */ } };
      } catch (e) { ls.textContent = '⚠️ ' + e.message; }
    };
    $('join').onclick = async () => {
      unlock(); const c = $('jc').value.trim().toUpperCase(); if (!c) return;
      ls.textContent = 'Connecting…';
      try { await net.join(c); showConnected(); } catch (e) { ls.textContent = '⚠️ ' + e.message; }
    };
    root.querySelectorAll('[data-mp]').forEach(b => b.onclick = () => { const mode = b.dataset.mp; net.startGame(mode, {}); app.play(mode, { online: true, host: true }); });
    if (net.status().connected) showConnected();
    else if ($('jc').value) setTimeout(() => $('join').click(), 300); // opened from an invite link → join automatically
  }
}

function pendingJoin() { const m = location.hash.match(/join=([A-Z0-9]+)/i); return m ? m[1].toUpperCase() : null; }

// ───────── boot
function boot() {
  app.el = document.getElementById('app');
  const tabs = document.createElement('nav'); tabs.className = 'tabbar';
  tabs.innerHTML = [['map', '🗺', 'Map'], ['arcade', '🎮', 'Play'], ['ranks', '🏆', 'Ranks'], ['learn', '📚', 'Learn'], ['fix', '🎬', 'Fix'], ['settings', '⚙️', 'More']]
    .map(([s, i, l]) => `<button data-s="${s}"><span>${i}</span>${l}</button>`).join('');
  document.body.appendChild(tabs);
  tabs.onclick = e => { const b = e.target.closest('button'); if (b) { unlock(); sfx('click'); app.go(b.dataset.s); } };
  document.addEventListener('pointerdown', unlock, { once: true });
  const j = pendingJoin();
  if (j) { app.go(S().profile.name ? 'lobby' : 'map', j); }
  else app.go('map');
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
