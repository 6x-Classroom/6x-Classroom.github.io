const CACHE_NAME = 'project-hub-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/stylesheet.css',
    '/games',
    'img/header.png',
    'games/img/cookclck.png',
    'games/img/2048.png',
    'games/img/mario.png',
    'games/img/flappybird.png',
    'games/img/tetris.png',
    'games/img/worldshardestgame.png',
    'games/img/impossiblequiz.png',
    'games/img/sonic.png',
    'games/img/supermario63.png',
    'games/img/breakingthebank.png',
    'games/img/escapingtheprison.png',
    'games/img/stealingthediamond.png',
    'games/img/infiltratingtheairship.png',
    'games/img/fleeingthecomplex.png',
    'games/img/slope.png',
    'games/img/fridaynightfunkin.png',
    'games/img/solitaire.png',
    'games/img/wordle.png',
    'games/img/riddleschool1.png',
    'games/img/riddleschool2.png',
    'games/img/riddleschool3.png',
    'games/img/riddleschool4.png',
    'games/img/riddleschool5.png',
    'games/img/riddletransfer1.png',
    'games/img/riddletransfer2.png',
    'games/img/meatboy.png',
    'games/img/papasburgeria.png',
    'games/img/papasfreezeria.png',
    'games/img/papaspizzeria.png',
    'games/img/papaspancakeria.png',
    'games/img/papaspastaria.png',
    'games/img/bloonstd5.png',
    'games/img/supersmashflash.png',
    'games/img/stickmanhook.png',
    'games/img/1v1lol.png',
    'games/img/blockpost.png',
    'games/img/rocketsoccer.png',
    'games/img/resentclient.png',
    'games/img/minecraft.png',
    'games/img/craftmine.png',
    'games/img/run1.png',
    'games/img/run2.png',
    'games/img/run3.png',
    'games/img/supermariobros.png',
    'games/img/subwaysurferssanfransisco.png',
    'games/img/subwaysurferszurich.png',
    'games/img/templerun2.png',
    'games/img/drawthehill.png',
    'games/img/crossyroad.png',
    'games/img/cuttherope.png',
    'games/img/cuttheropetimetravel.png',
    'games/img/cuttheropeholidaygift.png',
    'games/img/stack.png',
    'games/img/paperio2.png',
    'games/img/jetpackjoyride.png',
    'games/img/fruitninja.png',
    'games/img/bitlife.png',
    'games/img/dune.png',
    'games/img/paperyplanes.png',
    'games/img/pokemonfirered.png',
    'games/img/pokemonemerald.png',
    'games/img/animalcrossingwildworld.png',
    'games/img/thebindingofisaac.png',
    'games/img/superscribblenauts.png',
    'games/img/placeholder.png',
    'games/img/fnaf4.png',
    'games/img/douchebaglife.png',
    'games/img/douchebagworkout2.png',
    'games/img/ducklife1.png',
    'games/img/ducklife2.png',
    'games/img/ducklife3.png',
    'games/img/ducklife4.png',
    'games/img/supermario64.png',
    'games/img/aceattorney.png',
    'games/img/learntofly1.png',
    'games/img/learntofly2.png',
    'games/img/learntofly3.png',
    'games/img/motox3m.png',
    'games/img/motox3m2.png',
    'games/img/thereisnogame.png',
    'games/img/superhot.png',
    'games/img/fireboywatergirl1.png',
    'games/img/fireboywatergirl2.png',
    'games/img/fireboywatergirl3.png',
    'games/img/fireboywatergirl4.png',
    'games/img/happywheels.png',
    'games/img/monopoly.png',
    'games/img/spyroadventure.png',
    'games/img/streetfighter2.png',
    'games/img/bloxorz.png',
    'games/img/transcube.png',
    'games/img/portalflash.png',
    'games/img/stormthehouse2.png',
    'games/img/googledino.png',
    
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache)
                    .then(function () {
                        // console.log('Preloaded and cached URLs:');
                        return Promise.all(urlsToCache.map(url => {
                            return cache.match(url).then(response => {
                                // console.log('- ' + url);
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
