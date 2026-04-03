const CACHE_NAME = "pwa-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./script.js",
  "./image/192.png",
  "./image/512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Claim all pages immediately
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response =>{
      return response || fetch(e.request);
    })
  );
});