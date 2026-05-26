"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const router = useRouter();

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    const unsubscribeDb = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const bks: any[] = [];
      snapshot.forEach((doc) => {
        bks.push({ id: doc.id, ...doc.data() });
      });
      // Sort locally by createdAt desc
      bks.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setBookings(bks);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDb();
    };
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const updateProgress = async (id: string, newProgress: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), {
        progress: newProgress
      });
    } catch (err) {
      console.error("Error updating progress:", err);
      alert("Failed to update status.");
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDoc(doc(db, "bookings", deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Gagal menghapus booking.");
    }
  };

  const handleUpdateLink = async (bookingCode: string, link: string) => {
    if (!link.trim()) return;
    try {
      const booking = bookings.find(b => b.id === bookingCode);
      const isAlreadyDone = booking?.progress === "ready_to_download";
      
      await updateDoc(doc(db, "bookings", bookingCode), {
        downloadUrl: link,
        progress: isAlreadyDone ? "ready_to_download" : "awaiting_pelunasan"
      });
      alert(isAlreadyDone ? "Link updated successfully!" : "Link saved! Status updated to 'Menunggu Pelunasan'. Client must now pay final balance to unlock.");
    } catch (err) {
      console.error("Error saving link:", err);
      alert("Failed to save link.");
    }
  };

  const handleAllowReschedule = async (id: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), {
        rescheduleAllowed: true
      });
      alert("Klien sekarang bisa mengatur ulang jadwal dari halaman Tracking mereka.");
    } catch (err) {
      console.error(err);
      alert("Gagal mengizinkan reschedule.");
    }
  };

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const padding = Array(firstDay).fill(null);
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getBookingsForDate = (dateStr: string) => bookings.filter(b => b.sessionDate === dateStr);
  const selectedDayBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const getWhatsAppLink = (phone: string) => {
    if (!phone) return "#";
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      return `https://wa.me/62${cleanPhone.substring(1)}`;
    }
    return `https://wa.me/${cleanPhone}`;
  };

  const renderBookingStatus = (booking: any) => {
    const p = booking.progress;
    if (p === "pending_approval") {
      return (
        <button 
          onClick={() => updateProgress(booking.id, "awaiting_dp")}
          className="bg-primary text-white px-6 py-2 rounded-full font-label-caps tracking-widest text-xs hover:bg-secondary transition-colors"
        >
          APPROVE DATE
        </button>
      );
    }
    if (p === "awaiting_dp") {
      return <span className="font-label-caps text-xs text-orange-600 font-bold bg-orange-100 px-4 py-2 rounded-full">WAITING CLIENT DP</span>;
    }
    if (p === "awaiting_pelunasan") {
      return <span className="font-label-caps text-xs text-blue-600 font-bold bg-blue-100 px-4 py-2 rounded-full">WAITING FINAL PAY</span>;
    }
    if (p === "ready_to_download") {
      return <span className="font-label-caps text-xs text-green-700 font-bold bg-green-100 px-4 py-2 rounded-full flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> DONE</span>;
    }
    
    return (
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-[10px] font-label-caps tracking-widest text-primary/60 mb-1">PROJECT STATUS</label>
        <select 
          value={p}
          onChange={(e) => updateProgress(booking.id, e.target.value)}
          className="bg-transparent font-headline-lg text-primary focus:outline-none border-b border-primary/20 pb-1 pr-4 cursor-pointer hover:border-secondary transition-colors"
        >
          <option value="booking_confirmed">Waiting Session</option>
          <option value="on_progress">Session Done</option>
          <option value="editing">Editing Photos</option>
        </select>
      </div>
    );
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] font-headline-lg text-primary">Loading...</div>;
  }

  return (
    <main className="min-h-screen pt-32 pb-40 px-margin-mobile md:px-margin-desktop bg-white">
      <div className="max-w-container-max mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="font-headline-xl text-4xl text-primary mb-2">Studio Admin</h1>
            <p className="font-body-md text-on-surface-variant">Manage bookings and deliver photos securely.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 md:mt-0 flex items-center gap-2 text-red-500 hover:text-red-700 font-label-caps tracking-widest transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Col: Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-[#fbf9f5] border border-primary/10 rounded-3xl p-6 shadow-sm sticky top-32">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-lg text-2xl text-primary">{monthNames[month]} {year}</h2>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} className="text-[10px] font-label-caps tracking-widest text-primary/40">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center">
                {padding.map((_, i) => <div key={`pad-${i}`} className="h-8"></div>)}
                {days.map(d => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                  const hasBooking = getBookingsForDate(dateStr).length > 0;
                  const isSelected = selectedDate === dateStr;
                  
                  return (
                    <button 
                      key={d} 
                      onClick={() => setSelectedDate(dateStr)}
                      className={`relative h-10 w-full flex items-center justify-center rounded-full text-sm font-body-md transition-colors ${isSelected ? 'bg-primary text-white' : 'hover:bg-primary/10 text-primary'}`}
                    >
                      {d}
                      {hasBooking && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-secondary'}`}></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Day Details */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-primary/10"
                  >
                    <h3 className="font-label-caps text-xs tracking-widest text-primary/60 mb-4">SCHEDULE FOR {selectedDate}</h3>
                    {selectedDayBookings.length > 0 ? (
                      <div className="space-y-4">
                        {selectedDayBookings.map(b => (
                          <div key={b.id} className="flex gap-4 items-start">
                            <div className="font-mono text-sm text-secondary font-bold whitespace-nowrap">{b.sessionTime || 'TBD'}</div>
                            <div>
                              <p className="font-bold text-primary text-sm">{b.clientName}</p>
                              <p className="text-xs text-primary/60">{b.packageId.toUpperCase()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-primary/40 italic">No bookings for this date.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Col: Booking List */}
          <div className="lg:col-span-2 grid gap-6 content-start">
            {bookings.map((booking) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#fbf9f5] border border-primary/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  
                  {/* Client Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-headline-lg text-2xl text-primary">{booking.clientName}</h2>
                      <span className="bg-primary/10 text-primary text-xs font-bold font-mono px-2 py-1 rounded">
                        {booking.bookingCode}
                      </span>
                      <button 
                        onClick={() => setDeleteConfirmId(booking.id)}
                        className="ml-auto text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center justify-center"
                        title="Hapus Booking"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 text-sm font-body-md text-secondary">
                      <div className="flex flex-wrap gap-4">
                        <span className="flex items-center gap-1 font-bold text-primary bg-primary/5 px-2 py-1 rounded"><span className="material-symbols-outlined text-sm">event</span> {formatDate(booking.sessionDate)}</span>
                        <span className="flex items-center gap-1 font-bold text-primary bg-primary/5 px-2 py-1 rounded"><span className="material-symbols-outlined text-sm">schedule</span> {booking.sessionTime || "TBD"}</span>
                      </div>
                      <div className="flex flex-wrap gap-6 text-primary/70">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">mail</span> {booking.email || booking.clientEmail}</span>
                        <a 
                          href={getWhatsAppLink(booking.phone || booking.clientPhone)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-[#25D366] transition-colors cursor-pointer font-bold"
                          title="Chat via WhatsApp"
                        >
                          <span className="material-symbols-outlined text-sm">call</span> {booking.phone || booking.clientPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Status & Upload */}
                  <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                    {renderBookingStatus(booking)}

                    <button 
                      onClick={() => handleAllowReschedule(booking.id)}
                      className={`flex items-center gap-1 text-[10px] font-label-caps tracking-widest px-3 py-1.5 rounded transition-colors ${booking.rescheduleAllowed ? 'bg-green-100 text-green-700 font-bold cursor-default' : 'text-secondary bg-secondary/10 hover:bg-secondary/20 font-bold'}`}
                      disabled={booking.rescheduleAllowed}
                    >
                      <span className="material-symbols-outlined text-sm">edit_calendar</span> 
                      {booking.rescheduleAllowed ? "RESCHEDULE ENABLED" : "ALLOW RESCHEDULE"}
                    </button>

                    {/* Only show upload input if DP is paid and it's not pending */}
                    {["booking_confirmed", "on_progress", "editing", "awaiting_pelunasan", "ready_to_download"].includes(booking.progress) && (
                      <div className="w-full sm:w-64">
                        <label className="text-[10px] font-label-caps tracking-widest text-primary/60 mb-1 block">GOOGLE DRIVE LINK</label>
                        <input 
                          type="url"
                          defaultValue={booking.downloadUrl || ""}
                          placeholder="Paste GDrive link and press Enter"
                          className="w-full bg-white border border-primary/20 rounded-lg px-3 py-2 text-xs font-body-md focus:outline-none focus:border-secondary transition-colors"
                          onBlur={(e) => {
                            if(e.target.value !== booking.downloadUrl && e.target.value.trim() !== "") {
                              handleUpdateLink(booking.id, e.target.value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-20 bg-[#fbf9f5] border border-primary/10 rounded-3xl">
                <span className="material-symbols-outlined text-5xl text-primary/20 mb-4">inbox</span>
                <p className="font-headline-lg text-primary text-xl">No bookings found.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#fbf9f5] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-primary/10"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="font-headline-lg text-2xl text-primary mb-2">Hapus Pesanan?</h3>
              <p className="text-secondary font-body-md text-sm mb-8">
                Tindakan ini tidak bisa dibatalkan. Seluruh data pesanan ini akan hilang selamanya dari sistem.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 rounded-full font-label-caps text-xs tracking-widest text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
                >
                  BATAL
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 py-3 rounded-full font-label-caps text-xs tracking-widest text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  HAPUS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
