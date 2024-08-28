// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import {
  getAuth,
  setPersistence,
  indexedDBLocalPersistence,
  // browserSessionPersistence,
} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB7JZkNlZdjo8XWIUE5aWs5XsNkgDuY7BI',
  authDomain: 'checkpoint-a9.firebaseapp.com',
  databaseURL: 'https://checkpoint-a9.firebaseio.com',
  projectId: 'checkpoint-a9',
  storageBucket: 'checkpoint-a9.appspot.com',
  messagingSenderId: '860517143126',
  appId: '1:860517143126:web:803719d20709ba979be1f7',
  measurementId: 'G-0EVBLPYKNR',
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const firebaseAuth = getAuth(firebaseApp)

// Set the persistence of the auth state
setPersistence(firebaseAuth, indexedDBLocalPersistence)

// used for the firestore refs
const db = getFirestore(firebaseApp)

// here we can export reusable database references
// export const usersRef = collection(db, 'Users')
