"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-40 px-margin-mobile">
      {/* Decorative background elements */}
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
            <span className="material-symbols-outlined text-3xl">lock</span>
          </Link>
          <h1 className="font-headline-xl text-3xl tracking-tight text-primary mb-2">Admin Login</h1>
          <p className="font-body-md text-on-surface-variant">Enter your credentials to access the studio panel.</p>
          <span className="absolute top-10 -right-4 font-editorial-accent text-5xl text-secondary/30 -z-10 rotate-[5deg]">Studio</span>
        </div>

        {error && (
          <div className="bg-red-50/80 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-200/50 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-label-caps tracking-widest text-primary ml-1">EMAIL ADDRESS</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl pointer-events-none">mail</span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/40 border border-primary/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all font-body-md text-primary placeholder:text-primary/30 shadow-inner"
                placeholder="admin@este.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-label-caps tracking-widest text-primary ml-1">PASSWORD</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl pointer-events-none">key</span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/40 border border-primary/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/80 transition-all font-body-md text-primary placeholder:text-primary/30 shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-full font-label-caps tracking-widest hover:bg-secondary hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-8"
          >
            {loading ? "Authenticating..." : "Sign In"}
            {!loading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
