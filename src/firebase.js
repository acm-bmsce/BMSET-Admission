import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUiBccvRrpbxdoTmldWrotPw7KHZe6arM",
  authDomain: "bmset-admission.firebaseapp.com",
  projectId: "bmset-admission",
  storageBucket: "bmset-admission.firebasestorage.app",
  messagingSenderId: "445333370191",
  appId: "1:445333370191:web:318b9660e02b5088dcc13a"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);