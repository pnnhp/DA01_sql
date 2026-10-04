// Fix-it Reels: a TikTok-style vertical feed built from the lessons behind the questions you keep missing,
// followed by a short re-test to check whether the mistake is fixed.
import * as store from '../core/store.js';
import { sfx, unlock } from '../core/audio.js';
import { esc, LETTERS } from '../core/engine.js';
import { retestFor } from '../core/questions.js';
import { lessonById } from '../lessons/index.js';
import { MODULES } from '../content/syllabus.js';
import { speak, speakable, hush } from '../core/speech.js';

const MAX_TOPICS = 3;
const STOP = new Set('which what when where that this with from have their there about would should could does into than then them they your more most only also over such each because these those being after before under other same very much many will been were make made used uses using'.split(' '));
const words = s => (String(s).toLowerCase().replace(/<[^>]+>/g, ' ').match(/[a-z][a-z\-]{3,}/g) || []).filter(w => !STOP.has(w));
const plain = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent; };
const modOf = L => MODULES.find(m => m.id === L.mod) || { color: '#ffd23f', short: 'Start', name: 'Start' };
const tag = L => '#' + (L.title.split(/[^A-Za-z]+/).filter(w => w.length > 3)[0] || 'cpa').toLowerCase();

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

function buildReels(topics) {
  const reels = [];
  const total = topics.reduce((a, t) => a + t.items.length, 0);
  reels.push({ kind: 'intro', color: '#ff3f7a', emoji: '🎬', title: 'Fix-it Reels',
    html: `<p class="big">${total ? `You've missed <b>${total}</b> thing${total > 1 ? 's' : ''} more than you'd like.` : 'Quick refresher time.'}</p>
      <ul>${topics.map(t => `<li>📌 ${esc(lessonById(t.lesson).title)}${t.items.length ? ` <i>(${t.items.length} to fix)</i>` : ''}</li>`).join('')}</ul>
      <p>Watch, then take a quick re-test. 👆 Swipe up to start.</p>`,
    say: `Fix it reels. ${topics.length} topic${topics.length > 1 ? 's' : ''} to fix. Watch these, then take a quick re-test. Swipe up to start.` });
  for (const t of topics) {
    const L = lessonById(t.lesson), m = modOf(L);
    const base = { color: m.color, mod: m.short, L };
    for (const it of [...t.items].sort((a, b) => b.wrong - a.wrong).slice(0, 2)) {
      reels.push({ ...base, kind: 'mistake', emoji: '😬', title: `You missed this ×${it.wrong}`,
        html: `${it.intro ? `<details class="scen"><summary>📄 Scenario</summary><div>${it.intro}</div></details>` : ''}<div class="rq">${esc(it.q)}</div>${it.picked ? `<div class="rp st">You picked: <s>${esc(it.picked)}</s> ❌</div>` : ''}
          <div class="ra st">✅ ${esc(it.ans)}</div>${it.ex ? `<div class="rx st">💡 ${esc(it.ex)}</div>` : ''}`,
        say: `You missed this ${it.wrong} time${it.wrong > 1 ? 's' : ''}. ${it.q}. ${it.picked ? `You picked ${it.picked}. ` : ''}The answer is: ${it.ans}. ${it.ex}` });
    }
    for (const s of bestSlides(L, t.items)) reels.push({ ...base, kind: 'teach', emoji: '', title: s.h, html: s.b, say: `${s.h}. ${plain(s.b)}` });
  }
  reels.push({ kind: 'end', color: '#3fff8b', emoji: '🎯', title: 'Did it stick?', html: `<p class="big">Time for a quick re-test on exactly what you missed (calculations come back with new numbers).</p><button class="btn big" data-retest>Start re-test ▶</button>`,
    say: 'Did it stick? Time for a quick re-test on exactly what you missed.' });
  return reels;
}

