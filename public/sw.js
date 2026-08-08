const CACHE_NAME = 'halqa-static-v2';
const IMAGE_CACHE = 'halqa-images-v2';
const API_CACHE = 'halqa-api-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
];

// Install Event - Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static app shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE && cacheName !== API_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Handle intercept and caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests or browser extension requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: Prayer Timings API and other APIs (Network First, with Fallback to Cache)
  if (url.hostname.includes('api.aladhan.com') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Serving API request from cache:', url.pathname);
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy 2: Images (Cache First, with Network Fallback & update cache)
  const isImage = 
    request.destination === 'image' || 
    url.hostname.includes('images.unsplash.com') ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i);

  if (isImage) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache, but fetch fresh image in background to update cache (Stale-While-Revalidate)
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(IMAGE_CACHE).then((cache) => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch((err) => console.log('[Service Worker] Background fetch failed for image:', url.href, err));
          return cachedResponse;
        }

        // Not in cache, fetch from network and put in cache
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200 || networkResponse.type === 'opaque') {
              const responseClone = networkResponse.clone();
              caches.open(IMAGE_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            return new Response('Offline', { status: 404 });
          });
      })
    );
    return;
  }

  // Strategy 3: App Shell & Static Assets (Network First, falling back to Cache)
  // This is highly resilient, ensuring that the latest edits from AI Studio are fetched immediately,
  // while offline support works perfectly when connection is lost.
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache valid responses
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        console.log('[Service Worker] Serving static asset from cache:', url.pathname);
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If the root or index page fails and isn't matched exactly, fallback to root
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline content unavailable', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        });
      })
  );
});

// ================= PRAYER NOTIFICATION SERVICE WORKER LOGIC =================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL('/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_PRAYER_NOTIFICATION') {
    const { title, body, tag, icon } = event.data;
    self.registration.showNotification(title || '🕌 Time for Prayer', {
      body: body || 'Prayer time alert from Halqa.',
      icon: icon || '/splash.jpg',
      badge: '/splash.jpg',
      tag: tag || 'prayer-alert',
      renotify: true,
      vibrate: [300, 100, 300, 100, 300],
      data: { url: '/' }
    });
  }
});
