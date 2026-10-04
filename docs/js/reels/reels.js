// Fix-it Reels: a TikTok-style vertical feed where Lily (the cartoon narrator) talks you through
// the questions you keep missing, using the lesson behind each one, with animated illustrations.
// Then a short re-test checks whether the mistake is fixed.
import * as store from '../core/store.js';
import { sfx, unlock } from '../core/audio.js';
import { esc, LETTERS } from '../core/engine.js';
import { retestFor } from '../core/questions.js';
import { lessonById } from '../lessons/index.js';
import { MODULES } from '../content/syllabus.js';
import { speak, speakable, hush } from '../core/speech.js';
import { createLily } from './lily.js';
import { pickEmoji, emojiHTML, playEmoji, stopEmoji } from './emoji.js';

const MAX_TOPICS = 3;
const STOP = new Set('which what when where that this with from have their there about would should could does into than then them they your more most only also over such each because these those being after before under other same very much many will been were make made used uses using'.split(' '));
const words = s => (String(s).toLowerCase().replace(/<[^>]+>/g, ' ').match(/[a-z][a-z\-]{3,}/g) || []).filter(w => !STOP.has(w));
const plain = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); };
const modOf = L => MODULES.find(m => m.id === L.mod) || { color: '#ffd23f', short: 'Start', name: 'Start' };
const tag = L => '#' + (L.title.split(/[^A-Za-z]+/).filter(w => w.length > 3)[0] || 'cpa').toLowerCase();
// keep Lily's lines short and chatty: first sentence or two, max ~200 chars
const short = (t, max = 200) => { t = t.replace(/\s+/g, ' ').trim(); if (t.length <= max) return t; const cut = t.slice(0, max); const k = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? ')); return (k > 60 ? cut.slice(0, k + 1) : cut.replace(/\s+\S*$/, '') + '…'); };
const sentences = t => (t.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+["')]*|[^.!?]+$/g) || [t]).map(x => x.trim()).filter(Boolean);
const pick = a => a[Math.floor(Math.random() * a.length)];

// Which topics to cover: the requested lessons (or your worst topics), each with the mistakes you made there.
function pickTopics(lessons) {
  const all = store.weakTopics();
  let topics = lessons && lessons.length ? all.filter(t => lessons.includes(t.lesson)) : all;
  if (lessons && lessons.length) for (const id of lessons) if (!topics.some(t => t.lesson === id) && lessonById(id)) {
    const items = Object.values(store.state().mistakes).filter(m => m.lesson === id);
    topics.push({ lesson: id, items, score: 0, wrong: items.reduce((a, m) => a + m.wrong, 0) });
  }
  return topics.filter(t => lessonById(t.lesson)).slice(0, MAX_TOPICS);
}

// The lesson slides that best explain these mistakes (keyword overlap), kept in lesson order.
function bestSlides(L, items, n = 3) {
  const want = new Set(items.flatMap(m => words(`${m.q} ${m.ans} ${m.ex}`)));
  const scored = L.slides.map((s, i) => ({ s, i, score: words(s.h + ' ' + s.b).filter(w => want.has(w)).length }));
  let top = scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, n);
  if (top.length < 2) top = scored.slice(0, Math.min(n, scored.length));
  return top.sort((a, b) => a.i - b.i).map(x => x.s);
}


// ── Scripts: each reel = a board (blocks revealed step by step) + Lily's lines.
// line: { t: what Lily says, mood, g: gesture, show: board step to reveal when the line starts }
function teachReel(base, s) {
  const d = document.createElement('div'); d.innerHTML = s.b;
  const pic = [...d.querySelectorAll('.pic')].map(p => { const t = p.textContent; p.remove(); return t; }).join(' ');
  const blocks = [];
  for (const el of [...d.children]) {
    if (el.matches('ul, ol')) { const tagN = el.tagName.toLowerCase(); for (const li of el.children) blocks.push({ html: `<${tagN} class="bl-list"><li>${li.innerHTML}</li></${tagN}>`, text: li.textContent }); }
    else if (el.matches('table')) { const rows = [...el.querySelectorAll('tr')]; const head = rows[0]; blocks.push({ html: `<table class="t">${head.outerHTML}</table>`, text: '' }); rows.slice(1).forEach(r => blocks.push({ html: `<table class="t">${r.outerHTML}</table>`, text: [...r.children].map(c => c.textContent).join(', ') })); }
    else if (el.querySelector('ol.reveal')) { // worked example: intro first, then each step as Lily explains it
      const ol = el.querySelector('ol.reveal'), steps = [...ol.children]; ol.remove();
      const cls = el.className || 'eg';
      if (el.textContent.trim()) blocks.push({ html: `<div class="${cls}">${el.innerHTML}</div>`, text: el.textContent });
      steps.forEach((li, k) => blocks.push({ html: `<div class="${cls} egstep"><b>Step ${k + 1}</b> ${li.innerHTML}</div>`, text: `Step ${k + 1}. ${li.textContent}` }));
    }
    else blocks.push({ html: el.outerHTML, text: el.textContent, say: el.classList.contains('say'), trap: el.classList.contains('trap') });
  }
  if (!blocks.length && d.textContent.trim()) blocks.push({ html: `<p>${d.innerHTML}</p>`, text: d.textContent });
  const lines = [{ t: pick(['Okay, look at this!', 'Let me explain!', 'Here\'s the trick!', 'This part is important!']) + ' ' + plain(s.h) + '.', mood: 'happy', g: 'point' }];
  blocks.forEach((b, k) => {
    const txt = short(b.text || '', 210);
    lines.push({ t: txt || '', show: k, mood: b.trap ? 'surprised' : b.say ? 'wink' : (k % 3 === 2 ? 'think' : 'happy'), g: b.trap ? 'shake' : (k % 2 ? 'nod' : 'point'), quiet: !txt });
  });
  return { ...base, kind: 'teach', title: s.h, emoji: pickEmoji(plain(s.h + ' ' + s.b), 3, pic), blocks: blocks.map(b => b.html), lines };
}

function mistakeReel(base, it) {
  const blocks = [];
  if (it.intro) blocks.push(`<details class="scen"><summary>📄 Scenario</summary><div>${it.intro}</div></details>`);
  const qStep = blocks.push(`<div class="rq">${esc(it.q)}</div>`) - 1;
  const pStep = it.picked ? blocks.push(`<div class="rp">You picked: <s>${esc(it.picked)}</s> ❌</div>`) - 1 : -1;
  const aStep = blocks.push(`<div class="ra">✅ ${esc(it.ans)}</div>`) - 1;
  const xStep = it.ex ? blocks.push(`<div class="rx">💡 ${esc(it.ex)}</div>`) - 1 : -1;
  const lines = [
    { t: `Oops! You've missed this one ${it.wrong === 1 ? 'once' : it.wrong + ' times'}. No worries, let's fix it!`, mood: 'surprised', g: 'jump', show: it.intro ? 0 : undefined },
    { t: short(it.q, 220), show: qStep, mood: 'think', g: 'point' },
  ];
  if (pStep >= 0) lines.push({ t: `You picked "${short(it.picked, 90)}". That's a really common trap!`, show: pStep, mood: 'oops', g: 'shake' });
  lines.push({ t: `The right answer is: ${short(it.ans, 120)}!`, show: aStep, mood: 'proud', g: 'jump' });
  if (xStep >= 0) sentences(it.ex).slice(0, 3).forEach((x, k) => lines.push({ t: x, show: k ? undefined : xStep, mood: k % 2 ? 'wink' : 'happy', g: 'nod' }));
  lines.push({ t: pick(['Swipe up and I\'ll show you why!', 'Keep swiping, the lesson bit is next!', 'Now let\'s see where this comes from. Swipe up!']), mood: 'wink', g: 'point' });
  return { ...base, kind: 'mistake', title: `You missed this ×${it.wrong}`, emoji: pickEmoji(`${it.q} ${it.ans}`, 2, '😮'), blocks, lines };
}

function buildReels(topics) {
  const reels = [];
  const total = topics.reduce((a, t) => a + t.items.length, 0);
  const names = topics.map(t => lessonById(t.lesson).title);
  reels.push({ kind: 'intro', color: '#ff3f7a', title: 'Fix-it Reels with Lily', emoji: ['🍋', '👋', '✨'],
    blocks: [`<p class="big">${total ? `<b>${total}</b> thing${total > 1 ? 's' : ''} to fix` : 'Quick refresher'}</p>`, `<ul class="bl-list">${names.map(n => `<li>📌 ${esc(n)}</li>`).join('')}</ul>`, '<p>Watch, then a quick re-test. 👆 Swipe up!</p>'],
    lines: [
      { t: 'Hi! It\'s me, Lily! 👋', mood: 'proud', g: 'jump' },
      { t: total ? `I've noticed you keep tripping on ${total === 1 ? 'one thing' : total + ' things'}. That's totally okay, it happens to everyone!` : 'Let\'s do a quick refresher together!', mood: 'happy', g: 'nod', show: 0 },
      { t: `We'll look at: ${names.join(', ')}.`, mood: 'think', g: 'point', show: 1 },
      { t: 'Watch these short clips, then do a quick re-test to see if it sticks. Swipe up when you\'re ready!', mood: 'wink', g: 'point', show: 2 },
    ] });
  for (const t of topics) {
    const L = lessonById(t.lesson), m = modOf(L);
    const base = { color: m.color, mod: m.short, L };
    for (const it of [...t.items].sort((a, b) => b.wrong - a.wrong).slice(0, 2)) reels.push(mistakeReel(base, it));
    for (const s of bestSlides(L, t.items)) reels.push(teachReel(base, s));
  }
  reels.push({ kind: 'end', color: '#3fff8b', title: 'Did it stick?', emoji: ['🎯', '💪', '🏆'],
    blocks: ['<p class="big">Quick re-test on exactly what you missed. Calculations come back with new numbers!</p>'], cta: '<button class="btn big" data-retest>Start re-test ▶</button>',
    lines: [{ t: 'You did it! That\'s all the clips.', mood: 'proud', g: 'jump', show: 0 }, { t: 'Now let\'s see if it stuck. Tap start re-test. I believe in you!', mood: 'wink', g: 'point' }] });
  return reels;
}

export function playReels(app, opts = {}) {
  const topics = pickTopics(opts.lessons);
  const root = app.el;
  document.body.classList.add('ingame');
  if (!topics.length) {
    root.innerHTML = `<div class="reels-empty panel"><div class="pic">🌟</div><h2>Nothing to fix right now!</h2><p>Play some games or lessons. Anything you get wrong will be remembered and turned into Fix-it Reels with Lily.</p><button class="btn big" id="rx">Back</button></div>`;
    root.querySelector('#rx').onclick = () => app.go('fix'); return;
  }
  const s = store.state();
  let voiceOn = s.settings.reelVoice !== false, auto = s.settings.reelAuto !== false, likes = 0;
  if (voiceOn) speak(' ', null, true); // unlock speech on iPhone (must start inside a tap)
  const reels = buildReels(topics);
  root.innerHTML = `<div class="reels">
    <div class="reel-top"><button class="lz-x" id="rclose" aria-label="Close">✕</button><b>Fix-it Reels</b><span class="rcount">1/${reels.length}</span></div>
    <div class="reel-feed">${reels.map((r, i) => `<section class="reel ${r.kind}" data-i="${i}" style="--mc:${r.color}">
      <div class="reel-bar"><i></i></div>
      <div class="board">
        <div class="board-emo">${r.emoji.map((e, k) => emojiHTML(e, 'e' + k)).join('')}</div>
        <h2>${r.title}</h2>
        <div class="reel-content">${r.blocks.map((b, k) => `<div class="st" data-step="${k}">${b}</div>`).join('')}</div>${r.cta || ''}
      </div>
      <div class="rstage"><div class="lily-slot"></div><div class="bubble"><span></span></div></div>
      <div class="reel-rail"><button data-like title="Got it">❤️<i>${likes}</i></button><button data-replay title="Replay">🔁</button><button data-voice title="Voice">${voiceOn ? '🔊' : '🔇'}</button><button data-auto title="Auto-scroll">${auto ? '⏩' : '⏸'}</button>${r.L ? `<button data-lesson="${r.L.id}" title="Full lesson">📖</button>` : ''}</div>
      <div class="reel-cap">${r.L ? `<b>@lily.juice.co</b> · ${esc(r.mod)} · ${esc(r.L.title)} #cpa ${tag(r.L)}` : '<b>@lily.juice.co</b> · #cpa #fixit'} · 🎵 original sound</div>
      ${i < reels.length - 1 ? '<div class="reel-hint">👆 swipe up</div>' : ''}
    </section>`).join('')}</div></div>`;
  const feed = root.querySelector('.reel-feed'), els = [...root.querySelectorAll('.reel')];
  const lily = createLily('lg');
  let cur = -1, timer = null, paused = false, gen = 0, li = 0;
  const bubble = () => els[cur] && els[cur].querySelector('.bubble span');
  const stop = () => { gen++; clearTimeout(timer); hush(); lily.talk(false); };
  const close = () => { stop(); obs.disconnect(); lily.destroy(); els.forEach(stopEmoji); app.go('fix'); };
  const go = i => { if (i >= 0 && i < els.length) els[i].scrollIntoView({ behavior: 'smooth' }); };
  const reveal = (el, k) => { const b = el.querySelector(`[data-step="${k}"]`); if (b && !b.classList.contains('on')) { b.classList.add('on'); sfx('tick'); const c = el.querySelector('.reel-content'); const top = b.offsetTop - c.offsetTop; if (top + b.offsetHeight > c.scrollTop + c.clientHeight) c.scrollTo({ top: Math.max(0, top - 20), behavior: 'smooth' }); } };
  // say line k of the current reel, then the next
  const sayLine = (i, k) => {
    const my = ++gen; li = k;
    const el = els[i], r = reels[i], bar = el.querySelector('.reel-bar i');
    bar.style.width = Math.round(k / r.lines.length * 100) + '%';
    if (k >= r.lines.length) { lily.talk(false).mood('happy'); bar.style.width = '100%'; if (auto && i < els.length - 1) timer = setTimeout(() => { if (my === gen && !paused) go(i + 1); }, 1400); return; }
    const L = r.lines[k];
    if (L.show !== undefined) reveal(el, L.show);
    const done = () => { if (my !== gen) return; gen++; lily.talk(false); timer = setTimeout(() => { if (!paused) sayLine(i, k + 1); }, 350); };
    if (L.quiet || !L.t) { timer = setTimeout(done, 1600); return; }
    lily.mood(L.mood || 'happy').gesture(L.g); lily.talk(true);
    const sp = bubble(); if (sp) { sp.textContent = L.t; sp.parentElement.classList.remove('pop'); void sp.offsetWidth; sp.parentElement.classList.add('pop'); }
    const text = speakable(L.t);
    const est = Math.max(1500, text.length * 62);
    if (voiceOn) { speak(text, done, true, () => { if (my === gen) lily.word(); }); timer = setTimeout(done, est + 4000); }
    else timer = setTimeout(done, est);
  };
  const play = i => {
    stop(); cur = i; paused = false;
    root.querySelector('.rcount').textContent = `${i + 1}/${els.length}`;
    els.forEach((e, k) => { e.classList.toggle('play', k === i); e.classList.remove('paused'); if (Math.abs(k - i) > 1) stopEmoji(e); });
    const el = els[i];
    el.querySelectorAll('.st').forEach(b => b.classList.remove('on'));
    el.querySelector('.reel-content').scrollTop = 0;
    el.querySelector('.lily-slot').appendChild(lily.el);
    playEmoji(el); if (els[i + 1]) playEmoji(els[i + 1]);
    sayLine(i, 0);
  };
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > 0.6) { const i = +e.target.dataset.i; if (i !== cur) play(i); } }), { root: feed, threshold: [0.6] });
  els.forEach(e => obs.observe(e));
  root.querySelector('#rclose').onclick = close;
  feed.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (e.target.closest('details')) return;
    if (!b) { // tap the video to pause / resume
      const el = els[cur]; if (!el) return;
      paused = !paused; el.classList.toggle('paused', paused);
      if (paused) { gen++; clearTimeout(timer); hush(); lily.talk(false).mood('think'); } else sayLine(cur, li);
      return;
    }
    unlock();
    if (b.dataset.retest !== undefined) { stop(); obs.disconnect(); lily.destroy(); return retest(app, topics); }
    if (b.dataset.like !== undefined) { likes++; sfx('coin'); b.classList.add('liked'); lily.mood('proud').gesture('jump'); root.querySelectorAll('[data-like] i').forEach(x => x.textContent = likes); return; }
    if (b.dataset.replay !== undefined) return play(cur);
    if (b.dataset.voice !== undefined) { voiceOn = !voiceOn; s.settings.reelVoice = voiceOn; store.save(); root.querySelectorAll('[data-voice]').forEach(x => x.textContent = voiceOn ? '🔊' : '🔇'); return play(cur); }
    if (b.dataset.auto !== undefined) { auto = !auto; s.settings.reelAuto = auto; store.save(); root.querySelectorAll('[data-auto]').forEach(x => x.textContent = auto ? '⏩' : '⏸'); return; }
    if (b.dataset.lesson) { stop(); obs.disconnect(); lily.destroy(); return app.lesson(b.dataset.lesson); }
  });
  document.addEventListener('keydown', function key(e) {
    if (!document.body.contains(feed)) return document.removeEventListener('keydown', key);
    if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); go(cur + 1); } if (e.key === 'ArrowUp') { e.preventDefault(); go(cur - 1); } if (e.key === 'Escape') close();
  });
  window.scrollTo(0, 0);
}

