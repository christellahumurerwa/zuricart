import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwDcNSuxazTQFh8xaaRNXVjVmincolL1U",
  authDomain: "zuricartshop.firebaseapp.com",
  projectId: "zuricartshop",
  storageBucket: "zuricartshop.firebasestorage.app",
  messagingSenderId: "480877425634",
  appId: "1:480877425634:web:553250a385de4faf763fbb",
  measurementId: "G-1JR8DQ9XMZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
