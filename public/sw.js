const CACHE_NAME = 'halqa-static-v3';
const IMAGE_CACHE = 'halqa-images-v3';
const API_CACHE = 'halqa-api-v3';
const PRAYER_QIBLA_CACHE = 'halqa-prayer-qibla-v3';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/splash.jpg',
  '/app-logo.jpg',
  '/logo.jpg'
];

// Fallback Prayer Timings response if offline and specific URL not cached
const DEFAULT_OFFLINE_PRAYER_JSON = {
  code: 200,
  status: "OK",
  data: {
    timings: {
      Fajr: "04:25",
      Sunrise: "05:48",
      Dhuhr: "12:35",
      Asr: "16:05",
      Sunset: "19:18",
      Maghrib: "19:18",
      Isha: "20:42",
      Imsak: "04:15",
      Midnight: "00:35"
    },
    date: {
      readable: "11 Aug 2026",
      timestamp: "1786450000",
      hijri: {
        day: "27",
        month: { number: 2, en: "Safar", ar: "صفر" },
        year: "1448"
      }
    },
    meta: {
      latitude: 24.8607,
      longitude: 67.0011,
      timezone: "Asia/Karachi"
    }
  }
};

// Install Event - Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static app shell & offline assets');
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
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE && cacheName !== API_CACHE && cacheName !== PRAYER_QIBLA_CACHE) {
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

  // Strategy 1: Prayer Timings & Qibla Data APIs (Stale-While-Revalidate with Offline Fallback)
  if (url.hostname.includes('api.aladhan.com') || url.pathname.includes('/timings') || url.pathname.includes('/calendar')) {
    event.respondWith(
      caches.open(PRAYER_QIBLA_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        // Fetch fresh data in background/foreground
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(async () => {
            console.log('[Service Worker] Offline fallback for Prayer API:', url.href);
            // If specific request is in cache, return it
            if (cachedResponse) return cachedResponse;

            // Otherwise check if any cached prayer response exists in PRAYER_QIBLA_CACHE
            const keys = await cache.keys();
            if (keys.length > 0) {
              const anyCached = await cache.match(keys[0]);
              if (anyCached) return anyCached;
            }

            // Fallback JSON response if completely offline and no match
            return new Response(JSON.stringify(DEFAULT_OFFLINE_PRAYER_JSON), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          });

        // Return cached response instantly if available, otherwise wait for network/fallback
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy 2: General Backend APIs (Network First with Cache Fallback)
  if (url.pathname.startsWith('/api/')) {
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
          console.log('[Service Worker] Serving general API request from cache:', url.pathname);
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy 3: Images (Cache First, with Network Fallback & background update)
  const isImage = 
    request.destination === 'image' || 
    url.hostname.includes('images.unsplash.com') ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i);

  if (isImage) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(IMAGE_CACHE).then((cache) => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

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

  // Strategy 4: App Shell & Static Assets (Network First, falling back to Cache)
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
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
