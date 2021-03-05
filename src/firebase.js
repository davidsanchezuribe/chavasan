import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCWLiBb-19hCMN3fKupgT17vjhk20KHjEI",
    authDomain: "chavasan-2b9c0.firebaseapp.com",
    projectId: "chavasan-2b9c0",
    storageBucket: "chavasan-2b9c0.appspot.com",
    messagingSenderId: "453886230009",
    appId: "1:453886230009:web:e73a5ef1023bbf8eb15128"
};

firebase.initializeApp(firebaseConfig);

export const userStateUtil = (func) => {
    firebase.auth().onAuthStateChanged(func);
};

export const signInUtil = (email, password) => new Promise((resolve, reject) => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            resolve(firebase.auth().signInWithEmailAndPassword(email, password));
        }).catch(() => {
            reject(new Error('No se pudo iniciar la sesión'));
        });
});

export const signOut = () => {
    firebase.auth().signOut();
  };