const CACHE_NAME = 'to-do-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'css/style-index.css',
  'js/index.js',
  '/offline.html', 
  'manifesto.json',
  'img/maskable_icon_x192.png',
  'img/maskable_icon_x512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados correctamente.');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Fallo al cachear archivos:', err);
        throw err; 
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => {
      console.log('Caché actualizado correctamente.');
      return self.clients.claim(); 
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'ver') {
    clients.openWindow('/notificaciones'); 
  } else {
    clients.openWindow('/'); 
  }
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith('http')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('Respuesta desde caché:', event.request.url);
          return cachedResponse;
        }

        console.log('Redireccionando a la red:', event.request.url);
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clonedResponse);
            });

            return networkResponse;
          });
      })
      .catch(err => {
        console.error('Error al obtener los datos:', err);

        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        } else if (event.request.destination === 'image') {
          return caches.match('img/maskable_icon_x192.png');
        }
      })
  );
});

// if ('Notification' in window) {
//   if (Notification.permission === 'granted') {
//     navigator.serviceWorker.ready.then(registration => {
//       registration.showNotification('Notificación de prueba', {
//         body: '¡Hola! Esta es una prueba de notificación.',
//         icon: '/img/maskable_icon_x192.png',
//         actions: [
//           { action: 'ver', title: 'Ver detalles' },
//           { action: 'cerrar', title: 'Cerrar' }
//         ],
//         requireInteraction: true
//       });
//     });
//   } else if (Notification.permission === 'default') {
//     Notification.requestPermission().then(permission => {
//       if (permission === 'granted') {
//         navigator.serviceWorker.ready.then(registration => {
//           registration.showNotification('Notificación de prueba', {
//             body: '¡Hola! Esta es una prueba de notificación.',
//             icon: '/img/maskable_icon_x192.png',
//             actions: [
//               { action: 'ver', title: 'Ver detalles' },
//               { action: 'cerrar', title: 'Cerrar' }
//             ],
//             requireInteraction: true
//           });
//         });
//       } else {
//         console.error('Permiso denegado o no otorgado.');
//       }
//     });
//   } else {
//     console.warn('El usuario bloqueó las notificaciones.');
//   }
// } else {
//   console.error('Notificaciones no soportadas en este navegador.');
// }


if ('Notification' in self) {
  self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notificación sin título';
    const options = {
      body: data.body || 'Mensaje sin contenido.',
      icon: '/img/maskable_icon_x192.png',
      actions: data.actions || [
        { action: 'ver', title: 'Ver detalles' },
        { action: 'cerrar', title: 'Cerrar' }
      ],
      requireInteraction: true 
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
}

function guardarEnIndexedDB(data) {
  const request = indexedDB.open('MiApp', 1);

  request.onupgradeneeded = event => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('notificaciones')) {
      db.createObjectStore('notificaciones', { keyPath: 'id', autoIncrement: true });
    }
  };

  request.onsuccess = event => {
    const db = event.target.result;
    const transaction = db.transaction('notificaciones', 'readwrite');
    const store = transaction.objectStore('notificaciones');
    store.add(data);
    console.log('Datos guardados en IndexedDB:', data);
  };

  request.onerror = event => {
    console.error('Error al abrir IndexedDB:', event.target.error);
  };
}

self.addEventListener('activate', event => {
  console.log('Service Worker activado');
  self.registration.showNotification('¡Servicio activado!', {
    body: 'Ahora puedes recibir notificaciones incluso offline.',
    icon: '/img/maskable_icon_x192.png',
    requireInteraction: true
  });
});
