import firebase from 'firebase'
import * as firebaseui from '../src/assets/js/npm__fr';
import "firebaseui/dist/firebaseui.css";
import 'firebase/firestore'

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
const db = firebase.firestore()
const auth = firebase.auth()
const ui = new firebaseui.auth.AuthUI(auth);

// firebase collections
const magazines = db.collection('magazines')

export {
    db,
    ui,
    auth,
    magazines
}
