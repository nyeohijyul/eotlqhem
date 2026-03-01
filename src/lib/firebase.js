// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDl1C47giuYCkkmp9KTmHtP7vfay1m4QoU",
  authDomain: "tempus-233e1.firebaseapp.com",
  databaseURL: "https://tempus-233e1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tempus-233e1",
  storageBucket: "tempus-233e1.firebasestorage.app",
  messagingSenderId: "154230505639",
  appId: "1:154230505639:web:d5373eb86c32befae69b82",
  measurementId: "G-VV8CYWD176"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);