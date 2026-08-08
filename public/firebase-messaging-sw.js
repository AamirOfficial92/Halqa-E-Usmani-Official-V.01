// Firebase Cloud Messaging (FCM) Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCzz-SCN87EoqX5EYpbgwbI2nsN05nHZDc",
  authDomain: "halqa-e-usmania-official.firebaseapp.com",
  projectId: "halqa-e-usmania-official",
  storageBucket: "halqa-e-usmania-official.firebasestorage.app",
  messagingSenderId: "1037156192106",
  appId: "1:1037156192106:web:84e95e5b42c53cf7199f13"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background FCM message received:', payload);
  const notificationTitle = payload.notification?.title || 'حلقہ عثمانیہ آفیشل - Halqa-e-Usmania';
  const notificationOptions = {
    body: payload.notification?.body || 'نئی اپ ڈیٹ یا پیغام حاصل ہوا ہے',
    icon: '/splash.jpg',
    badge: '/splash.jpg',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
