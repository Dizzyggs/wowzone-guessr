// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqfANq9ElrIk3p1PFnVvwLVhlElJLGt6o",
  authDomain: "wow-guessr.firebaseapp.com",
  projectId: "wow-guessr",
  storageBucket: "wow-guessr.firebasestorage.app",
  messagingSenderId: "557177924989",
  appId: "1:557177924989:web:17857166a0b0e56d937014"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };