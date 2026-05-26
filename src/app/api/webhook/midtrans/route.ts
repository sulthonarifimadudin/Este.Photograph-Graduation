import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Midtrans sends transaction_status
    const { order_id, transaction_status, fraud_status } = data;

    if (!order_id) {
      return NextResponse.json({ error: "No order ID" }, { status: 400 });
    }

    // Extract booking code and type from order_id (e.g., ESTE-XXXXX-DP-123456)
    const parts = order_id.split("-");
    if (parts.length < 3) {
      return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 });
    }

    const bookingCode = `${parts[0]}-${parts[1]}`;
    const type = parts[2]; // 'DP' or 'PELUNASAN'

    // Check if payment is successful
    if (
      transaction_status === 'capture' || 
      transaction_status === 'settlement'
    ) {
      if (fraud_status === 'accept' || !fraud_status) {
        
        // Update Firestore based on payment type
        const docRef = doc(db, "bookings", bookingCode);
        
        if (type === 'DP') {
          await updateDoc(docRef, {
            dpPaid: true,
            progress: "booking_confirmed"
          });
        } else if (type === 'PELUNASAN') {
          await updateDoc(docRef, {
            pelunasanPaid: true,
            // The download button will now unlock automatically
          });
        }
      }
    }

    return NextResponse.json({ status: "success" });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
