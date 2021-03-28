// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBzk6MWgJJcmZNP4oKhp_xCfI8PhTdqRGE",
    authDomain: "actualites-aeronautiques.firebaseapp.com",
    databaseURL: "https://actualites-aeronautiques.firebaseio.com",
    projectId: "actualites-aeronautiques",
    storageBucket: "actualites-aeronautiques.appspot.com",
    messagingSenderId: "972782309534",
    appId: "1:972782309534:web:077f3a128f6053b98c2b8f",
    measurementId: "G-K5R9HDMS6X"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();