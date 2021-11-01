import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics'
import { getFirestore, collection, addDoc, serverTimestamp, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getMessaging, isSupported } from 'firebase/messaging'
import { getRemoteConfig, defaultConfig, minimumFetchIntervalMillis } from 'firebase/remote-config'

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

const firebaseApp = initializeApp(firebaseConfig)
const analyticsInstance = getAnalytics(firebaseApp)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const remoteConfig = getRemoteConfig(firebaseApp)

let messaging = null
if(isSupported()) {
  messaging = getMessaging(firebaseApp)
}

// check cookie consent before init
const consent = JSON.parse(localStorage.getItem('cookie:accepted'))
window.consent = consent
setUserProperties(analyticsInstance ,{consent: consent})
// firebase sdk automatically anonimyze ip
// https://support.google.com/firebase/answer/9019185?hl=en#zippy=%2Cin-this-article

if (location.hostname === "localhost") {
  //db.useEmulator("localhost", 8088)
}
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });

// remote config
const sidebar_banners = {}
remoteConfig.settings.minimumFetchIntervalMillis = 3600000
remoteConfig.defaultConfig = {
  "sidebar_banners": JSON.stringify(sidebar_banners)
}

export {
  // app
  firebaseApp,
  // auth
  auth,
  onAuthStateChanged,
  // analytics
  analyticsInstance,
  setUserId,
  logEvent,
  // firestore
  db,
  serverTimestamp
}
