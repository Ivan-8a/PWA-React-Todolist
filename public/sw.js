self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v3').then(cache => {
            return cache.addAll([
                '/assets/index-EaOiIkjv.js',
                '/assets/manifest-BeEqWxP6.json',
                '/index.html',
                '/pwa-128x128.png',
                '/pwa-512x512.png'
            ]).catch(error => {
                console.error('Error al agregar archivos a la cache:', error);
            });
        })
    );
    console.log('Service Worker instalado y caché registrada');
});
