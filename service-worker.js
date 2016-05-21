'use strict';

const DEBUG = false;

const cacheName = 'app-assets-<%= version %>-<%= commit %>';

const assetUrls = [
    'bower_components/aws-sdk.js',
    'bower_components/document-register-element.js',
    'bower_components/system.js',
    'components/maenad-aws-importer/js/maenad-aws-importer.js',
    'components/maenad-aws-song-importer/css/maenad-aws-song-importer.css',
    'components/maenad-aws-song-importer/js/maenad-aws-song-importer.js',
    'components/maenad-configuration-manager/css/maenad-configuration-manager.css',
    'components/maenad-configuration-manager/js/maenad-configuration-manager.js',
    'components/maenad-configuration-provider/css/maenad-configuration-provider.css',
    'components/maenad-configuration-provider/js/maenad-configuration-provider.js',
    'components/maenad-loader/js/maenad-loader.js',
    'components/maenad-loader/js/template.js',
    'components/maenad-player/css/maenad-player.css',
    'components/maenad-player/js/maenad-player.js',
    'components/maenad-player-notification/css/maenad-player-notification.css',
    'components/maenad-player-notification/js/maenad-player-notification.js',
    'components/maenad-song-item/css/maenad-song-item.css',
    'components/maenad-song-item/js/maenad-song-item.js',
    'components/maenad-song-list/js/maenad-song-list.js',
    'css/default-theme/main.css',
    'js/config.js',
    'js/index.js',
    'js/load.js',
    'js/play.js',
    'lib/config.js',
    'lib/data.js',
    'lib/db-main.js',
    'lib/db.js',
    'lib/id3-43081j.js',
    'lib/register-element.js',
    'lib/s3.js',
    'lib/service-worker-helpers.js',
    'lib/song.js',
    'lib/sw.js',
    'config.html',
    'index.html',
    'load.html',
    'play.html',
    '/'
];

self.addEventListener('install'  , installHandler);
self.addEventListener('activate' , activateHandler);
self.addEventListener('fetch'    , fetchHandler);

// installHandler :: ExtendableEvent -> undefined
function installHandler(e) {
    log('install: ', e);

    e.waitUntil(caches.open(cacheName)
                      .then(cache => Promise.all(assetUrls.map(url => cache.add(url)))));
}

// activateHandler :: ExtendableEvent -> undefined
function activateHandler(e) {
    log('activate: ', e);

    e.waitUntil(caches.keys()
                      .then(cacheList => Promise.all(cacheList.filter(c => c !== cacheName)
                                                              .map(c => caches.delete(c)))));
}

// fetchHandler :: FetchEvent -> undefined
function fetchHandler(e) {
    log('fetch: ', e);

    e.respondWith(respondFromCacheOrNetwork(e));
}

// log :: ...String -> undefined
function log(...msg) {
    if (DEBUG) console.apply(console, msg);
}

// respondFromCacheOrNetwork :: FetchEvent -> Promise<Response>
function respondFromCacheOrNetwork(e) {
    return caches.open(cacheName)
                 .then(cache => cache.match(e.request))
                 .then(logCacheResult)
                 .then(response => response || fetch(e.request));

    // logCacheResult :: Response || undefined -> Response || undefined
    function logCacheResult(response) {
        log(e.request.method, ' ', e.request.url, ' served from ', response ? 'cache' : 'network');

        return response;
    }
}
