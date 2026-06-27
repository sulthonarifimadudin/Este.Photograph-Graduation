import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDSHN2vdFR_TAoXg27BR6AV47znalSsoM",
  authDomain: "este-photograph.firebaseapp.com",
  projectId: "este-photograph",
  storageBucket: "este-photograph.firebasestorage.app",
  messagingSenderId: "156757362849",
  appId: "1:156757362849:web:383efab7d1fcda133bc8e0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    await setDoc(doc(db, "bookings", "TEST1"), { test: true });
    console.log("Firestore Write Success");
  } catch (e) {
    console.error("Firestore Write Error:", e);
  }
}
test();
