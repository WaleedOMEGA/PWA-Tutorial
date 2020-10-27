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
    'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
    '/pages/fallback.html'
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

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]);
            }
        })
    });
}

// activate service worker
self.addEventListener('activate', evt => {
    console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(
            keys => {
                return Promise.all(
                    keys.filter(key => key !== staticChacheName && key !== dynamicCache)
                        .map(key => caches.delete(key))
                )
            }
        )
    )
});
// fetch events
self.addEventListener('fetch', evt => {
    // console.log('fetch events',evt)
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    limitCacheSize(dynamicCache,15)
                    return fetchRes;
                })
            });
        }).catch(() => {
            if (evt.request.url.indexOf('.html') > -1) {
                return caches.match('/pages/fallback.html')
            }
        })
    )
    }
    
});