import firebase from 'firebase/app'
import 'firebase/firebase-messaging'

var firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);
let messaging = null;
if ('serviceWorker' in navigator) {
    let mode = process.env.NODE_ENV === 'production' ? 'prod' : 'testing'
    navigator.serviceWorker.register('/firebase-messaging-' + mode + '-sw.js')
        .then((registration) => {
            firebase.messaging().useServiceWorker(registration);
        });
}
console.log('firebase sdk supported', firebase.messaging.isSupported())
if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
}
export default messaging