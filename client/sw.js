// Vanilla service worker (no workbox)
const CACHE_NAME = 'cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/index.js',
  // './src/js/index.js',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
  '/images/icon.png',
];

// The three phases of the service worker's life cycle are:
// 1. install
// 2. activate
// 3. claim

// Install - the service worker is first installed and then activated.
self.addEventListener('install', (e) =>
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  )
);

// Activate - the service worker is activated after install.
self.addEventListener('activate', (e) =>
  e.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  )
);

// Claim - the service worker is claimed after install.
// When a service worker is initially registered, pages won't use it until the next load.
// The clients.claim() method is used to claim the service worker immediately.
self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// Example of a simple cache-first network-first strategy
// The service worker is checking the cache for a response and if it doesn't find it, it fetches it.
self.addEventListener('fetch', (e) =>
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)))
);


import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Import the expiration plugin
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

const cacheName = 'static-resources';
const matchCallback = ({ request }) => {
  console.log(request);
  return (
    // CSS
    request.destination === 'style' ||
    // JavaScript
    request.destination === 'script'
  );
};

registerRoute(
  matchCallback,
  new StaleWhileRevalidate({
    cacheName,
    plugins: [
  new CacheableResponsePlugin({
      statuses: [0, 200],
      }),
    ],
  })
);

// Register route for caching images
// The cache first strategy is often the best choice for images because it saves bandwidth and improves performance.
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'my-image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);