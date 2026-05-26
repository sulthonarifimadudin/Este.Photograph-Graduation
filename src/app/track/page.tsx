"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function TrackBooking() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('este_recent_bookings') || '[]');
      setRecentBookings(existing);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleTrack = async (e?: React.FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    const codeToTrack = directCode || code;
    if (!codeToTrack.trim()) return;

    setLoading(true);
    setError("");

    try {
      const formattedCode = codeToTrack.toUpperCase().trim();
      const docRef = doc(db, "bookings", formattedCode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        router.push(`/dashboard/${formattedCode}`);
      } else {
        setError("Booking not found. Please check your code and try again.");
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-40 px-margin-mobile">
      {/* Background Soft Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-fixed/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-surface-variant/40 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-12 glass-panel rounded-3xl m-4 shadow-xl border-t border-t-white/60"
      >
        <div className="text-center mb-10 relative">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-6 shadow-lg hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">photo_camera</span>
          </Link>
          <h1 className="font-headline-xl text-4xl tracking-tight text-primary mb-2">Track Booking</h1>
          <p className="font-body-md text-on-surface-variant">Enter your unique code to access your gallery.</p>
          <span className="absolute top-10 -right-4 font-editorial-accent text-5xl text-secondary/30 -z-10 rotate-[5deg]">Client Area</span>
        </div>

        {error && (
          <div className="bg-red-50/80 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-200/50 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleTrack(e)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-label-caps tracking-widest text-primary ml-1">BOOKING CODE</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl pointer-events-none">search</span>
              <input 
                type="text" 
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-white/40 border border-primary/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all font-mono text-lg uppercase text-primary placeholder:text-primary/30 shadow-inner"
                placeholder="ESTE-XXXXX"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !code.trim()}
            className="w-full bg-primary text-white py-4 rounded-full font-label-caps tracking-widest hover:bg-secondary hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? "Searching..." : "Access Dashboard"}
            {!loading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
          </button>
        </form>

        <p className="text-center font-body-md text-sm text-on-surface-variant mt-8 mb-8">
          Lost your code?{" "}
          <a href="https://wa.me/6281515964494" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:text-secondary transition-colors border-b border-primary/30 hover:border-secondary">
            Contact us
          </a>
        </p>

        {recentBookings.length > 0 && (
          <div className="mt-8 border-t border-primary/10 pt-8">
            <h3 className="text-[10px] font-label-caps tracking-widest text-primary/60 mb-4 text-center">RECENT BOOKINGS ON THIS DEVICE</h3>
            <div className="space-y-3">
              {recentBookings.map((b, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setCode(b.code);
                    handleTrack(undefined, b.code);
                  }}
                  className="w-full bg-white/40 border border-primary/10 rounded-xl p-4 flex justify-between items-center hover:bg-white/60 hover:border-secondary transition-all group text-left"
                >
                  <div>
                    <p className="font-bold text-primary font-body-md text-sm">{b.name}</p>
                    <p className="font-mono text-xs text-secondary mt-1">{b.code}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary/40 group-hover:text-secondary group-hover:translate-x-1 transition-all">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
