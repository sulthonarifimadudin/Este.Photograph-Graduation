import { NextResponse } from "next/server";
const midtransClient = require('midtrans-client');

export async function POST(req: Request) {
  try {
    const { bookingCode, type, amount, clientName, clientEmail, clientPhone } = await req.json();

    if (!bookingCode || !type || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = `${bookingCode}-${type.toUpperCase()}-${Date.now()}`;

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    const parameters = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        first_name: clientName,
        email: clientEmail,
        phone: clientPhone
      },
      item_details: [{
        id: bookingCode,
        price: amount,
        quantity: 1,
        name: `Este Photograph - ${type === 'dp' ? 'DP 50%' : 'Pelunasan 50%'}`
      }]
    };

    const transaction = await snap.createTransaction(parameters);
    
    return NextResponse.json({ 
      token: transaction.token, 
      redirect_url: transaction.redirect_url,
      orderId: orderId
    });

  } catch (error: any) {
    console.error("Midtrans Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
