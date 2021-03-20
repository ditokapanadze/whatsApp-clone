import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyB2_X_d3AK6a_JCKEXii6zNi3o2m1DHEqY",
    authDomain: "whatsapp-clone-4fcef.firebaseapp.com",
    projectId: "whatsapp-clone-4fcef",
    storageBucket: "whatsapp-clone-4fcef.appspot.com",
    messagingSenderId: "107487717772",
    appId: "1:107487717772:web:de8cc7f9bf776b7a04cea9",
    measurementId: "G-GQDGW5YGK8"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)
  const db = firebaseApp.firestore()
  const storage = firebase.storage()
  const auth = firebase.auth()
  const provider = new firebase.auth.GoogleAuthProvider()

  export {auth, provider, storage}
  export default db;