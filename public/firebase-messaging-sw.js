importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')

var firebaseConfig = {
    "apiKey": "AIzaSyCVkPBaPZn1OcvS0aqJhhqMhqwtor25jLs",
    "authDomain": "almoosa-b64e4.firebaseapp.com",
    "databaseURL": "https://almoosa-b64e4.firebaseio.com",
    "projectId": "almoosa-b64e4",
    "storageBucket": "almoosa-b64e4.appspot.com",
    "messagingSenderId": "292865223692",
    "appId": "1:292865223692:web:07d2b5370a0c80b0a15229",
    "measurementId": "G-TVYDCJG6GS"
};

const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Background Notification ', payload.notification);

    // Customize notification here
    // const notificationTitle = 'Background Message Title';
    // const notificationOptions = {
    //     body: 'Background Message body.',
    //     icon: './profile.png'
    // };
    // self.registration.showNotification(notificationTitle,
    //     notificationOptions);
});