export function playReels(app, opts = {}) {
  const topics = pickTopics(opts.lessons);
  const root = app.el;
  document.body.classList.add('ingame');
  if (!topics.length) {
    root.innerHTML = `<div class="reels-empty panel"><div class="pic">🌟</div><h2>Nothing to fix right now!</h2><p>Play some games or lessons. Anything you get wrong will be remembered and turned into Fix-it Reels.</p><button class="btn big" id="rx">Back</button></div>`;
    root.querySelector('#rx').onclick = () => app.go('fix'); return;
  }
  const s = store.state();
  let voiceOn = s.settings.reelVoice !== false, auto = s.settings.reelAuto !== false, likes = 0;
  if (voiceOn) speak(' ', null, true); // unlock speech on iPhone (must start inside a tap)
  const reels = buildReels(topics);
  root.innerHTML = `<div class="reels">
    <div class="reel-top"><button class="lz-x" id="rclose" aria-label="Close">✕</button><b>Fix-it Reels</b><span class="rcount">1/${reels.length}</span></div>
    <div class="reel-feed">${reels.map((r, i) => `<section class="reel ${r.kind}" data-i="${i}" style="--mc:${r.color}">
      <div class="reel-bg"><span>${r.L ? (r.kind === 'mistake' ? '❓' : '💡') : r.emoji}</span><span>${r.emoji || '📚'}</span><span>✨</span></div>
      <div class="reel-bar"><i></i></div>
      <div class="reel-body">${r.emoji ? `<div class="reel-emoji">${r.emoji}</div>` : ''}<h2 class="st">${r.title}</h2><div class="reel-content">${r.html}</div></div>
      <div class="reel-rail"><button data-like title="Got it">❤️<i>${likes}</i></button><button data-replay title="Replay">🔁</button><button data-voice title="Voice">${voiceOn ? '🔊' : '🔇'}</button><button data-auto title="Auto-scroll">${auto ? '⏩' : '⏸'}</button>${r.L ? `<button data-lesson="${r.L.id}" title="Full lesson">📖</button>` : ''}</div>
      <div class="reel-cap">${r.L ? `<b>@lily.juice.co</b> · ${esc(r.mod)}<br><span>${esc(r.L.title)} #cpa ${tag(r.L)} #fixit</span>` : '<b>@costcommando</b><br><span>#cpa #managementaccounting</span>'}<br><i>🎵 original sound · Cost Commando</i></div>
      ${i < reels.length - 1 ? '<div class="reel-hint">👆 swipe up</div>' : ''}
    </section>`).join('')}</div></div>`;
  const feed = root.querySelector('.reel-feed'), els = [...root.querySelectorAll('.reel')];
  // stage every block so it pops in one after another
  els.forEach(el => {
    const blocks = [...el.querySelectorAll('.reel-content > *:not(ol):not(ul):not(table), .reel-content li, .reel-content tr')];
    blocks.forEach((b, k) => { b.classList.add('st'); b.style.setProperty('--d', (0.5 + k * 0.9).toFixed(2) + 's'); });
  });
  let cur = -1, timer = null, paused = false;
  const stop = () => { clearTimeout(timer); hush(); };
  const close = () => { stop(); obs.disconnect(); app.go('fix'); };
  const go = i => { if (i >= 0 && i < els.length) els[i].scrollIntoView({ behavior: 'smooth' }); };
  const play = i => {
    stop(); cur = i; paused = false;
    root.querySelector('.rcount').textContent = `${i + 1}/${els.length}`;
    els.forEach((e, k) => e.classList.toggle('play', k === i));
    const el = els[i], r = reels[i], bar = el.querySelector('.reel-bar i');
    const text = speakable(r.say), dur = Math.max(6, Math.min(40, text.split(/\s+/).length * 0.4));
    bar.style.transition = 'none'; bar.style.width = '0'; void bar.offsetWidth; bar.style.transition = `width ${dur}s linear`; bar.style.width = '100%';
    let doneSpeech = !voiceOn, doneTime = false;
    const next = () => { if (doneSpeech && doneTime && auto && cur === i && !paused && i < els.length - 1) go(i + 1); };
    timer = setTimeout(() => { doneTime = true; next(); }, dur * 1000);
    if (voiceOn) speak(text, () => { doneSpeech = true; setTimeout(next, 900); }, true);
  };
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > 0.6) { const i = +e.target.dataset.i; if (i !== cur) play(i); } }), { root: feed, threshold: [0.6] });
  els.forEach(e => obs.observe(e));
  root.querySelector('#rclose').onclick = close;
  feed.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) { // tap the video to pause / resume
      paused = !paused; const el = els[cur]; if (!el) return;
      el.classList.toggle('paused', paused); if (paused) { clearTimeout(timer); hush(); } else play(cur);
      return;
    }
    unlock();
    if (b.dataset.retest !== undefined) { stop(); obs.disconnect(); return retest(app, topics); }
    if (b.dataset.like !== undefined) { likes++; sfx('coin'); b.classList.add('liked'); root.querySelectorAll('[data-like] i').forEach(x => x.textContent = likes); return; }
    if (b.dataset.replay !== undefined) return play(cur);
    if (b.dataset.voice !== undefined) { voiceOn = !voiceOn; s.settings.reelVoice = voiceOn; store.save(); root.querySelectorAll('[data-voice]').forEach(x => x.textContent = voiceOn ? '🔊' : '🔇'); return play(cur); }
    if (b.dataset.auto !== undefined) { auto = !auto; s.settings.reelAuto = auto; store.save(); root.querySelectorAll('[data-auto]').forEach(x => x.textContent = auto ? '⏩' : '⏸'); return; }
    if (b.dataset.lesson) { stop(); obs.disconnect(); return app.lesson(b.dataset.lesson); }
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
