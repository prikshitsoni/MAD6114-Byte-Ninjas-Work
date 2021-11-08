import { getFirestore } from '@firebase/firestore';
// import * as firebase from 'firebase/compat';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
const firebase = require('firebase/compat');
require('firebase/compat/auth');
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyApKcjzZRfHKCgcE3R0UJqGgAJ90JAttGo",
    authDomain: "mad6114-byteninjas-project.firebaseapp.com",
    projectId: "mad6114-byteninjas-project",
    storageBucket: "mad6114-byteninjas-project.appspot.com",
    messagingSenderId: "764341318791",
    appId: "1:764341318791:web:a97559c976b11d17933422",
    measurementId: "G-XVKTG3NVM3"
};

// if (!firebase.getApps().length) {
//     firebase.initializeApp(firebaseConfig);
// }

firebase.initializeApp(firebaseConfig);

let currentUser = {};
firebase.auth().onAuthStateChanged(
    (user) => {
        currentUser = user;
    }
);

export const { db } = firebase.firestore();
export { firebase };
export { currentUser };