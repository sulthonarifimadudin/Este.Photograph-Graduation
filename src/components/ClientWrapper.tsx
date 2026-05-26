"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b border-primary/10 transition-all duration-300 ${
          scrolled ? "shadow-md bg-white/80" : "bg-white/40 dark:bg-primary-container/40"
        }`}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto relative">
          <Link
            className="font-headline-lg text-headline-lg tracking-tight text-primary dark:text-primary-fixed z-10"
            href="/"
          >
            <span className="font-extrabold tracking-tighter">Este.Photograph</span>
          </Link>
          <nav className="flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8 z-10">
            <Link
              className={`hover:text-primary hover:bg-white/10 transition-all duration-300 font-body-md text-body-md px-3 py-2 rounded-md ${pathname === '/portfolio' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant'}`}
              href="/portfolio"
            >
              Gallery
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary hover:bg-white/10 transition-all duration-300 font-body-md text-body-md px-3 py-2 rounded-md"
              href="/#packages"
            >
              Services
            </Link>
            <Link
              className={`hover:text-primary transition-all duration-300 font-body-md text-body-md px-3 py-2 rounded-md ${pathname === '/book' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant'}`}
              href="/book"
            >
              Book Now
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-caps text-label-caps hover:bg-secondary transition-colors duration-300 scale-95 active:scale-90 shadow-md"
              href="/track"
            >
              Track Booking
            </Link>
          </div>
        </div>

        {/* Mobile Header — 3 nav links shown directly */}
        <div className="flex md:hidden justify-between items-center px-margin-mobile py-3 w-full">
          <Link
            className={`flex-1 text-center font-body-md text-sm py-1 transition-all duration-300 ${pathname === '/portfolio' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant'}`}
            href="/portfolio"
          >
            Gallery
          </Link>
          <Link
            className={`flex-1 text-center font-body-md text-sm py-1 transition-all duration-300 ${pathname === '/' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant'}`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`flex-1 text-center font-body-md text-sm py-1 transition-all duration-300 ${pathname === '/book' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant'}`}
            href="/book"
          >
            Book Now
          </Link>
        </div>
      </header>

      {/* Main Page Content */}
      {children}

      {/* Fixed Bottom Bar Footer */}
      <footer className={`fixed bottom-0 left-0 w-full py-4 bg-[#fbf9f5]/90 backdrop-blur-md border-t border-primary/10 z-50 transition-transform duration-500 ease-in-out ${scrolled ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-4 md:gap-8 w-full">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-label-caps text-[10px] text-on-surface-variant dark:text-on-primary-fixed-variant tracking-widest">
              © 2024 Este Photograph. Capturing timeless editorial stories.
            </span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest">Contact us for Book :</span>
            <div className="flex items-center gap-6 mt-2">
              <a className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group" href="tel:081515964494">
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">call</span>
                <span className="font-body-md font-semibold">081515964494</span>
              </a>
              <a className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group" href="https://instagram.com/estephotograph" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">photo_camera</span>
                <span className="font-body-md font-semibold">@estephotograph</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