// ── Re-test: same questions you missed (new numbers for calculations) + a cousin question per topic.
export function retest(app, topics) {
  hush();
  const root = app.el; document.body.classList.add('ingame');
  const qs = retestFor(topics, Math.min(8, topics.length * 3 + 2));
  const before = Object.fromEntries(topics.map(t => [t.lesson, t.items.length]));
  let qi = 0; const res = [];
  const frame = inner => { root.innerHTML = `<div class="lesson retest" style="--mc:#3fff8b"><header class="lz-top"><button class="lz-x" aria-label="Close">✕</button><div class="lz-prog"><i style="width:${Math.round(qi / qs.length * 100)}%"></i></div><span class="lz-tag">RE-TEST</span></header>${inner}</div>`; root.querySelector('.lz-x').onclick = () => app.go('fix'); };
  const ask = () => {
    if (qi >= qs.length) return finish();
    const q = qs[qi];
    frame(`<main class="lz-body"><div class="lz-kicker">🎯 Re-test · ${qi + 1}/${qs.length}${q.retestOf ? ' · you missed this before' : ''}</div>${q.intro ? `<details class="scen" open><summary>📄 Scenario</summary><div>${q.intro}</div></details>` : ''}<h2>${esc(q.q)}</h2>
      <div class="lz-opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}"><b>${LETTERS[k]}</b>${esc(o)}</button>`).join('')}</div><div id="fb"></div></main>
      <footer class="lz-foot"><span></span><span></span><button class="btn" id="next" disabled>Next ▶</button></footer>`);
    root.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (root.querySelector('.opt.good')) return; const k = +b.dataset.k, ok = k === q.a;
      root.querySelectorAll('.opt').forEach((x, j) => { if (j === q.a) x.classList.add('good'); else if (j === k) x.classList.add('bad'); });
      sfx(ok ? 'correct' : 'wrong'); store.record(q.lo, ok); store.remember(q, ok, k); if (q.retestOf && q.retestOf !== q.key) store.remember({ ...q, key: q.retestOf }, ok, k);
      res.push({ q, ok });
      root.querySelector('#fb').innerHTML = `<div class="lz-fb ${ok ? 'ok' : 'no'}">${ok ? '🎉 Correct!' : '🙈 Not yet.'} ${esc(q.ex || '')}</div>`;
      const n = root.querySelector('#next'); n.disabled = false; n.onclick = () => { qi++; ask(); };
    });
  };
  const finish = () => {
    const right = res.filter(r => r.ok).length;
    store.addXP(right * 15); store.logRetest({ lessons: topics.map(t => t.lesson), score: right, total: res.length });
    sfx(right === res.length ? 'win' : 'power');
    const rows = topics.map(t => {
      const L = lessonById(t.lesson), mine = res.filter(r => r.q.lesson === t.lesson), ok = mine.filter(r => r.ok).length;
      const left = store.activeMistakes(t.lesson).length;
      const verdict = !mine.length ? ['➖', 'Not tested', ''] : ok === mine.length ? (left ? ['💪', 'Getting there', `All right this time! Get ${left === 1 ? 'it' : 'them'} right once more (in a game or a later re-test) to lock ${left === 1 ? 'it' : 'them'} in.`] : ['✅', 'Fixed!', 'You nailed it twice in a row. Great job!']) : ['🤔', 'Still tricky', 'Watch the reels again or redo the full lesson. That\'s normal: repetition is how memory works.'];
      return `<div class="rt-row ${verdict[1] === 'Still tricky' ? 'bad' : ''}"><div class="rt-v">${verdict[0]}</div><div><b>${esc(L.title)}</b><span>${verdict[1]} · ${ok}/${mine.length} now · ${before[t.lesson]} mistake${before[t.lesson] === 1 ? '' : 's'} before → ${left} left</span><i>${verdict[2]}</i>
        ${verdict[1] === 'Still tricky' ? `<div class="row"><button class="btn small" data-again="${t.lesson}">🎬 Re-watch</button><button class="btn ghost small" data-lesson="${t.lesson}">📖 Full lesson</button></div>` : ''}</div></div>`;
    }).join('');
    frame(`<main class="lz-body center"><div class="pic">${right === res.length ? '🏆' : right >= res.length / 2 ? '⭐' : '💪'}</div><h2>Re-test: ${right}/${res.length}</h2>
      <p><b>+${right * 15} XP</b></p><div class="rt-list">${rows}</div>
      <div class="lz-actions"><button class="btn big" id="more">🎬 Fix my next weak spots</button><button class="btn ghost" id="home">Back to Fix-it</button></div></main>`);
    root.querySelector('.lz-prog i').style.width = '100%';
    root.querySelectorAll('[data-again]').forEach(b => b.onclick = () => playReels(app, { lessons: [b.dataset.again] }));
    root.querySelectorAll('[data-lesson]').forEach(b => b.onclick = () => app.lesson(b.dataset.lesson));
    root.querySelector('#more').onclick = () => playReels(app);
    root.querySelector('#home').onclick = () => app.go('fix');
  };
  ask(); window.scrollTo(0, 0);
}
