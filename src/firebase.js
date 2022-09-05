import firebase from 'firebase/app'
import 'firebase/firebase-messaging'

var firebaseConfig = {
    "apiKey": "AIzaSyCVkPBaPZn1OcvS0aqJhhqMhqwtor25jLs",
    "authDomain": "almoosa-b64e4.firebaseapp.com",
    "databaseURL": "https://almoosa-b64e4.firebaseio.com",
    "projectId": "almoosa-b64e4",
    "storageBucket": "almoosa-b64e4.appspot.com",
    "messagingSenderId": "292865223692",
    "appId": "1:292865223692:web:07d2b5370a0c80b0a15229",
    "measurementId": "G-TVYDCJG6GS"
}

firebase.initializeApp(firebaseConfig);

export default firebase.messaging()