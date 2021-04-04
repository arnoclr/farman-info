import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

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

db.enablePersistence()
  .catch(err => {
    console.error(err)
  })

// firebase collections
const magazines = db.collection('magazines')

export {
  analytics,
  db,
  auth,
  storage,
  magazines,
  firebase
}
