// Lily, the narrator: a cartoon that talks (lip-flap), blinks, bobs and changes expression.
// Artwork: ToonHead by Johan Melin (CC BY 4.0) via DiceBear (MIT); see tools/build_lily.mjs.
import { LILY_SVG } from './lily-svg.js';

const MOODS = {
  happy: { e: 'happy', b: 'happy', m: 'smile' },
  surprised: { e: 'wide', b: 'raised', m: 'agape' },
  oops: { e: 'happy', b: 'sad', m: 'sad' },
  proud: { e: 'bow', b: 'happy', m: 'laugh' },
  wink: { e: 'wink', b: 'happy', m: 'smile' },
  think: { e: 'happy', b: 'raised', m: 'smile' },
};
const TALK = ['agape', 'laugh', 'smile', 'agape', 'smile', 'laugh'];

export function createLily(size = 'md') {
  const el = document.createElement('div');
  el.className = `lily lily-${size}`;
  el.innerHTML = `<div class="lily-bob">${LILY_SVG}</div>`;
  let mood = 'happy', talking = false, tTimer = null, bTimer = null, alive = true;
  const set = (k, v) => el.setAttribute('data-' + k, v);
  const apply = () => { const m = MOODS[mood] || MOODS.happy; set('e', m.e); set('b', m.b); if (!talking) set('m', m.m); el.dataset.mood = mood; };
  const flap = () => { if (!talking) return; set('m', TALK[Math.floor(Math.random() * TALK.length)]); tTimer = setTimeout(flap, 90 + Math.random() * 110); };
  const blink = () => {
    if (!alive) return;
    const m = MOODS[mood] || MOODS.happy;
    if (m.e === 'happy' || m.e === 'wide') { set('e', 'bow'); setTimeout(() => { if (alive) set('e', (MOODS[mood] || MOODS.happy).e); }, 140); }
    bTimer = setTimeout(blink, 2200 + Math.random() * 3200);
  };
  apply(); bTimer = setTimeout(blink, 1500);
  return {
    el,
    mood(m) { mood = MOODS[m] ? m : 'happy'; apply(); return this; },
    talk(on) { if (on === talking) return this; talking = on; el.classList.toggle('talking', on); clearTimeout(tTimer); if (on) flap(); else apply(); return this; },
    // a little mouth movement per spoken word (from speech boundary events)
    word() { if (!talking) return; set('m', TALK[Math.floor(Math.random() * TALK.length)]); },
    gesture(g) { el.classList.remove('g-point', 'g-jump', 'g-nod', 'g-shake'); void el.offsetWidth; if (g) el.classList.add('g-' + g); return this; },
    destroy() { alive = false; talking = false; clearTimeout(tTimer); clearTimeout(bTimer); },
  };
}
