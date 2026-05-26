import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, clientName, bookingCode, sessionDate, sessionTime } = await req.json();

    if (!to || !clientName || !bookingCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
       console.warn("Email credentials not configured in .env.local yet.");
       return NextResponse.json({ error: "Email credentials not configured" }, { status: 500 });
    }

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // HTML Email Template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #f4f4f4; padding-bottom: 15px;">Este Photograph</h2>
        
        <p style="color: #555; font-size: 16px;">Halo <strong>${clientName}</strong>,</p>
        <p style="color: #555; font-size: 16px;">Terima kasih telah melakukan pemesanan sesi foto bersama Este Photograph. Berikut adalah Nomor Antrean / Kode Unik pesananmu:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <p style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">KODE BOOKING</p>
          <h1 style="color: #2c3e50; font-family: monospace; font-size: 32px; letter-spacing: 4px; margin: 0;">${bookingCode}</h1>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #777;">Jadwal Sesi</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #333; font-weight: bold; text-align: right;">${sessionDate} at ${sessionTime || "TBD"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #777;">Status</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #e67e22; font-weight: bold; text-align: right;">Pending Approval</td>
          </tr>
        </table>

        <p style="color: #555; font-size: 15px; line-height: 1.5;">Untuk memantau status pesananmu, mencetak invoice pembayaran, dan mengambil foto yang sudah jadi nanti, silakan akses Client Dashboard melalui tautan berikut:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/dashboard/${bookingCode}" style="background-color: #2c3e50; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Buka Client Dashboard</a>
        </div>

        <p style="color: #888; font-size: 12px; text-align: center; border-top: 1px solid #eaeaea; padding-top: 20px;">
          Este Photograph | Capturing timeless editorial stories.<br/>
          Harap simpan email ini sebagai tanda bukti pemesanan.
        </p>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"Este Photograph" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Tanda Terima Pesanan: ${bookingCode} - Este Photograph`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
