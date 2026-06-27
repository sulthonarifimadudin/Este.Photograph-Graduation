"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";

export default function PaymentPage() {
  const { code, type } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!code || typeof code !== 'string') return;
    
    const fetchBooking = async () => {
      try {
        const docSnap = await getDoc(doc(db, "bookings", code.toUpperCase()));
        if (docSnap.exists()) {
          setBooking({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [code]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !preview || !booking) return;

    setSubmitting(true);
    try {
      // 1. Send email to admin
      const res = await fetch('/api/upload-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingCode: booking.bookingCode,
          type: type,
          clientName: booking.clientName,
          receiptBase64: preview
        })
      });

      if (!res.ok) {
        throw new Error("Failed to send receipt");
      }

      // 2. Update Firestore document to indicate proof submitted
      await updateDoc(doc(db, "bookings", booking.id), {
        [`${type}ProofSubmitted`]: true
      });

      alert("Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin.");
      router.push(`/invoice/${booking.bookingCode}/${type}`);
      
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengunggah bukti pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-headline-lg">Loading...</div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center font-headline-lg">Booking not found.</div>;

  const isDp = type === 'dp';
  const amount = booking.packagePrice / 2;

  return (
    <main className="min-h-screen bg-[#fbf9f5] pt-24 pb-40 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-xl mx-auto">
        <Link href={`/dashboard/${booking.bookingCode}`} className="inline-flex items-center gap-2 text-primary/60 hover:text-primary mb-8 transition-colors font-label-caps text-xs tracking-widest">
          <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO DASHBOARD
        </Link>
        
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-primary/10">
          <div className="text-center mb-8">
            <h1 className="font-headline-xl text-3xl text-primary mb-2">Pembayaran {isDp ? 'DP 50%' : 'Pelunasan 50%'}</h1>
            <p className="font-body-md text-on-surface-variant">Booking Code: <span className="font-bold">{booking.bookingCode}</span></p>
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 text-center mb-8">
            <p className="text-xs font-label-caps tracking-widest text-primary/60 mb-2">TOTAL YANG HARUS DIBAYAR</p>
            <p className="font-mono text-4xl font-bold text-primary">Rp{amount.toLocaleString('id-ID')}</p>
          </div>

          <div className="mb-8 text-center">
            <p className="font-body-md text-primary font-bold mb-4">Silakan scan QRIS di bawah ini menggunakan e-wallet atau m-banking Anda:</p>
            <div className="relative w-80 md:w-96 aspect-square mx-auto border-2 border-primary/10 rounded-2xl overflow-hidden p-2 bg-white">
              <Image 
                src="/QrisStatisEste Corp-19.png" 
                alt="QRIS Este Photograph" 
                fill 
                className="object-contain p-2"
              />
            </div>
            <p className="text-sm text-primary/60 mt-4">a.n. Este Corp</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 border-t border-primary/10 pt-8">
            <div>
              <label className="block text-xs font-label-caps tracking-widest text-primary mb-2 text-center">UNGGAH BUKTI TRANSFER</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all"
              >
                {preview ? (
                  <div className="relative w-full h-48">
                    <img src={preview} alt="Receipt preview" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-primary/40 mb-2">upload_file</span>
                    <p className="font-body-md text-primary/60">Klik untuk memilih foto (Max 5MB)</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting || !file}
              className="w-full bg-secondary text-white py-4 rounded-full font-label-caps tracking-widest hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "MENGIRIM..." : "KONFIRMASI PEMBAYARAN"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
