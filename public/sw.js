// Nombre de la caché dinámica
const CACHE_NAME = 'dynamic-v5';

// Evento de instalación del Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker instalado');
    // No es necesario cachear recursos estáticos aquí
});

// Evento de activación del Service Worker
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
    console.log('Caché actualizada y cachés obsoletas eliminadas');
});

// Evento de interceptación de solicitudes
self.addEventListener('fetch', event => {
    // Verifica si la solicitud es para Firebase Firestore o Firebase Authentication
    const isFirebaseRequest = event.request.url.includes('firestore.googleapis.com') ||
                              event.request.url.includes('identitytoolkit.googleapis.com');

    if (event.request.method === 'GET' && !isFirebaseRequest) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    // Si el recurso está en la caché, lo devuelve
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Si el recurso no está en la caché, lo solicita a la red
                    return fetch(event.request)
                        .then(networkResponse => {
                            return caches.open(CACHE_NAME).then(cache => {
                                // Almacena en la caché una copia del recurso recuperado de la red
                                cache.put(event.request, networkResponse.clone());
                                return networkResponse;
                            });
                        })
                        .catch(error => {
                            console.error('Error en la solicitud de red:', error);
                            // Opcional: Devuelve un recurso por defecto o maneja el error de otra manera
                        });
                })
        );
    } else {
        // Permite que las solicitudes a Firebase y otros métodos (POST, PUT, etc.) se manejen normalmente por el navegador
        event.respondWith(fetch(event.request));
    }
});
