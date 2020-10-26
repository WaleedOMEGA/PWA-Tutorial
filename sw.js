const staticChacheName = 'site-static-v2';
const dynamicCache = 'site-dynamic-v1';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
]
// install service worker
self.addEventListener('install', evt => {
    // console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticChacheName).then(cache => {
            console.log('caching assets')
            cache.addAll(assets);
        })
    );
    
});
// activate service worker
self.addEventListener('activate', evt => {
    console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(
            keys => {
                return Promise.all(
                    keys.filter(key => key !== staticChacheName)
                        .map(key => caches.delete(key))
                )
            }
        )
    )
});
// fetch events
self.addEventListener('fetch', evt => {
    // console.log('fetch events',evt)
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        })
    )
});