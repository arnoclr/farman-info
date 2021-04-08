import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/remote-config'

const firebaseConfig = {
  apiKey: "AIzaSyBzk6MWgJJcmZNP4oKhp_xCfI8PhTdqRGE",
  authDomain: "actualites-aeronautiques.firebaseapp.com",
  databaseURL: "https://actualites-aeronautiques.firebaseio.com",
  projectId: "actualites-aeronautiques",
  storageBucket: "actualites-aeronautiques.appspot.com",
  messagingSenderId: "972782309534",
  appId: "1:972782309534:web:077f3a128f6053b98c2b8f",
  measurementId: "G-K5R9HDMS6X"
};

// check cookie consent before init
const consent = JSON.parse(localStorage.getItem('cookie:accepted'))
window.consent = consent
if(consent == false) {
  // https://developers.google.com/analytics/devguides/collection/ga4/disable-analytics
  window['ga-disable-' + firebaseConfig.measurementId] = true;
}

firebase.initializeApp(firebaseConfig)

// firebase utils
const analytics = firebase.analytics()
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
let messaging = null
const remoteConfig = firebase.remoteConfig()

if(firebase.messaging.isSupported()) {
  messaging = firebase.messaging()
}

db.enablePersistence()
  .catch(err => {
    console.error(err)
  })

// firebase collections
const magazines = db.collection('magazines')

// remote config
const sidebar_banners = {
  "magazine": {
    "image": "https://i.imgur.com/yRzHUAO.jpg",
    "link": "#"
  },
  "test": {
    "image": "https://i.imgur.com/aZY7AaX.jpg",
    "link": "#"
  }
}
remoteConfig.settings.minimumFetchIntervalMillis = 3600000
remoteConfig.defaultConfig = {
  "sidebar_banners": JSON.stringify(sidebar_banners)
}

export {
  analytics,
  db,
  auth,
  storage,
  magazines,
  messaging,
  remoteConfig,
  firebase
}
