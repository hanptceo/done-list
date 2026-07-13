/* Minimal service worker for installability + offline shell */
const CACHE = 'donelist-v1';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './js/main.js',
  './js/header.js',
  './js/store.js',
  './js/utils.js',
  './js/modals.js',
  './js/views/home.js',
  './js/views/weekly.js',
  './js/views/monthly.js',
  './js/views/routines.js',
  './js/views/settings.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networked = fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
      return cached || networked;
    })
  );
});
