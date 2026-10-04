// Text-to-speech used by lessons and reels.
// Turn slide/caption HTML into what the voice should say: no emoji or decoration symbols, pauses between
// list items and table cells, and symbols read as words (m² → square metres, 5–14 → 5 to 14, /unit → per unit).
const BLOCKS = 'p,li,tr,h1,h2,h3,h4,div,section,ol,ul,table,summary,details,br';
export function speakable(html) {
  const div = document.createElement('div'); div.innerHTML = String(html);
  div.querySelectorAll('.pic, .reveal-tip, script, style').forEach(e => e.remove());
  div.querySelectorAll('td, th').forEach(e => e.append(', '));
  div.querySelectorAll(BLOCKS).forEach(e => e.append('. '));
  let t = div.textContent;
  t = t.replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\u{1F3FB}-\u{1F3FF}️‍⃣]/gu, ' ')
    .replace(/[★☆✔✓✘✗•◆◇▶◀▲▼►◄■□●○◉⏩⏪⏸⏹❌⭕❗❓❕❔✦✧❖※]/g, ' ')
    .replace(/m²/g, ' square metres').replace(/m³/g, ' cubic metres').replace(/²/g, ' squared').replace(/³/g, ' cubed')
    .replace(/(\d)\s*[–—]\s*(\d)/g, '$1 to $2')
    .replace(/↑/g, ' up ').replace(/↓/g, ' down ').replace(/[→⇒➜]/g, ', then, ').replace(/←/g, ' from ').replace(/↔/g, ' or ')
    .replace(/\/\s?(unit|hr|hour|kg|kilogram|day|month|year|week|litre|metre|item|employee|order|batch|machine hour|labour hour)s?\b/gi, ' per $1')
    .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/≈/g, ' about ').replace(/≥/g, ' at least ').replace(/≤/g, ' at most ').replace(/≠/g, ' is not ')
    .replace(/%/g, ' percent ').replace(/\be\.g\./g, 'for example').replace(/\bi\.e\./g, 'that is').replace(/&/g, ' and ')
    .replace(/\bFOH\b/g, 'fixed overhead').replace(/\bVOH\b/g, 'variable overhead').replace(/\bVC\b/g, 'variable cost').replace(/\bBEP\b/g, 'break-even point')
    .replace(/\bMoS\b/g, 'margin of safety').replace(/\bOAR\b/g, 'O A R').replace(/\bC\/S\b/g, 'C S').replace(/\bP\/V\b/g, 'P V').replace(/(\d)\s?\(?F\)?(?![A-Za-z])/g, '$1 favourable').replace(/(\d)\s?\(?[UA]\)?(?![A-Za-z])/g, '$1 unfavourable')
    .replace(/[_*#~^|<>{}\[\]]/g, ' ')
    .replace(/\s*([.,!?;:])(\s*[.,;:])+/g, '$1').replace(/,\s*$/, '.').replace(/\s+([.,!?;:])/g, '$1').replace(/^[\s.,]+/, '').replace(/\s+/g, ' ').trim();
  return t;
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

