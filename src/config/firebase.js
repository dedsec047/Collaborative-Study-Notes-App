import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjL7VjQ419RodmFXT5jjlOrKm_g0XnhjI",
  authDomain: "learningantd.firebaseapp.com",
  projectId: "learningantd",
  storageBucket: "learningantd.appspot.com",
  messagingSenderId: "683198426554",
  appId: "1:683198426554:web:1d0a4d7a5fbcc592e60183",
  measurementId: "G-BSJJR49V5B"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const fireStore = getFirestore(app) 

export { auth , fireStore , analytics }