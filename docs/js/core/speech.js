// Text-to-speech used by lessons and reels.
// ── text-to-speech
export function speakable(html) {
  const div = document.createElement('div'); div.innerHTML = html;
  return div.textContent.replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/→/g, ', then, ').replace(/≈/g, ' about ')
    .replace(/%/g, ' percent ').replace(/\be\.g\./g, 'for example').replace(/&/g, ' and ').replace(/\bFOH\b/g, 'fixed overhead').replace(/\bVC\b/g, 'variable cost')
    .replace(/\bBEP\b/g, 'break-even point').replace(/\bMoS\b/g, 'margin of safety').replace(/\bOAR\b/g, 'O A R').replace(/[⚠️🐷💰🍋]/gu, '').replace(/\s+/g, ' ').trim();
}
let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const vs = speechSynthesis.getVoices();
  return vs.find(v => /en-AU/i.test(v.lang)) || vs.find(v => /en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => { voice = pickVoice(); };
export function speak(text, onend, quietFail = false, onword = null) {
  if (!('speechSynthesis' in window)) { if (!quietFail) alert('Sorry, this browser can\'t read aloud.'); if (onend) setTimeout(onend, 2500); return; }
  speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); voice = voice || pickVoice(); if (voice) u.voice = voice;
  u.rate = 0.95; u.pitch = 1.1; u.onend = onend; u.onerror = () => onend && onend(); if (onword) u.onboundary = e => { if (e.name !== 'sentence') onword(e); };
  speechSynthesis.speak(u);
}
export const hush = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };

