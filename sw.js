// Keeps the site's files (styles, code, images, fonts, lessons) on the device, so a second visit opens
// almost instantly. Each file is served from the device first and refreshed in the background, so a
// change shows up on the visit after next (or right away with Ctrl + F5). Pages themselves, videos and
// everything from Supabase always come straight from the network.
const CACHE = 'cc-files-v1';
const CDN = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('cc-files-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.mode === 'navigate' || req.headers.has('range')) return;
  const url = new URL(req.url);
  const mine = url.origin === self.location.origin;
  if (!mine && !CDN.includes(url.hostname)) return;
  if (/\.(mp4|webm|mp3|m4a|pdf)$/i.test(url.pathname) || url.pathname.endsWith('/sw.js')) return;

  e.respondWith(caches.open(CACHE).then(async (cache) => {
    const hit = await cache.match(req);
    const fresh = fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    });
    if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
    return fresh;
  }));
});
