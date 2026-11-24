// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCD4Xl3bph64VPe8YCCjeU3D92nTWWf8OQ",
  authDomain: "proyecto-de-edya2.firebaseapp.com",
  projectId: "proyecto-de-edya2",
  storageBucket: "proyecto-de-edya2.firebasestorage.app",
  messagingSenderId: "225457332211",
  appId: "1:225457332211:web:5666adb063794905457c86",
  measurementId: "G-4153YXJW6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);