import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBnUWIvmILVy9_RzxSoDYuAyKQfFv_rTys",
  authDomain: "clone-dc8d5.firebaseapp.com",
  projectId: "clone-dc8d5",
  storageBucket: "clone-dc8d5.appspot.com",
  messagingSenderId: "361423498747",
  appId: "1:361423498747:web:b7675e38df3561fe9b2f5e"
};

const app = !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export default db;