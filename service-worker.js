const CACHE_NAME = 'to-do-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'css/style-index.css',
  'js/index.js',
  'manifesto.json', 
  'img/maskable_icon_x192.png',
  'img/maskable_icon_x512.png' 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Fallo en la instalación del caché:', err))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Caché antiguo eliminado:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Respuesta desde caché:', event.request.url);
          return response;
        }
        console.log('Redireccionando a la red:', event.request.url);
        return fetch(event.request);
      })
      .catch(err => console.error('Error al obtener los datos:', err))
  );
});
