import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { bookingCode, type, clientName, receiptBase64 } = await req.json();

    if (!bookingCode || !receiptBase64) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return NextResponse.json({ error: "Email credentials not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Extract the base64 data (remove the data:image/png;base64, part)
    const base64Data = receiptBase64.split(';base64,').pop();

    const paymentType = type === 'dp' ? 'DP 50%' : 'Pelunasan 50%';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Bukti Pembayaran Baru</h2>
        <p><strong>Klien:</strong> ${clientName}</p>
        <p><strong>Kode Booking:</strong> ${bookingCode}</p>
        <p><strong>Jenis Pembayaran:</strong> ${paymentType}</p>
        <p>Klien telah mengunggah bukti pembayaran. Silakan periksa lampiran pada email ini dan lakukan verifikasi di Admin Dashboard.</p>
        <br/>
        <a href="https://estephotograph.my.id/admin" style="background-color: #7d562d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Buka Admin Dashboard</a>
      </div>
    `;

    const info = await transporter.sendMail({
      from: \`"Este Photograph System" <\${process.env.EMAIL_USER}>\`,
      to: "sulthonarifimadudin@gmail.com",
      subject: \`[Bukti Pembayaran] \${bookingCode} - \${paymentType}\`,
      html: htmlContent,
      attachments: [
        {
          filename: \`receipt-\${bookingCode}-\${type}.jpg\`,
          content: base64Data,
          encoding: 'base64'
        }
      ]
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Upload receipt error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
