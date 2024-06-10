const CACHE_NAME = 'project-hub-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/games.html',
    '/apps.html',
    '/contact.html',
    '/settings.html',
    '/stylesheet.css',
    '/page_styles/games.css',
    'https://www.w3schools.com/w3css/4/w3.css',
    'https://fonts.googleapis.com/css?family=Montserrat&display=swap',
    '/hover.css',
    'https://unpkg.com/aos@next/dist/aos.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://kit.fontawesome.com/4139823eac.js',
    '/img/header.png',
    '/games/img/cookclck.png',
    '/games/img/2048.png',
    '/games/img/mario.png',
    '/startupScript.js',
    '/cookie/index.html',
    '/games/2048/index.html',
    '/games/mario/main.html'
];

// Install the service worker and cache the URLs
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch the resources from the cache, and fall back to network if not available
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Cache miss - fetch from network
                return fetch(event.request);
            }
            )
    );
});

// Activate the new service worker and delete old caches if needed
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
