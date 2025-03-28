// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLIT2cYln9O8ig3h5cpqWNGTeO5hQz6jE",
  authDomain: "janwar-mandi-6b87e.firebaseapp.com",
  databaseURL: "https://janwar-mandi-6b87e-default-rtdb.firebaseio.com",
  projectId: "janwar-mandi-6b87e",
  storageBucket: "janwar-mandi-6b87e.appspot.com",
  messagingSenderId: "10427419303",
  appId: "1:10427419303:web:1f8c417d80d54efb76a982",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Providers for Google & Facebook Authentication
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

export { app, auth, db, googleProvider, facebookProvider }

