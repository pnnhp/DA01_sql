// Cloud sync between your devices, using a private (secret) GitHub Gist in YOUR GitHub account.
// No extra server: each device keeps its own copy, and on every sync the two copies are MERGED
// (nothing learned on either device is lost). The access token stays on the device and only has
// the "gist" permission; it is never part of the save code.
import { state, adopt, onSave } from './store.js';

const KEY = 'costcommando.sync';
const FILE = 'cost-commando-progress.json';
const API = 'https://api.github.com';
let cfg = loadCfg(), busy = null, timer = null, listeners = [];

function loadCfg() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
function saveCfg() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { /* ignore */ } listeners.forEach(f => f(status())); }
export const onSyncStatus = fn => listeners.push(fn);
export const status = () => ({ on: !!(cfg.token && cfg.gistId), last: cfg.last || 0, error: cfg.error || '', login: cfg.login || '' });

async function api(path, opts = {}, token = cfg.token) {
  const r = await fetch(API + path, { ...opts, headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(opts.body ? { 'Content-Type': 'application/json' } : {}), ...(opts.headers || {}) }, cache: 'no-store' });
  if (r.status === 401) throw new Error('GitHub says the token is wrong or expired. Make a new one and connect again.');
  if (r.status === 403 || r.status === 404) throw new Error('GitHub refused (check the token has the "gist" permission).');
  if (!r.ok) throw new Error(`GitHub error ${r.status}`);
  return r.status === 204 ? null : r.json();
}

// Connect this device: find the progress gist in the account (made by another device) or create it.
export async function connect(token) {
  token = String(token || '').trim();
  if (!/^(ghp_|github_pat_|gho_)[A-Za-z0-9_]{20,}$/.test(token)) throw new Error('That doesn\'t look like a GitHub token (it starts with ghp_ or github_pat_).');
  const me = await api('/user', {}, token);
  let gistId = null;
  for (let page = 1; page <= 5 && !gistId; page++) {
    const list = await api(`/gists?per_page=100&page=${page}`, {}, token);
    const g = list.find(x => x.files && x.files[FILE]); if (g) gistId = g.id;
    if (list.length < 100) break;
  }
  if (!gistId) {
    const g = await api('/gists', { method: 'POST', body: JSON.stringify({ description: 'Cost Commando progress (synced between my devices)', public: false, files: { [FILE]: { content: JSON.stringify(state()) } } }) }, token);
    gistId = g.id;
  }
  cfg = { token, gistId, login: me.login, last: 0, error: '' }; saveCfg();
  return syncNow('connect');
}
export function disconnect() { cfg = {}; saveCfg(); }

async function readRemote() {
  const g = await api(`/gists/${cfg.gistId}`);
  const f = g.files && g.files[FILE]; if (!f) return null;
  let text = f.content;
  if (f.truncated && f.raw_url) text = await (await fetch(f.raw_url, { cache: 'no-store' })).text();
  try { return JSON.parse(text); } catch (e) { return null; }
}

// Pull → merge → push. Returns { pulled: true if the other device had new progress }.
export function syncNow(reason = '') {
  if (!cfg.token || !cfg.gistId) return Promise.resolve({ off: true });
  if (busy) return busy;
  busy = (async () => {
    try {
      const remote = await readRemote();
      const pulled = remote ? adopt(remote) : false;
      const local = JSON.stringify(state());
      if (!remote || local !== JSON.stringify(remote)) await api(`/gists/${cfg.gistId}`, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: local } } }) });
      cfg.last = Date.now(); cfg.error = ''; saveCfg();
      return { pulled, reason };
    } catch (e) {
      cfg.error = navigator.onLine === false ? 'Offline: will sync when you\'re back online.' : e.message; saveCfg();
      return { error: cfg.error };
    } finally { busy = null; }
  })();
  return busy;
}

// Automatic: on start, when the app comes back to the screen, when going online, and ~15 s after changes.
export function startAutoSync(onPulled) {
  const run = async why => { const r = await syncNow(why); if (r && r.pulled && onPulled) onPulled(); };
  onSave(() => { if (!cfg.token) return; clearTimeout(timer); timer = setTimeout(() => run('save'), 15000); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') run('resume'); else if (cfg.token) { clearTimeout(timer); syncNow('hide'); } });
  window.addEventListener('online', () => run('online'));
  setInterval(() => { if (document.visibilityState === 'visible') run('tick'); }, 5 * 60 * 1000);
  run('start');
}
