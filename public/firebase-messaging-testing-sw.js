importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')

var firebaseConfig = {
    apiKey: "AIzaSyAky6lbF6BoF5aIldaFT7Z1ESmjv0YfIe8",
    authDomain: "testproject-9f1d2.firebaseapp.com",
    projectId: "testproject-9f1d2",
    storageBucket: "testproject-9f1d2.appspot.com",
    messagingSenderId: "729394449872",
    appId: "1:729394449872:web:2041a87a7a3243676b7dd5",
    measurementId: "G-Y7NMJKBRKE"
 }; 

const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging();

console.log('serviceworkerinitialized');

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