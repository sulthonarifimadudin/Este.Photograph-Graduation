import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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
  const code = "ESTE-12345";
  try {
    await setDoc(doc(db, "bookings", code), {
        clientName: "Test Name",
        clientEmail: "test@example.com",
        clientPhone: "1234567890",
        packageId: "premium",
        sessionDate: "2026-07-02",
        sessionTime: "08:10",
        notes: "",
        bookingCode: code,
        status: "pending",
        progress: "pending_approval",
        packagePrice: 250000,
        dpPaid: false,
        pelunasanPaid: false,
        createdAt: serverTimestamp(),
    });
    console.log("Firestore Write Success");
  } catch (e) {
    console.error("Firestore Write Error:", e);
  }
}
test();
