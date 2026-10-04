// Book practice: every study-guide question (reworded), played set by set in book order,
// or per lesson / at random. Mistakes go into the Fix-it memory.
import * as store from '../core/store.js';
import { sfx } from '../core/audio.js';
import { esc, LETTERS } from '../core/engine.js';
import { shuffle } from '../core/questions.js';
import { BOOK, bookSet, bookSetsForModule, KIND } from '../content/book/index.js';
import { lessonById } from '../lessons/index.js';
import { MODULES } from '../content/syllabus.js';

const plain = h => String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

// One playable question from a book set item.
function make(set, i) {
  const x = set.qs[i], order = shuffle([0, 1, 2, 3]);
  return { key: `k:${set.id}.${i}`, set, lo: x.lo, lesson: x.lesson, qHtml: x.q, q: plain(x.q), intro: x.intro || set.intro || '', opts: order.map(k => x.opts[k]), a: order.indexOf(0), ex: x.ex };
}
export const bookCount = () => BOOK.reduce((a, s) => a + s.qs.length, 0);
export const bookQsForLesson = id => BOOK.flatMap(s => s.qs.map((x, i) => x.lesson === id ? [s, i] : null).filter(Boolean));
// A set is "ready" once you've done every lesson it uses (warm-ups are always ready).
export const setLessons = s => [...new Set(s.qs.map(x => x.lesson))];
export const setReady = s => s.kind === 'byb' || setLessons(s).every(id => store.lessonDone(id));
export const setDone = s => { const r = store.bookStat(s.id); return !!r; };
export function nextBookSet(mod) {
  const sets = mod ? bookSetsForModule(mod) : BOOK;
  return sets.find(s => !setDone(s) && setReady(s) && setLessons(s).some(id => store.lessonDone(id))) || null;
}

/**
 * opts: { set: id } | { lesson: id } | { mod, random: n } | { keys: [...] }
 */
