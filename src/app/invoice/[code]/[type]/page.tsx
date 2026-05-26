"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function InvoicePage() {
  const { code, type } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-headline-lg">Loading Invoice...</div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center font-headline-lg">Invoice not found.</div>;

  const isDp = type === 'dp';
  const amount = booking.packagePrice / 2;
  const isPaid = isDp ? booking.dpPaid : booking.pelunasanPaid;

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-16 font-body-md overflow-x-hidden">
      {/* Hide print button when printing */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-end print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-primary text-white px-6 py-2 rounded-full font-label-caps tracking-widest text-xs hover:bg-secondary transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">print</span>
          PRINT INVOICE
        </button>
      </div>

      <div className="max-w-4xl mx-auto border border-black/10 rounded-xl p-5 md:p-16 shadow-2xl print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 md:mb-16 pb-6 md:pb-8 border-b border-black/10 gap-4">
          <div>
            <h1 className="font-headline-xl text-3xl md:text-4xl mb-2 text-primary">Este.Photograph</h1>
            <p className="text-sm text-black/60">Capturing timeless editorial stories.</p>
            <p className="text-sm text-black/60 mt-4">@estephotograph<br/>+62 815 1596 4494</p>
          </div>
          <div className="md:text-right">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-black/20 uppercase tracking-widest mb-3">INVOICE</h2>
            <p className="font-mono font-bold text-lg md:text-xl">{booking.bookingCode}-{isDp ? 'DP' : 'FNL'}</p>
            <p className="text-sm mt-2 font-label-caps tracking-widest text-black/40">DATE ISSUED</p>
            <p className="text-sm font-bold">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Client Info & Status */}
        <div className="flex flex-col md:flex-row justify-between mb-10 md:mb-16 gap-6">
          <div>
            <p className="text-[10px] font-label-caps tracking-widest text-black/40 mb-2">BILLED TO</p>
            <p className="font-headline-lg text-xl md:text-2xl mb-1">{booking.clientName}</p>
            <p className="text-sm text-black/60">{booking.email}</p>
            <p className="text-sm text-black/60">{booking.phone}</p>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] font-label-caps tracking-widest text-black/40 mb-2">PAYMENT STATUS</p>
            {isPaid ? (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-bold text-sm">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                PAID
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-sm">
                <span className="material-symbols-outlined text-sm">pending</span>
                UNPAID
              </div>
            )}
            
            <p className="text-[10px] font-label-caps tracking-widest text-black/40 mt-4 mb-1">SESSION SCHED</p>
            <p className="font-bold text-sm">{booking.sessionDate} at {booking.sessionTime}</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left mb-16">
          <thead>
            <tr className="border-b-2 border-black/80 font-label-caps tracking-widest text-xs">
              <th className="pb-4">DESCRIPTION</th>
              <th className="pb-4 text-center">QTY</th>
              <th className="pb-4 text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {isDp ? (
              <tr className="border-b border-black/10">
                <td className="py-6">
                  <p className="font-bold text-lg">Down Payment (50%)</p>
                  <p className="text-sm text-black/60 mt-1">For Photography Package: {booking.packageId.toUpperCase()}</p>
                </td>
                <td className="py-6 text-center font-mono">1</td>
                <td className="py-6 text-right font-mono font-bold text-lg">Rp{amount.toLocaleString('id-ID')}</td>
              </tr>
            ) : (
              <>
                <tr className="border-b border-black/10">
                  <td className="py-6">
                    <p className="font-bold text-lg">Photography Package: {booking.packageId.toUpperCase()}</p>
                    <p className="text-sm text-black/60 mt-1">Full Package Price</p>
                  </td>
                  <td className="py-6 text-center font-mono">1</td>
                  <td className="py-6 text-right font-mono font-bold text-lg">Rp{(booking.packagePrice).toLocaleString('id-ID')}</td>
                </tr>
                <tr className="border-b border-black/10">
                  <td className="py-6">
                    <p className="font-bold text-lg text-black/60">Less: Down Payment (Paid)</p>
                  </td>
                  <td className="py-6 text-center font-mono text-black/60">1</td>
                  <td className="py-6 text-right font-mono font-bold text-lg text-black/60">- Rp{amount.toLocaleString('id-ID')}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mb-10 md:mb-16">
          <div className="w-full md:w-64">
            <div className="flex justify-between mb-2">
              <span className="text-black/60">Subtotal</span>
              <span className="font-mono">Rp{amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b border-black/10">
              <span className="text-black/60">Tax / Admin Fee</span>
              <span className="font-mono">Rp0</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>TOTAL</span>
              <span className="font-mono">Rp{amount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-black/40 text-sm border-t border-black/10 pt-8">
          <p>Thank you for choosing Este Photograph. We look forward to capturing your moments.</p>
        </div>

      </div>
    </main>
  );
}
