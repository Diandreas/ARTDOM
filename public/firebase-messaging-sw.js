importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the config
firebase.initializeApp({
  apiKey: self.FIREBASE_CONFIG?.apiKey || '{{VITE_FIREBASE_API_KEY}}',
  authDomain: self.FIREBASE_CONFIG?.authDomain || '{{VITE_FIREBASE_AUTH_DOMAIN}}',
  projectId: self.FIREBASE_CONFIG?.projectId || '{{VITE_FIREBASE_PROJECT_ID}}',
  storageBucket: self.FIREBASE_CONFIG?.storageBucket || '{{VITE_FIREBASE_STORAGE_BUCKET}}',
  messagingSenderId: self.FIREBASE_CONFIG?.messagingSenderId || '{{VITE_FIREBASE_MESSAGING_SENDER_ID}}',
  appId: self.FIREBASE_CONFIG?.appId || '{{VITE_FIREBASE_APP_ID}}',
  measurementId: self.FIREBASE_CONFIG?.measurementId || '{{VITE_FIREBASE_MEASUREMENT_ID}}',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
