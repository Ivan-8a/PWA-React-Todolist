self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v2').then(cache => {
            return cache.addAll([
                '/index.html',
                '/src/styles/App.css',
                '/src/styles/index.css',
                '/manifest.json',
                '/pwa-128x128.png',
                '/pwa-512x512.png',
                '/src/components/TodoItem.jsx',
                '/src/components/Auth.jsx',
                '/src/App.jsx',
                '/src/main.jsx'

            ]).catch(error => {
                console.error('Error al agregar archivos a la cache:', error);
            });
        })
    );
    console.log('Service Worker instalado y caché registrada');
});
