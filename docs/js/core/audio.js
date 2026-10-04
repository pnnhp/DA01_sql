// Synthesised sound effects + procedural chiptune music (no audio files, no licensing issues).
import { state } from './store.js';

let ctx = null, master, sfxBus, musicBus, noiseBuf;

export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    // iOS: play through the ringer switch where supported
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* not supported */ }
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.55; sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.22; musicBus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function tone(freq, dur, { type = 'square', vol = 0.3, slide = 0, delay = 0, bus = sfxBus, attack = 0.005 } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, { vol = 0.3, freq = 1200, q = 1, delay = 0, type = 'lowpass', sweep = 0, bus = sfxBus } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
  if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(40, freq * sweep), t + dur);
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + dur + 0.02);
}

const SFX = {
  click: () => tone(880, 0.05, { type: 'triangle', vol: 0.15 }),
  shoot: () => { tone(900, 0.09, { type: 'square', vol: 0.12, slide: 0.35 }); },
  laser: () => tone(1400, 0.12, { type: 'sawtooth', vol: 0.1, slide: 0.2 }),
  gun: () => { noise(0.08, { vol: 0.35, freq: 2500, sweep: 0.3 }); tone(160, 0.06, { type: 'square', vol: 0.15, slide: 0.5 }); },
  boom: () => { noise(0.6, { vol: 0.6, freq: 900, sweep: 0.08 }); tone(90, 0.4, { type: 'sine', vol: 0.4, slide: 0.4 }); },
  bigboom: () => { noise(1.1, { vol: 0.8, freq: 1400, sweep: 0.05 }); tone(70, 0.8, { type: 'sine', vol: 0.5, slide: 0.3 }); tone(140, 0.5, { type: 'square', vol: 0.12, slide: 0.3 }); },
  hit: () => { noise(0.12, { vol: 0.3, freq: 600 }); tone(200, 0.1, { type: 'square', vol: 0.12, slide: 0.5 }); },
  correct: () => { [660, 880, 1320].forEach((f, i) => tone(f, 0.14, { type: 'square', vol: 0.13, delay: i * 0.07 })); },
  wrong: () => { tone(220, 0.25, { type: 'sawtooth', vol: 0.18, slide: 0.6 }); tone(160, 0.3, { type: 'square', vol: 0.12, delay: 0.1, slide: 0.7 }); },
  coin: () => { tone(988, 0.08, { type: 'square', vol: 0.12 }); tone(1319, 0.2, { type: 'square', vol: 0.12, delay: 0.07 }); },
  cash: () => { tone(1568, 0.06, { type: 'triangle', vol: 0.15 }); tone(2093, 0.25, { type: 'triangle', vol: 0.15, delay: 0.06 }); noise(0.15, { vol: 0.08, freq: 6000, type: 'highpass', delay: 0.05 }); },
  slice: () => noise(0.18, { vol: 0.35, freq: 3000, type: 'bandpass', q: 3, sweep: 0.3 }),
  swoosh: () => noise(0.25, { vol: 0.2, freq: 500, type: 'bandpass', q: 1.5, sweep: 4 }),
  jump: () => tone(300, 0.15, { type: 'square', vol: 0.12, slide: 2.5 }),
  power: () => { [440, 554, 659, 880, 1109].forEach((f, i) => tone(f, 0.1, { type: 'square', vol: 0.1, delay: i * 0.05 })); },
  tick: () => tone(1800, 0.03, { type: 'square', vol: 0.06 }),
  alarm: () => { tone(880, 0.15, { type: 'square', vol: 0.12 }); tone(660, 0.15, { type: 'square', vol: 0.12, delay: 0.16 }); },
  win: () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i === 5 ? 0.5 : 0.13, { type: 'square', vol: 0.13, delay: i * 0.12 })); },
  lose: () => { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, { type: 'triangle', vol: 0.18, delay: i * 0.2 })); },
  crane: () => tone(120, 0.3, { type: 'sawtooth', vol: 0.08, slide: 1.5 }),
  thud: () => { tone(80, 0.2, { type: 'sine', vol: 0.4, slide: 0.5 }); noise(0.1, { vol: 0.2, freq: 300 }); },
  charge: () => tone(200, 0.08, { type: 'triangle', vol: 0.06, slide: 1.3 }),
  pickup: () => { tone(700, 0.07, { type: 'square', vol: 0.1 }); tone(1050, 0.1, { type: 'square', vol: 0.1, delay: 0.06 }); },
  storm: () => noise(0.5, { vol: 0.15, freq: 300, type: 'bandpass', q: 0.7 }),
};
export function sfx(name) {
  if (!ctx || !state().settings.sound) return;
  try { SFX[name] && SFX[name](); } catch (e) { /* ignore */ }
}
export function vibrate(ms = 20) { if (state().settings.haptics && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { /* ignore */ } }

// ───────── Music sequencer ─────────
const N = n => 440 * Math.pow(2, (n - 69) / 12); // midi -> Hz
const TRACKS = {
  menu:    { bpm: 112, prog: [57, 53, 48, 55], lead: 'triangle', bass: 'square', arp: [0, 7, 12, 7, 3, 7, 12, 15], drums: 'x.h.s.h.x.h.s.hh' },
  neon:    { bpm: 128, prog: [50, 46, 53, 48], lead: 'sawtooth', bass: 'sawtooth', arp: [0, 12, 7, 12, 3, 12, 7, 15], drums: 'x.h.s.h.x.x.s.h.' },
  pixel:   { bpm: 150, prog: [60, 55, 57, 53], lead: 'square', bass: 'triangle', arp: [0, 4, 7, 12, 7, 4, 0, 4], drums: 'x.h.s.hxx.h.s.h.' },
  factory: { bpm: 104, prog: [45, 45, 48, 43], lead: 'square', bass: 'square', arp: [0, 0, 12, 0, 10, 0, 7, 0], drums: 'x..hs..hx.xhs..h' },
  ninja:   { bpm: 120, prog: [52, 52, 48, 50], lead: 'triangle', bass: 'triangle', arp: [0, 3, 7, 10, 12, 10, 7, 3], drums: 'x...s..hx..xs...' },
  royale:  { bpm: 136, prog: [45, 41, 43, 40], lead: 'sawtooth', bass: 'square', arp: [0, 0, 7, 0, 3, 0, 10, 7], drums: 'x.hxs.h.x.hxs.hh' },
  tanks:   { bpm: 118, prog: [55, 48, 50, 55], lead: 'square', bass: 'triangle', arp: [0, 4, 7, 4, 12, 7, 4, 7], drums: 'x.h.s.h.x.hhs.h.' },
  boss:    { bpm: 140, prog: [45, 46, 45, 44], lead: 'sawtooth', bass: 'sawtooth', arp: [0, 1, 7, 1, 12, 7, 1, 0], drums: 'xxh.s.hxx.h.s.hs' },
  calm:    { bpm: 90, prog: [53, 57, 55, 48], lead: 'sine', bass: 'triangle', arp: [0, 7, 12, 16, 12, 7, 4, 7], drums: 'x.......s.......' },
  tycoon:  { bpm: 116, prog: [48, 57, 53, 55], lead: 'triangle', bass: 'square', arp: [12, 7, 4, 7, 12, 16, 12, 7], drums: 'x.h.s.h.x.h.s.h.' },
};
let musicTimer = null, current = null, step = 0, nextT = 0;
export function music(name) {
  if (name === current) return;
  stopMusic(); current = name;
  if (!ctx || !name || !state().settings.music) return;
  const tr = TRACKS[name] || TRACKS.menu; step = 0; nextT = ctx.currentTime + 0.05;
  const sixteenth = 60 / tr.bpm / 4;
  musicTimer = setInterval(() => {
    while (nextT < ctx.currentTime + 0.15) {
      const bar = Math.floor(step / 16) % tr.prog.length, s = step % 16, root = tr.prog[bar];
      const delay = Math.max(0, nextT - ctx.currentTime);
      if (s % 2 === 0) tone(N(root + tr.arp[(s / 2) % 8]), sixteenth * 1.8, { type: tr.lead, vol: 0.09, delay, bus: musicBus });
      if (s % 4 === 0) tone(N(root - 12), sixteenth * 3.5, { type: tr.bass, vol: 0.14, delay, bus: musicBus });
      const d = tr.drums[s];
      if (d === 'x') { tone(110, 0.12, { type: 'sine', vol: 0.5, slide: 0.4, delay, bus: musicBus }); }
      if (d === 's') noise(0.12, { vol: 0.22, freq: 1800, type: 'bandpass', q: 0.8, delay, bus: musicBus });
      if (d === 'h') noise(0.04, { vol: 0.12, freq: 7000, type: 'highpass', delay, bus: musicBus });
      step++; nextT += sixteenth;
    }
  }, 40);
}
export function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = null; current = null; }
export function refreshMusic() { const c = current; stopMusic(); if (c) music(c); }
