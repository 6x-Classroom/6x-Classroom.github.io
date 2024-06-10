// Service Worker Script

// Define the cache name
const CACHE_NAME = 'project-hub-cache-v1';

// Define the URLs to cache
const urlsToCache = [
    '/',
    '/index.html',
    '/stylesheet.css',
    // Add other specific URLs you want to cache here
    '/games/*' // Add the wildcard pattern to cache all URLs under /games/
];

// Install event
self.addEventListener('install', function (event) {
    // Perform installation steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(function () {
                console.log('Preloaded and cached URLs:');
                return Promise.all(urlsToCache.map(url => {
                    return cache.match(url).then(response => {
                        console.log('- ' + url);
                        return response;
                    });
                }));
            })
    );
});

// Fetch event
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Open the cache and add the response
                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Activate event
self.addEventListener('activate', function (event) {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
