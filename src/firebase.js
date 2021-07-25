import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCgVB3CK8cd9vuxpSXjkSM7hgOdLVxwxg4",
    authDomain: "instagram-clone-2850f.firebaseapp.com",
    projectId: "instagram-clone-2850f",
    storageBucket: "instagram-clone-2850f.appspot.com",
    messagingSenderId: "310557757018",
    appId: "1:310557757018:web:a55870fbb90dfe15155263",
    measurementId: "G-RQP7E7RHGP"    
  });

  const db = firebaseApp.firestore();
  const auth =firebase.auth();
  const storage = firebase.storage();
  export {db, auth, storage};