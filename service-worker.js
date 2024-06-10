const CACHE_NAME = 'project-hub-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/stylesheet.css',
    '/games'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache)
                    .then(function () {
                        console.log('Preloaded and cached URLs:');
                        return Promise.all(urlsToCache.map(url => {
                            return cache.match(url).then(response => {
                                console.log('- ' + url);
                                return response;
                            });
                        }));
                    })
                    .catch(function (error) {
                        console.error('Cache.addAll failed:', error);
                    });
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }

                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                ).catch(function (error) {
                    console.error('Fetch failed:', error);
                    // You can customize the response for failed fetch requests here
                });
            })
    );
});

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
