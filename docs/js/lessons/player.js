// Lesson player: swipeable slides, tap-to-reveal worked steps, "read to me" voice, and a 3-question check.
import { lessonById, LESSONS } from './index.js';
import * as store from '../core/store.js';
import { sfx, unlock } from '../core/audio.js';
import { esc, LETTERS } from '../core/engine.js';
import { lessonQuiz } from '../core/questions.js';
import { MODULES } from '../content/syllabus.js';
import { speak, speakable, hush } from '../core/speech.js';
import { bookQsForLesson } from '../book/book.js';

const GAME_NAMES = { ninja: '🥷 Info Ninja', runner: '🏃 Cost Runner', factory: '🏭 Overhead Factory', strike: '🚀 Variance Strike', tycoon: '🏢 Division Tycoon', rush: '⚙️ Factory Rush', warehouse: '📦 Warehouse Panic' };

export function playLesson(app, id) {
  const L = lessonById(id); if (!L) return app.go('learn');
  const mod = MODULES.find(m => m.id === L.mod); const color = mod ? mod.color : '#ffd23f';
  document.body.classList.add('ingame');
  const root = app.el; let i = 0, reading = false;
  const qs = lessonQuiz(L.id, 5);
  let qi = 0, right = 0;

  const frame = inner => {
    root.innerHTML = `<div class="lesson" style="--mc:${color}">
      <header class="lz-top"><button class="lz-x" aria-label="Close">✕</button><div class="lz-prog"><i style="width:${Math.round((i + qi) / (L.slides.length + qs.length) * 100)}%"></i></div><span class="lz-tag">${mod ? mod.short : 'START'}</span></header>
      ${inner}</div>`;
    root.querySelector('.lz-x').onclick = () => { hush(); app.go('learn'); };
  };

  const slide = () => {
    const s = L.slides[i];
    frame(`<main class="lz-body" id="lzb"><div class="lz-kicker">${esc(L.title)} · ${i + 1}/${L.slides.length}</div><h2>${s.h}</h2><div class="lz-content">${s.b}</div></main>
      <footer class="lz-foot"><button class="btn ghost" id="back" ${i === 0 ? 'disabled' : ''}>◀</button>
      <button class="btn ghost" id="read">${reading ? '⏹ Stop' : '🔊 Read to me'}</button><button class="btn" id="next">Next ▶</button></footer>`);
    const body = root.querySelector('#lzb');
    const hidden = () => [...body.querySelectorAll('ol.reveal li:not(.shown)')];
    // hide steps until tapped
    body.querySelectorAll('ol.reveal').forEach(ol => { const tip = document.createElement('div'); tip.className = 'reveal-tip'; tip.textContent = '👆 tap Next (or here) to reveal each step'; ol.after(tip); tip.onclick = () => revealOne(); });
    const revealOne = () => { const h = hidden(); if (h.length) { h[0].classList.add('shown'); sfx('tick'); if (!hidden().length) body.querySelectorAll('.reveal-tip').forEach(t => t.remove()); h[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return true; } return false; };
    body.querySelectorAll('ol.reveal li').forEach(li => li.onclick = () => revealOne());
    root.querySelector('#next').onclick = () => { unlock(); if (revealOne()) return; hush(); reading = false; sfx('swoosh'); i++; if (i >= L.slides.length) quiz(); else slide(); };
    root.querySelector('#back').onclick = () => { if (i > 0) { hush(); reading = false; i--; slide(); } };
    root.querySelector('#read').onclick = () => {
      if (reading) { hush(); reading = false; slide(); return; }
      body.querySelectorAll('ol.reveal li').forEach(li => li.classList.add('shown')); body.querySelectorAll('.reveal-tip').forEach(t => t.remove());
      reading = true; root.querySelector('#read').textContent = '⏹ Stop';
      speak(speakable(s.h + '. ' + s.b), () => { reading = false; const b = root.querySelector('#read'); if (b) b.textContent = '🔊 Read to me'; });
    };
    // swipe
    let sx = null; body.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    body.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (dx < -70) root.querySelector('#next').click(); if (dx > 70) root.querySelector('#back').click(); });
  };

  const quiz = () => {
    if (qi >= qs.length) return finish();
    const q = qs[qi];
    frame(`<main class="lz-body"><div class="lz-kicker">Quick check · ${qi + 1}/${qs.length}</div><h2>${esc(q.q)}</h2>
      <div class="lz-opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}"><b>${LETTERS[k]}</b>${esc(o)}</button>`).join('')}</div><div id="fb"></div></main>
      <footer class="lz-foot"><span></span><button class="btn ghost" id="read">🔊 Read</button><button class="btn" id="next" disabled>Next ▶</button></footer>`);
    root.querySelector('#read').onclick = () => speak(speakable(q.q + '. ' + q.opts.map((o, k) => `${LETTERS[k]}: ${o}`).join('. ')));
    root.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (root.querySelector('.opt.good')) return; const k = +b.dataset.k, ok = k === q.a;
      root.querySelectorAll('.opt').forEach((x, j) => { if (j === q.a) x.classList.add('good'); else if (j === k) x.classList.add('bad'); });
      if (ok) right++; sfx(ok ? 'correct' : 'wrong');
      if (q.lo) store.record(q.lo, ok); store.remember(q, ok, k);
      root.querySelector('#fb').innerHTML = `<div class="lz-fb ${ok ? 'ok' : 'no'}">${ok ? '🎉 Correct!' : '🙈 Not quite.'} ${esc(q.ex)}</div>`;
      const n = root.querySelector('#next'); n.disabled = false; n.onclick = () => { hush(); qi++; quiz(); };
    });
  };

  const finish = () => {
    const first = store.markLesson(L.id, right, qs.length); sfx('win');
    const idx = LESSONS.findIndex(l => l.id === L.id); const nxt = LESSONS[idx + 1];
    frame(`<main class="lz-body center"><div class="pic">${right === qs.length ? '🏆' : right ? '⭐' : '💪'}</div><h2>Lesson complete!</h2>
      <p>You got <b>${right}/${qs.length}</b> on the quick check. ${first ? '<b>+40 XP</b> 🎉' : '(review done)'}</p>
      <div class="say">${right === qs.length ? 'Perfect! You\'re a natural. 🐷💕' : right ? 'Nice work! Mistakes are how we learn. Try the game to lock it in.' : 'That\'s OK! Read the slides again or play the game. Repeating is how memory works.'}</div>
      <div class="lz-actions">${L.game ? `<button class="btn big" id="game">Practise in ${GAME_NAMES[L.game]}</button>` : ''}
      ${nxt ? `<button class="btn ${L.game ? 'ghost' : 'big'}" id="nxt">Next lesson: ${esc(nxt.title)} ▶</button>` : ''}
      ${bookQsForLesson(L.id).length ? `<button class="btn ghost" id="bookq">📕 Book questions on this lesson (${bookQsForLesson(L.id).length})</button>` : ''}
      <button class="btn ghost" id="again">↻ Redo this lesson</button><button class="btn ghost" id="home">📚 Back to Learn</button></div></main>`);
    root.querySelector('.lz-prog i').style.width = '100%';
    const g = root.querySelector('#game'); if (g) g.onclick = () => app.play(L.game);
    const n = root.querySelector('#nxt'); if (n) n.onclick = () => playLesson(app, nxt.id);
    root.querySelector('#again').onclick = () => playLesson(app, L.id);
    const bq = root.querySelector('#bookq'); if (bq) bq.onclick = () => app.book({ lesson: L.id });
    root.querySelector('#home').onclick = () => app.go('learn');
  };
  slide(); window.scrollTo(0, 0);
}
