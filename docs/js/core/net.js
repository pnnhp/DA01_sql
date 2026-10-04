// Peer-to-peer multiplayer via WebRTC (PeerJS). No game server needed: the free PeerJS
// broker only introduces the two devices; game data then flows directly between them.
import * as store from './store.js';

const PREFIX = 'costcmd-v1-';
let lib = null;
function loadLib() {
  if (window.Peer) return Promise.resolve(window.Peer);
  if (lib) return lib;
  lib = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = 'vendor/peerjs.min.js';
    s.onload = () => res(window.Peer); s.onerror = () => rej(new Error('Could not load multiplayer library (are you offline?)'));
    document.head.appendChild(s);
  });
  return lib;
}
const makeCode = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');

class Net {
  constructor() { this.peer = null; this.conn = null; this.code = null; this.isHost = false; this.handlers = {}; this.peerName = ''; this.peerSnap = null; }
  status() { return { code: this.code, connected: !!(this.conn && this.conn.open), isHost: this.isHost, peerName: this.peerName }; }
  on(type, fn) { this.handlers[type] = fn; }
  off(type) { delete this.handlers[type]; }
  send(t, d = {}) { if (this.conn && this.conn.open) try { this.conn.send({ t, d }); } catch (e) { /* ignore */ } }

  async host() {
    const Peer = await loadLib(); this.close();
    this.isHost = true;
    for (let attempt = 0; attempt < 3; attempt++) {
      this.code = makeCode();
      try {
        await new Promise((res, rej) => {
          this.peer = new Peer(PREFIX + this.code, { debug: 0 });
          const to = setTimeout(() => rej(new Error('Timed out reaching the matchmaking server')), 12000);
          this.peer.on('open', () => { clearTimeout(to); res(); });
          this.peer.on('error', e => { clearTimeout(to); rej(e); });
        });
        break;
      } catch (e) { if (attempt === 2 || e.type !== 'unavailable-id') throw new Error(e.message || 'Could not create room'); }
    }
    this.peer.on('connection', c => { if (this.conn && this.conn.open) { c.close(); return; } this.attach(c); });
    this.peer.on('error', e => this.onError && this.onError(e.message || String(e)));
    return this.code;
  }

  async join(code) {
    const Peer = await loadLib(); this.close();
    this.isHost = false; this.code = code;
    this.peer = new Peer({ debug: 0 });
    await new Promise((res, rej) => {
      const to = setTimeout(() => rej(new Error('Could not reach your friend. Check the code and that they are still on the lobby screen.')), 15000);
      this.peer.on('open', () => {
        const c = this.peer.connect(PREFIX + code, { reliable: true });
        c.on('open', () => { clearTimeout(to); this.attach(c); res(); });
        c.on('error', e => { clearTimeout(to); rej(e); });
      });
      this.peer.on('error', e => { clearTimeout(to); rej(new Error(e.type === 'peer-unavailable' ? 'No room with that code (is your friend still hosting?)' : (e.message || 'Connection failed'))); });
    });
  }

  attach(c) {
    this.conn = c;
    const hello = () => this.send('hello', store.snapshot());
    if (c.open) hello(); else c.on('open', hello);
    c.on('data', msg => {
      if (!msg || !msg.t) return;
      if (msg.t === 'hello') {
        this.peerName = msg.d.name; this.peerSnap = msg.d; store.upsertFriend(msg.d);
        if (!this.greeted) { this.greeted = true; this.send('hello', store.snapshot()); this.onConnected && this.onConnected(); }
        return;
      }
      if (msg.t === 'start') { this.onStart && this.onStart(msg.d.mode, msg.d.opts || {}); return; }
      const h = this.handlers[msg.t]; if (h) h(msg.d);
    });
    c.on('close', () => { this.handlers.__close && this.handlers.__close(); this.greeted = false; });
  }
  startGame(mode, opts) { this.send('start', { mode, opts }); }
  syncScores() { this.send('hello', store.snapshot()); }
  close() { try { this.conn && this.conn.close(); } catch (e) { /* ignore */ } try { this.peer && this.peer.destroy(); } catch (e) { /* ignore */ } this.conn = null; this.peer = null; this.greeted = false; }
}
export const net = new Net();
