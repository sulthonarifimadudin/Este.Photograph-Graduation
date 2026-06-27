"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";

const PROGRESS_STEPS = [
  { id: "pending_approval", label: "Pending" },
  { id: "awaiting_dp", label: "DP 50%" },
  { id: "booking_confirmed", label: "Confirmed" },
  { id: "on_progress", label: "On Progress" },
  { id: "editing", label: "Editing" },
  { id: "awaiting_pelunasan", label: "Pelunasan" },
  { id: "ready_to_download", label: "Ready!" }
];

export default function ClientDashboard() {
  const { code } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  useEffect(() => {
    if (!code || typeof code !== 'string') {
      router.push('/track');
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "bookings", code.toUpperCase()), (docSnap) => {
      if (docSnap.exists()) {
        setBooking({ id: docSnap.id, ...docSnap.data() });
      } else {
        // If it gets deleted or doesn't exist
        setBooking(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching booking:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [code, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-headline-lg text-primary">Loading your dashboard...</div>;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-headline-lg text-primary">
        <p className="mb-4">Booking not found.</p>
        <Link href="/track" className="text-sm font-body-md text-secondary underline">Go Back</Link>
      </div>
    );
  }

  const currentStepIndex = PROGRESS_STEPS.findIndex(step => step.id === (booking.progress || "pending_approval"));
  const isReady = booking.progress === "ready_to_download";


  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) return;
    
    setRescheduleLoading(true);
    try {
      const docRef = doc(db, "bookings", booking.id);
      await updateDoc(docRef, {
        sessionDate: rescheduleDate,
        sessionTime: rescheduleTime,
        progress: "pending_approval",
        rescheduleAllowed: false
      });
      setShowReschedule(false);
      alert("Reschedule request submitted! The admin will review your new date.");
    } catch(err) {
      console.error(err);
      alert("Failed to request reschedule.");
    } finally {
      setRescheduleLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative pt-32 pb-40 px-margin-mobile md:px-margin-desktop overflow-hidden">
      {/* Background Soft Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface-variant/40 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <span className="material-symbols-outlined text-4xl text-primary mb-2">person</span>
          <h1 className="font-headline-xl text-3xl md:text-5xl text-primary mb-2">Welcome, {booking.clientName}</h1>
          <p className="font-body-md text-on-surface-variant">Here is the status of your photography session.</p>
          <span className="absolute -top-4 -right-10 font-editorial-accent text-5xl text-secondary/30 -z-10 rotate-[5deg] hidden md:block">VIP Client</span>
        </motion.div>

        {/* Dashboard Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 md:p-12 rounded-3xl shadow-xl border-t border-t-white/60 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-primary/10 pb-6">
            <div>
              <p className="text-[10px] font-label-caps tracking-widest text-secondary mb-1">BOOKING CODE</p>
              <p className="font-mono text-2xl font-bold text-primary">{booking.bookingCode}</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-[10px] font-label-caps tracking-widest text-secondary mb-1">SESSION DATE & TIME</p>
              <p className="font-headline-lg text-xl text-primary mb-2">
                {booking.sessionDate ? `${booking.sessionDate} at ${booking.sessionTime || "TBD"}` : "TBD"}
              </p>
              {booking.rescheduleAllowed && booking.progress !== "ready_to_download" && (
                <button 
                  onClick={() => setShowReschedule(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-label-caps tracking-widest text-secondary hover:text-primary transition-colors border border-secondary/20 hover:border-primary/40 px-3 py-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-[14px]">edit_calendar</span>
                  REQUEST RESCHEDULE
                </button>
              )}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mb-12">
            <h3 className="font-headline-lg text-xl text-primary mb-8 text-center">Project Status</h3>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
              {/* Progress Line Background */}
              <div className="absolute left-[15px] top-0 bottom-0 w-0.5 md:w-full md:h-0.5 md:left-0 md:top-[15px] bg-primary/10 -z-10"></div>
              
              {/* Active Progress Line */}
              <div 
                className="absolute left-[15px] top-0 w-0.5 md:h-0.5 md:left-0 md:top-[15px] bg-secondary transition-all duration-1000 -z-10"
                style={{ 
                  height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(currentStepIndex / (PROGRESS_STEPS.length - 1)) * 100}%` : '0.5rem',
                  width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(currentStepIndex / (PROGRESS_STEPS.length - 1)) * 100}%` : '0.5rem'
                }}
              ></div>

              {PROGRESS_STEPS.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2 mb-8 md:mb-0 relative z-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-secondary text-white' : 'bg-white border-2 border-primary/10 text-primary/30'} ${isCurrent ? 'ring-4 ring-secondary/20' : ''}`}>
                      {isActive ? <span className="material-symbols-outlined text-sm">check</span> : <span className="text-xs">{index + 1}</span>}
                    </div>
                    <span className={`font-label-caps text-xs tracking-wider text-center ${isActive ? 'text-primary font-bold' : 'text-primary/40'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white/40 border border-primary/10 rounded-2xl p-8 text-center">
            {booking.progress === "pending_approval" && (
              <>
                <span className="material-symbols-outlined text-5xl text-primary/20 mb-4">hourglass_empty</span>
                <h3 className="font-headline-lg text-2xl text-primary mb-2">Pending Approval</h3>
                <p className="font-body-md text-on-surface-variant">Admin is reviewing your requested date. You will be able to pay the DP once approved.</p>
              </>
            )}
            
            {booking.progress === "awaiting_dp" && (
              <>
                <span className="material-symbols-outlined text-5xl text-secondary mb-4">payments</span>
                <h3 className="font-headline-lg text-2xl text-primary mb-2">Down Payment Required</h3>
                <p className="font-body-md text-on-surface-variant mb-6">Please pay the 50% DP to lock your session schedule.</p>
                {booking.dpProofSubmitted ? (
                  <div className="inline-flex bg-orange-100 text-orange-700 py-3 px-6 rounded-full font-label-caps tracking-widest font-bold items-center gap-2">
                    <span className="material-symbols-outlined text-xl">pending_actions</span>
                    Menunggu Verifikasi Admin
                  </div>
                ) : (
                  <Link 
                    href={`/pay/${booking.bookingCode}/dp`}
                    className="inline-flex bg-secondary text-white py-4 px-8 rounded-full font-label-caps tracking-widest hover:bg-primary hover:shadow-xl transition-all items-center gap-2"
                  >
                    PAY DP 50%
                  </Link>
                )}
              </>
            )}

            {booking.progress === "awaiting_pelunasan" && (
              <>
                <span className="material-symbols-outlined text-5xl text-secondary mb-4">lock_open</span>
                <h3 className="font-headline-lg text-2xl text-primary mb-2">Photos are ready!</h3>
                <p className="font-body-md text-on-surface-variant mb-6">Pay the remaining 50% balance to unlock your Google Drive download link.</p>
                {booking.finalProofSubmitted ? (
                  <div className="inline-flex bg-orange-100 text-orange-700 py-3 px-6 rounded-full font-label-caps tracking-widest font-bold items-center gap-2">
                    <span className="material-symbols-outlined text-xl">pending_actions</span>
                    Menunggu Verifikasi Admin
                  </div>
                ) : (
                  <Link 
                    href={`/pay/${booking.bookingCode}/final`}
                    className="inline-flex bg-secondary text-white py-4 px-8 rounded-full font-label-caps tracking-widest hover:bg-primary hover:shadow-xl transition-all items-center gap-2"
                  >
                    PAY FINAL 50%
                  </Link>
                )}
              </>
            )}

            {booking.progress === "ready_to_download" && booking.downloadUrl && (
              <>
                <span className="material-symbols-outlined text-5xl text-secondary mb-4">folder_zip</span>
                <h3 className="font-headline-lg text-2xl text-primary mb-2">Your photos are ready!</h3>
                <p className="font-body-md text-on-surface-variant mb-6">Click the button below to access the high-resolution files.</p>
                <a 
                  href={booking.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex bg-primary text-white py-4 px-8 rounded-full font-label-caps tracking-widest hover:bg-secondary hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95 items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xl">folder_shared</span>
                  OPEN GOOGLE DRIVE
                </a>
              </>
            )}

            {!["pending_approval", "awaiting_dp", "awaiting_pelunasan", "ready_to_download"].includes(booking.progress) && (
              <>
                <span className="material-symbols-outlined text-5xl text-primary/20 mb-4">hourglass_empty</span>
                <h3 className="font-headline-lg text-2xl text-primary mb-2">Working our magic</h3>
                <p className="font-body-md text-on-surface-variant">Your project is currently in the <strong>{PROGRESS_STEPS[currentStepIndex]?.label}</strong> phase. We will notify you once it progresses.</p>
              </>
            )}
          </div>

          {/* Invoices */}
          {(booking.dpPaid || booking.pelunasanPaid) && (
            <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
              {booking.dpPaid && (
                <Link 
                  href={`/invoice/${booking.bookingCode}/dp`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 text-xs font-label-caps tracking-widest text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors py-3 px-6 rounded-full"
                >
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                  VIEW DP INVOICE
                </Link>
              )}
              {booking.pelunasanPaid && (
                <Link 
                  href={`/invoice/${booking.bookingCode}/final`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 text-xs font-label-caps tracking-widest text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors py-3 px-6 rounded-full"
                >
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                  VIEW FINAL INVOICE
                </Link>
              )}
            </div>
          )}
        </motion.div>

        <div className="text-center">
          <Link href="/" className="text-sm font-label-caps tracking-widest text-primary/60 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
            RETURN TO HOMEPAGE
          </Link>
        </div>

      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/6281515964494?text=Halo%20Admin%20Este%20Photograph,%20saya%20ingin%20bertanya%20seputar%20pesanan%20saya%20dengan%20kode%20*${booking.bookingCode}*.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-[110%] top-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-label-caps tracking-widest px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          HUBUNGI ADMIN VIA WHATSAPP
        </span>
      </a>
      {/* Reschedule Modal */}
      {showReschedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setShowReschedule(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#fbf9f5] p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 w-full max-w-md border border-primary/10"
          >
            <button 
              onClick={() => setShowReschedule(false)}
              className="absolute top-6 right-6 text-primary/40 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-lg text-2xl text-primary mb-2">Reschedule Session</h2>
            <p className="font-body-md text-on-surface-variant mb-8 text-sm">Choose a new date and time for your session. This will require admin approval.</p>
            
            <form onSubmit={handleReschedule} className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-label-caps tracking-widest text-primary mb-2">NEW DATE</label>
                <input 
                  type="date" 
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-transparent border-b border-primary/20 py-2 focus:outline-none focus:border-secondary font-body-md"
                />
              </div>
              <div>
                <label className="block text-xs font-label-caps tracking-widest text-primary mb-2">NEW TIME</label>
                <input 
                  type="time" 
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full bg-transparent border-b border-primary/20 py-2 focus:outline-none focus:border-secondary font-body-md"
                />
              </div>
              
              <button 
                type="submit"
                disabled={rescheduleLoading}
                className="w-full bg-secondary text-white py-4 rounded-full font-label-caps tracking-widest hover:bg-primary transition-colors mt-4 disabled:opacity-50"
              >
                {rescheduleLoading ? "SUBMITTING..." : "SUBMIT REQUEST"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}
