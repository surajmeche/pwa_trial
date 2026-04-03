const CACHE_NAME = "pwa-cache-" + new Date().getTime(); // Dynamic cache name for auto-update
const STATIC_CACHE = "pwa-static-v1";

const ASSETS = [
  "./image/192.png",
  "./image/512.png",
  "./manifest.json",
  "./script.js"
];

// Install
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - Clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          // Delete old cache versions
          if (name !== STATIC_CACHE && !name.includes("pwa-cache")) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Network-first for HTML, cache-first for assets
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Network-first for HTML (always check server first)
  if (request.headers.get("accept")?.includes("text/html")) {
    e.respondWith(
      fetch(request)
        .then(res => {
          // Cache successful responses
          if (res.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then(c => c.put(request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(request)) // Fallback to cache if offline
    );
  } else {
    // Cache-first for assets
    e.respondWith(
      caches.match(request)
        .then(res => res || fetch(request))
        .catch(() => new Response("Offline - Resource not available", { status: 503 }))
    );
  }
});