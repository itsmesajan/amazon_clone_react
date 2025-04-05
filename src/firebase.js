import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqk0Mu-7f32AFykQ2kx5sGsQL7ya2KjAU",
  authDomain: "challenge-7b8e1.firebaseapp.com",
  projectId: "challenge-7b8e1",
  storageBucket: "challenge-7b8e1.firebasestorage.app",
  messagingSenderId: "932574658745",
  appId: "1:932574658745:web:dae202a733761be8301b68",
  measurementId: "G-4NSGR9QELK"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get the auth instance
const auth = getAuth(firebaseApp);

export { auth };