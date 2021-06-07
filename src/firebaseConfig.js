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

// check cookie consent before init
const consent = JSON.parse(localStorage.getItem('cookie:accepted'))
window.consent = consent
analytics.setUserProperties({consent: consent})
// firebase sdk automatically anonimyze ip
// https://support.google.com/firebase/answer/9019185?hl=en#zippy=%2Cin-this-article

if (location.hostname === "localhost") {
  //db.useEmulator("localhost", 8088)
} else {
  db.enablePersistence()
    .catch(err => {
      console.error(err)
    })
}

// firebase collections
const magazines = db.collection('magazines')

// remote config
const sidebar_banners = {}
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
