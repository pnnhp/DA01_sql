// App shell: navigation, world map, ranks, study plan, settings, multiplayer lobby.
import { MODULES, ALL_LOS, loName, buildPlan, CARDS } from './content/syllabus.js';
import * as store from './core/store.js';
import { unlock, sfx, music, refreshMusic } from './core/audio.js';
import { esc } from './core/engine.js';
import { net } from './core/net.js';
import { LESSONS, lessonById, lessonsForModule, dueLessons, lessonSchedule, iso } from './lessons/index.js';
import { playLesson } from './lessons/player.js';

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
  const views = { map: viewMap, arcade: viewArcade, ranks: viewRanks, plan: viewLearn, learn: viewLearn, settings: viewSettings, lobby: viewLobby, module: viewModule };
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
    <div class="lrows">${list}</div>${more}${empty}</section>`;
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
  return `${todayClass(true)}<section class="mission" style="--mc:${m.color}"><div class="mtag">🎮 THEN PLAY</div>
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
  return `<section class="readiness"><div>${ring(r / 100, '#3fff8b', 110, r + '%')}<b>You</b></div><div class="vs">VS</div><div>${ring(br / 100, '#b04bff', 110, br + '%')}<b>🤖 ${esc(S().settings.botName)}</b></div></section>
  <p class="center muted">Exam readiness = mastery × exam weighting. Predicted exam score ≈ <b>${store.predictedScore()}%</b>. ${r >= br ? 'You are ahead of your bot — keep the gap!' : 'Your bot is ahead — it studies at a typical pace, so beat it!'}</p>
  <h3 class="sec">Leaderboard</h3><div class="lb">${lb.map((p, i) => `<div class="lbrow ${p.me ? 'me' : ''} ${p.bot ? 'bot' : ''}"><span class="pos">${i + 1}</span><span class="nm">${esc(p.name)}${p.me ? ' (you)' : ''}</span><span class="rk">${p.rank}</span><b>${p.readiness}%</b></div>`).join('')}</div>
  <p class="muted small">Friends appear here after you play together (scores sync over the connection).</p>
  <h3 class="sec">Module mastery</h3><div class="modbars">${MODULES.map(m => `<div class="mb"><span>${m.short}</span><div class="bars"><div class="bar me" style="--c:${m.color}"><i style="width:${pct(store.moduleMastery(m.id))}%"></i></div><div class="bar bot"><i style="width:${pct(store.moduleMastery(m.id, 'bot'))}%"></i></div></div><em>${pct(store.moduleMastery(m.id))}%</em></div>`).join('')}</div><p class="muted small">Coloured bar = you · purple bar = 🤖 bot.</p>
  <h3 class="sec">Weakest topics → practise next</h3><div class="weak">${store.weakestLOs(6).map(lo => `<button class="chip" data-mod="${lo.split('.')[0]}">${lo} ${esc(loName(lo))} · ${pct(store.loMastery(lo))}%</button>`).join('')}</div>
  <h3 class="sec">Activity (last 8 weeks)</h3><div class="heat">${cells.join('')}</div>
  <h3 class="sec">Ranks</h3><div class="ranks">${store.RANKS.map(k => `<span class="${r >= k.min ? 'got' : ''}">${k.icon} ${k.name} <small>${k.min}%+</small></span>`).join('')}</div>`;
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
  return `${todayClass(false)}
  <section class="panel"><h2>📈 Course progress</h2><div class="bar me" style="height:12px"><i style="width:${Math.round(done / total * 100)}%"></i></div><p class="muted">${done} of ${total} lessons done. Each lesson is 5–14 minutes: slides, tap-to-reveal examples, 🔊 read-aloud and a 5-question check (with fresh calculations).</p></section>
  <h3 class="sec">All lessons</h3>${course}
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
  tabs.innerHTML = [['map', '🗺', 'Map'], ['arcade', '🎮', 'Play'], ['ranks', '🏆', 'Ranks'], ['learn', '📚', 'Learn'], ['settings', '⚙️', 'More']]
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
