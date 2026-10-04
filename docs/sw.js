// Offline cache: the whole game works without internet after the first visit (multiplayer needs internet).
const VERSION = 'cc-v1';
const CORE = [
  './',
  "css/style.css",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "index.html",
  "js/content/bank.js",
  "js/content/generators.js",
  "js/content/syllabus.js",
  "js/core/audio.js",
  "js/core/engine.js",
  "js/core/net.js",
  "js/core/questions.js",
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
  "js/main.js",
  "manifest.webmanifest",
  "vendor/peerjs.min.js",
];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('peerjs')) return; // never cache multiplayer signalling
  // network-first for our own files (so updates arrive), falling back to cache offline; cache-first for fonts
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('./'))));
  } else if (url.hostname.includes('fonts.g')) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })));
  }
});
