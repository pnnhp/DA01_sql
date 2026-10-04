// Offline cache: the whole game works without internet after the first visit (multiplayer needs internet).
const VERSION = 'cc-v6';
const CORE = [
  './',
  "css/style.css",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/lily.svg",
  "index.html",
  "js/book/book.js",
  "js/content/bank.js",
  "js/content/book/index.js",
  "js/content/book/m1.js",
  "js/content/book/m2.js",
  "js/content/book/m3.js",
  "js/content/book/m4.js",
  "js/content/book/m5.js",
  "js/content/book/m6.js",
  "js/content/book/m7.js",
  "js/content/generators.js",
  "js/content/syllabus.js",
  "js/core/audio.js",
  "js/core/engine.js",
  "js/core/net.js",
  "js/core/questions.js",
  "js/core/speech.js",
  "js/core/store.js",
  "js/games/boss.js",
  "js/games/factory.js",
  "js/games/ninja.js",
  "js/games/royale.js",
  "js/games/runner.js",
  "js/games/rush.js",
  "js/games/strike.js",
  "js/games/tanks.js",
  "js/games/tycoon.js",
  "js/games/warehouse.js",
  "js/lessons/index.js",
  "js/lessons/m1.js",
  "js/lessons/m2.js",
  "js/lessons/m3.js",
  "js/lessons/m4.js",
  "js/lessons/m5.js",
  "js/lessons/m6.js",
  "js/lessons/m7.js",
  "js/lessons/player.js",
  "js/main.js",
  "js/reels/emoji.js",
  "js/reels/lily-svg.js",
  "js/reels/lily.js",
  "js/reels/reels.js",
  "manifest.webmanifest",
  "vendor/lottie_light.min.js",
  "vendor/peerjs.min.js",
];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== 'cc-media').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('peerjs')) return; // never cache multiplayer signalling
  // network-first for our own files (so updates arrive), falling back to cache offline; cache-first for fonts
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('./'))));
  } else if (url.pathname.includes('/notoemoji/')) { // Lily's animated illustrations: keep across app updates
    e.respondWith(caches.open('cc-media').then(c => c.match(req).then(r => r || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }))));
  } else if (url.hostname.includes('fonts.g')) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })));
  }
});
