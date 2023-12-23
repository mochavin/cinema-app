// npm install firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// creste suth snf googlr provider
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkxa8g9H7A7qqgxk0HBdB02TkCgRHIbFQ",
  authDomain: "first-project-73c0a.firebaseapp.com",
  projectId: "first-project-73c0a",
  storageBucket: "first-project-73c0a.appspot.com",
  messagingSenderId: "689238115270",
  appId: "1:689238115270:web:b8ebb0e36854a4602ae8c7",
  measurementId: "G-4TB6WXVJ6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
