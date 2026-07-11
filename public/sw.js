const CACHE_NAME = 'testpilot-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Add minimum necessary files to cache
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icon.svg'
      ]).catch((err) => {
        console.warn('Failed to cache files during install', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Allow normal browser behavior for non-GET requests or cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found, else fetch from network
      return response || fetch(event.request).then((fetchResponse) => {
        // Optionally cache new requests here
        return fetchResponse;
      }).catch(() => {
        // Fallback for offline if fetching fails (can add offline.html)
      });
    })
  );
});
