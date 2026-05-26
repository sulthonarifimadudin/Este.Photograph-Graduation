"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const packages = [
  { id: "premium", name: "Premium Package", priceLabel: "250k", priceValue: 250000 },
  { id: "eksklusif", name: "Eksklusif Package", priceLabel: "325k", priceValue: 325000 },
  { id: "ultimate", name: "Ultimate Package", priceLabel: "400k", priceValue: 400000 },
  { id: "group", name: "Group Edition", priceLabel: "600k", priceValue: 600000 },
];

export default function BookSession() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    packageId: "premium",
    sessionDate: "",
    sessionTime: "",
    notes: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ESTE-${result}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const code = generateCode();
    
    try {
      await setDoc(doc(db, "bookings", code), {
        ...formData,
        bookingCode: code,
        status: "pending",
        progress: "pending_approval",
        packagePrice: packages.find(p => p.id === formData.packageId)?.priceValue || 0,
        dpPaid: false,
        pelunasanPaid: false,
        createdAt: serverTimestamp(),
      });
      setBookingCode(code);

      try {
        const existing = JSON.parse(localStorage.getItem('este_recent_bookings') || '[]');
        if (!existing.find((b: any) => b.code === code)) {
          existing.push({ code, name: formData.clientName, date: formData.sessionDate });
          localStorage.setItem('este_recent_bookings', JSON.stringify(existing));
        }
      } catch (e) {
        console.error("Failed to save to local storage", e);
      }

      // Send Confirmation Email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.clientEmail,
            clientName: formData.clientName,
            bookingCode: code,
            sessionDate: formData.sessionDate,
            sessionTime: formData.sessionTime,
          })
        });
      } catch (emailError) {
        console.error("Failed to send email", emailError);
      }
      
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (bookingCode) {
    return (
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-40 px-margin-mobile">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg p-10 glass-panel rounded-3xl m-4 text-center shadow-xl border-t border-t-white/60"
        >
          <span className="material-symbols-outlined text-6xl text-secondary mx-auto mb-6">check_circle</span>
          <h1 className="font-headline-xl text-3xl tracking-tight text-primary mb-4">Booking Received!</h1>
          <p className="font-body-md text-on-surface-variant mb-8">
            Thank you, <span className="font-bold">{formData.clientName}</span>. Your session has been recorded. 
            Please save your unique booking code below. You will need it to track your progress and download your photos.
          </p>

          <div className="bg-white/50 border border-primary/10 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-label-caps text-secondary tracking-widest mb-1">YOUR BOOKING CODE</p>
              <p className="text-3xl font-mono text-primary font-bold tracking-wider">{bookingCode}</p>
            </div>
            <button 
              onClick={copyToClipboard}
              className="p-3 bg-white hover:bg-secondary/10 rounded-xl transition-colors text-primary flex items-center justify-center"
              title="Copy Code"
            >
              <span className="material-symbols-outlined">{copied ? 'done' : 'content_copy'}</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4">
            <Link 
              href={`/track`}
              className="inline-block bg-primary text-white py-4 px-8 rounded-full font-label-caps tracking-widest hover:bg-secondary transition-colors shadow-lg"
            >
              TRACK BOOKING
            </Link>
            <a 
              href={`https://wa.me/6281515964494?text=Halo%20Admin%20Este%20Photograph,%20saya%20baru%20saja%20membuat%20pesanan%20dengan%20kode%20booking%20*${bookingCode}*.%20Apakah%20jadwal%20tersebut%20tersedia?`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-label-caps tracking-widest text-[#25D366] border border-[#25D366] bg-white hover:bg-[#25D366] hover:text-white transition-colors py-4 px-8 rounded-full"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              TANYA ADMIN
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative pt-20 md:pt-32 pb-24 md:pb-40 px-margin-mobile md:px-margin-desktop">
      {/* Background soft blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface-variant/40 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-8 transition-colors font-label-caps text-xs tracking-widest">
          <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO HOME
        </Link>

        <div className="glass-panel p-6 md:p-12 rounded-3xl shadow-xl border-t border-t-white/60">
          <div className="mb-10 text-center relative">
            <h1 className="font-headline-xl text-4xl md:text-5xl tracking-tight text-primary mb-3">Book Your Session</h1>
            <p className="font-body-md text-on-surface-variant">Fill out the form below to secure your spot. No account required.</p>
            <span className="absolute -top-6 right-0 font-editorial-accent text-5xl text-secondary/30 -z-10 rotate-[-5deg]">Timeless</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-label-caps tracking-widest text-primary ml-1">FULL NAME</label>
                <input 
                  type="text" required name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full bg-white/40 border border-primary/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all font-body-md text-primary placeholder:text-primary/30 shadow-inner"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label-caps tracking-widest text-primary ml-1">EMAIL ADDRESS</label>
                <input 
                  type="email" required name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full bg-white/40 border border-primary/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all font-body-md text-primary placeholder:text-primary/30 shadow-inner"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-label-caps tracking-widest text-primary ml-1">WHATSAPP NUMBER</label>
                <input 
                  type="tel" required name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  className="w-full bg-white/40 border border-primary/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all font-body-md text-primary placeholder:text-primary/30 shadow-inner"
                  placeholder="+62 812 3456 7890"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-0">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sessionDate" className="text-[10px] font-label-caps tracking-widest text-primary/60">SESSION DATE</label>
                    <input 
                      type="date" 
                      id="sessionDate"
                      name="sessionDate"
                      required
                      value={formData.sessionDate}
                      onChange={handleInputChange}
                      className="bg-white/40 border border-primary/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all font-body-md text-primary shadow-inner"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sessionTime" className="text-[10px] font-label-caps tracking-widest text-primary/60">SESSION TIME</label>
                    <input 
                      type="time" 
                      id="sessionTime"
                      name="sessionTime"
                      required
                      value={formData.sessionTime}
                      onChange={handleInputChange}
                      className="bg-white/40 border border-primary/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all font-body-md text-primary shadow-inner"
                    />
                  </div>
                </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-label-caps tracking-widest text-primary ml-1">SELECT PACKAGE</label>
              <div className="grid sm:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <label 
                    key={pkg.id} 
                    className={`cursor-pointer border rounded-2xl p-5 transition-all flex flex-col ${formData.packageId === pkg.id ? 'border-secondary bg-secondary/10 shadow-md scale-[1.02]' : 'border-primary/10 bg-white/40 hover:border-secondary/50'}`}
                  >
                    <input 
                      type="radio" 
                      name="package" 
                      value={pkg.id}
                      checked={formData.packageId === pkg.id}
                      onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                      className="sr-only" 
                    />
                    <div className="font-headline-lg text-xl text-primary">{pkg.name}</div>
                    <div className="text-sm font-bold text-secondary mt-1">{pkg.priceLabel}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-label-caps tracking-widest text-primary ml-1">ADDITIONAL NOTES</label>
              <textarea 
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-white/40 border border-primary/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all resize-none font-body-md text-primary placeholder:text-primary/30 shadow-inner"
                placeholder="Any special requests for your graduation shoot?"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-full font-label-caps text-label-caps hover:bg-secondary hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
            >
              {loading ? "Processing..." : "Confirm Booking"}
              {!loading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