export function playBook(app, opts = {}) {
  let items = [], title = '', setId = null;
  if (opts.set) { const s = bookSet(opts.set); if (!s) return app.go('book'); setId = s.id; title = `${KIND[s.kind].icon} ${s.title}`; items = s.qs.map((_, i) => make(s, i)); }
  else if (opts.lesson) { const L = lessonById(opts.lesson); title = `📕 Book: ${L ? L.title : ''}`; items = bookQsForLesson(opts.lesson).map(([s, i]) => make(s, i)); }
  else if (opts.keys) { title = '📕 Try again'; items = opts.keys.map(k => { const [sid, i] = k.slice(2).split('.'); const s = bookSet(sid); return s ? make(s, +i) : null; }).filter(Boolean); }
  else { const pool = (opts.mod ? bookSetsForModule(opts.mod) : BOOK).flatMap(s => s.qs.map((_, i) => [s, i])); title = `🎲 Random book mix${opts.mod ? ' · M' + opts.mod : ''}`; items = shuffle(pool).slice(0, opts.random || 10).map(([s, i]) => make(s, i)); }
  if (!items.length) return app.go('book');
  const root = app.el; document.body.classList.add('ingame');
  let qi = 0; const res = [];
  const frame = inner => { root.innerHTML = `<div class="lesson bookplay" style="--mc:#ffd23f"><header class="lz-top"><button class="lz-x" aria-label="Close">✕</button><div class="lz-prog"><i style="width:${Math.round(qi / items.length * 100)}%"></i></div><span class="lz-tag">BOOK</span></header>${inner}</div>`; root.querySelector('.lz-x').onclick = () => app.go('book'); };
  const ask = () => {
    if (qi >= items.length) return finish();
    const q = items[qi], prev = items[qi - 1], sameScen = prev && prev.intro === q.intro;
    frame(`<main class="lz-body"><div class="lz-kicker">${esc(title)} · ${qi + 1}/${items.length}${q.set.ref ? ' · ' + esc(q.set.ref) : ''}</div>
      ${q.intro ? `<details class="scen" ${sameScen && qi > 0 ? '' : 'open'}><summary>📄 Scenario${sameScen ? ' (same as before)' : ''}</summary><div>${q.intro}</div></details>` : ''}
      <h2>${q.qHtml}</h2>
      <div class="lz-opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}"><b>${LETTERS[k]}</b>${esc(o)}</button>`).join('')}</div><div id="fb"></div></main>
      <footer class="lz-foot"><span></span><span></span><button class="btn" id="next" disabled>Next ▶</button></footer>`);
    root.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (root.querySelector('.opt.good')) return; const k = +b.dataset.k, ok = k === q.a;
      root.querySelectorAll('.opt').forEach((x, j) => { if (j === q.a) x.classList.add('good'); else if (j === k) x.classList.add('bad'); });
      sfx(ok ? 'correct' : 'wrong'); store.record(q.lo, ok); store.remember(q, ok, k);
      res.push({ q, ok, k });
      const L = lessonById(q.lesson);
      root.querySelector('#fb').innerHTML = `<div class="lz-fb ${ok ? 'ok' : 'no'}">${ok ? '🎉 Correct!' : '🙈 Not quite.'} ${esc(q.ex || '')}${L ? `<br><button class="rv-l" data-lesson="${L.id}">📖 ${esc(L.title)}</button>` : ''}</div>`;
      const lb = root.querySelector('[data-lesson]'); if (lb) lb.onclick = () => app.lesson(lb.dataset.lesson);
      const n = root.querySelector('#next'); n.disabled = false; n.onclick = () => { qi++; ask(); };
    });
  };
  const finish = () => {
    const right = res.filter(r => r.ok).length, wrong = res.filter(r => !r.ok);
    if (setId) store.bookResult(setId, right, res.length);
    store.addXP(right * 8 + (right === res.length ? 20 : 0)); sfx(right === res.length ? 'win' : 'power');
    const s = setId && bookSet(setId); const sets = s ? bookSetsForModule(s.mod) : []; const nxt = s ? sets[sets.indexOf(s) + 1] : null;
    frame(`<main class="lz-body center"><div class="pic">${right === res.length ? '🏆' : right >= res.length * 0.6 ? '⭐' : '💪'}</div><h2>${esc(title)}: ${right}/${res.length}</h2>
      <p><b>+${right * 8 + (right === res.length ? 20 : 0)} XP</b>${wrong.length ? ' · mistakes saved to 🎬 Fix-it' : ''}</p>
      ${wrong.length ? `<details class="review" open><summary>Review ${wrong.length} mistake${wrong.length > 1 ? 's' : ''}</summary>${wrong.map(r => `<div class="rv"><div class="rv-q">${esc(r.q.q)}</div><div class="rv-a">✔ ${esc(r.q.opts[r.q.a])}</div><div class="rv-e">${esc(r.q.ex || '')}</div></div>`).join('')}</details>` : ''}
      <div class="lz-actions">${wrong.length ? `<button class="btn big" id="again">↻ Retry my ${wrong.length} mistake${wrong.length > 1 ? 's' : ''}</button><button class="btn ghost" id="reels">🎬 Fix-it reels for these</button>` : ''}
      ${nxt ? `<button class="btn ${wrong.length ? 'ghost' : 'big'}" id="nxt">Next: ${KIND[nxt.kind].icon} ${esc(nxt.title)} ▶</button>` : ''}
      <button class="btn ghost" id="home">📕 Back to Book</button></div></main>`);
    root.querySelector('.lz-prog i').style.width = '100%';
    const $ = id => root.querySelector('#' + id);
    if ($('again')) $('again').onclick = () => playBook(app, { keys: wrong.map(r => r.q.key) });
    if ($('reels')) $('reels').onclick = () => app.reels({ lessons: [...new Set(wrong.map(r => r.q.lesson))] });
    if ($('nxt')) $('nxt').onclick = () => playBook(app, { set: nxt.id });
    $('home').onclick = () => app.go('book', s ? s.mod : undefined);
  };
  ask(); window.scrollTo(0, 0);
}

// Rows for a module's sets (used on the Book screen and the module screen).
export function bookRows(mod) {
  const m = MODULES.find(x => x.id === mod) || { color: '#ffd23f' };
  return bookSetsForModule(mod).map(s => {
    const r = store.bookStat(s.id), ready = setReady(s), n = s.qs.length;
    const need = setLessons(s).filter(id => !store.lessonDone(id)).map(id => (lessonById(id) || {}).title).filter(Boolean);
    const status = r ? `${r.best === r.total ? '✅' : '⭐'} best ${r.best}/${r.total}` : ready ? '▶ ready' : `🔒 after: ${esc(need.slice(0, 2).join(', '))}${need.length > 2 ? '…' : ''}`;
    return `<button class="lrow bookrow ${r ? 'done' : ''}" data-book="${s.id}" style="--mc:${m.color}"><span class="lck">${KIND[s.kind].icon}</span><span class="lt"><b>${esc(s.title)}</b><i>${n} question${n > 1 ? 's' : ''} · ${status}</i></span><span class="lgo">▶</span></button>`;
  }).join('');
}
