importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC6kC5bmGWXABBingqsoEf_D6ArMvED3JA',
  authDomain: 'artemo-1487c.firebaseapp.com',
  projectId: 'artemo-1487c',
  storageBucket: 'artemo-1487c.firebasestorage.app',
  messagingSenderId: '286318600863',
  appId: '1:286318600863:web:f033f29f43cac221a9b8aa',
  measurementId: 'G-WMQFD91JQ6',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification?.title || 'Artemo';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/artemo-logo.png',
    badge: '/artemo-logo.png',
    data: payload.data || {},
    actions: payload.data?.action_url
      ? [{ action: 'open', title: 'Voir' }]
      : [],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open the app at the action_url
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data?.action_url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
