"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-16 pb-24 md:pb-40">
        {/* Hero Section: Editorial Collage */}
        <section className="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 md:py-stack-lg min-h-[auto] md:min-h-[70vh] flex flex-col md:flex-row items-center justify-center gap-gutter overflow-hidden">
          {/* Background Texture/Soft Blur Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-fixed-dim/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-fixed-dim/30 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-24 relative">
            {/* Left Title/Typography Area */}
            <div className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              <h1 className="flex flex-col relative z-20 items-center md:items-start text-center md:text-left mb-2 md:mb-0">
                <div 
                  className="relative z-10 font-display-lg text-[34px] sm:text-[50px] md:text-[65px] lg:text-[75px] tracking-tight leading-none"
                  style={{ 
                    color: "black", 
                    WebkitTextStroke: "8px #fbf9f5",
                    paintOrder: "stroke fill",
                    filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.08))"
                  }}
                >
                  Este.Photograph
                </div>
                <div 
                  className="relative font-editorial-accent text-[46px] sm:text-[65px] md:text-[85px] lg:text-[100px] whitespace-nowrap z-20 -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16 ml-3 sm:ml-6 md:ml-10 lg:ml-14 transform -rotate-3"
                  style={{ 
                    color: "#9c7661", /* Muted warm brown */
                    WebkitTextStroke: "6px #fbf9f5", /* Thick stroke matching background to create the 'gap' effect */
                    paintOrder: "stroke fill",
                  }}
                >
                  Graduation
                </div>
              </h1>
              <p className="font-body-lg text-sm md:text-body-lg text-on-surface-variant max-w-md mt-2">
                Capturing timeless editorial stories. Professional graduation photography that elevates your milestone into a cinematic memory.
              </p>
              <Link
                className="mt-8 inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-label-caps hover:bg-secondary hover:-translate-y-1 transition-all duration-300 shadow-lg group"
                href="/book"
              >
                View Packages
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
            {/* Right Collage Area */}
            <div className="w-full md:w-7/12 relative h-[300px] sm:h-[380px] md:h-[520px] flex justify-center items-center perspective-[1000px]">
              {/* Central Large Image */}
              <div className="absolute z-20 w-[65%] md:w-[55%] h-[80%] rounded-xl overflow-hidden collage-shadow border-4 border-white transform transition-transform hover:scale-[1.02] duration-500 ease-out bg-surface-container-high">
                <img
                  alt="Cinematic graduation portrait"
                  className="w-full h-full object-cover object-right"
                  src="/FOTO2/Foto%20di%20Hompage/TENGAH%20UTAMA.JPG"
                />
              </div>
              {/* Left Secondary Image */}
              <div className="absolute z-10 left-[5%] top-[10%] w-[40%] h-[45%] rounded-lg overflow-hidden collage-shadow border-4 border-white transform -rotate-3 transition-transform hover:rotate-0 hover:z-30 duration-500 ease-out bg-surface-container-high">
                <img
                  alt="Group of family and friends celebrating"
                  className="w-full h-full object-cover object-center"
                  src="/FOTO2/Foto%20di%20Hompage/_DSC1311.jpg"
                />
              </div>
              {/* Left Bottom Image */}
              <div className="absolute z-15 left-[0%] bottom-[5%] w-[45%] h-[40%] rounded-lg overflow-hidden collage-shadow border-4 border-white transform rotate-2 transition-transform hover:rotate-0 hover:z-30 duration-500 ease-out bg-surface-container-high">
                <img
                  alt="Male graduate smiling confidently"
                  className="w-full h-full object-cover object-center"
                  src="/FOTO2/Foto%20di%20Hompage/DSC01618.JPG"
                />
              </div>
              {/* Right Secondary Image */}
              <div className="absolute z-10 right-[5%] top-[5%] w-[40%] h-[50%] rounded-lg overflow-hidden collage-shadow border-4 border-white transform rotate-6 transition-transform hover:rotate-0 hover:z-30 duration-500 ease-out bg-surface-container-high">
                <img
                  alt="Female graduate looking thoughtfully"
                  className="w-full h-full object-cover object-center"
                  src="/FOTO2/Foto%20di%20Hompage/DSCF4877.jpg"
                />
              </div>
              {/* Right Bottom Image */}
              <div className="absolute z-15 right-[0%] bottom-[10%] w-[45%] h-[35%] rounded-lg overflow-hidden collage-shadow border-4 border-white transform -rotate-4 transition-transform hover:rotate-0 hover:z-30 duration-500 ease-out bg-surface-container-high">
                <img
                  alt="Proud young man in graduation attire"
                  className="w-full h-full object-cover object-center"
                  src="/FOTO2/Foto%20di%20Hompage/DSCF5847.jpg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section (Glassmorphic Cards) */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-stack-lg relative" 
          id="packages"
        >
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">Investment</h2>
            <p className="font-editorial-accent text-editorial-accent text-secondary max-w-2xl mx-auto">
              Curated packages to preserve your memories.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Package 1: Premium */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass-panel rounded-2xl p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-300 flex flex-col h-full border-t border-t-white/60"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-surface-variant/40 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500"></div>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Premium</h3>
              <div className="text-xs font-label-caps tracking-widest text-secondary mb-6 border-b border-primary/10 pb-4">PACKAGE</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">250k</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">1 Hour Session</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">15 Photos Edited</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">Only your family</span>
                </li>
              </ul>
              <Link href="/book" className="w-full block text-center py-3 px-6 rounded-full border border-primary/20 text-primary font-label-caps group-hover:bg-primary group-hover:text-white transition-colors duration-300 mt-auto">Book Premium</Link>
            </motion.div>
            
            {/* Package 2: Eksklusif */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass-panel rounded-2xl p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-300 flex flex-col h-full border-t border-t-white/60 translate-y-0 lg:translate-y-8"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed-dim/20 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500"></div>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Eksklusif</h3>
              <div className="text-xs font-label-caps tracking-widest text-secondary mb-6 border-b border-primary/10 pb-4">PACKAGE</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">325k</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">1 Hour Session</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">25 Photos Edited</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">Invite your bestie n friends</span>
                </li>
              </ul>
              <Link href="/book" className="w-full block text-center py-3 px-6 rounded-full border border-primary/20 text-primary font-label-caps group-hover:bg-primary group-hover:text-white transition-colors duration-300 mt-auto">Book Eksklusif</Link>
            </motion.div>

            {/* Package 3: Ultimate (Featured) */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-primary rounded-2xl p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex flex-col h-full text-white shadow-xl lg:-translate-y-4"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/30 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500 blur-2xl"></div>
              <div className="absolute top-4 right-4 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">Most Popular</div>
              <h3 className="font-headline-lg text-headline-lg text-white mb-2 mt-4">Ultimate</h3>
              <div className="text-xs font-label-caps tracking-widest text-secondary-fixed mb-6 border-b border-white/20 pb-4">PACKAGE</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-headline-xl text-headline-xl text-white font-bold">400k</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary-fixed text-sm mt-1">check</span>
                  <span className="font-body-md text-white/90 font-medium">2 Hour Session</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary-fixed text-sm mt-1">check</span>
                  <span className="font-body-md text-white/90 font-medium">All Photos Edited</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary-fixed text-sm mt-1">check</span>
                  <span className="font-body-md text-white/90 font-medium">All benefits in Premium n Eksklusif package</span>
                </li>
              </ul>
              <Link href="/book" className="w-full block text-center py-3 px-6 rounded-full bg-secondary text-white font-label-caps group-hover:bg-white group-hover:text-primary transition-colors duration-300 mt-auto shadow-lg">Book Ultimate</Link>
            </motion.div>

            {/* Package 4: Grup Edition */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass-panel rounded-2xl p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-300 flex flex-col h-full border-t border-t-white/60 translate-y-0 lg:translate-y-8"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-surface-variant/40 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500"></div>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Grup Edition</h3>
              <div className="text-xs font-label-caps tracking-widest text-secondary mb-6 border-b border-primary/10 pb-4">PACKAGE</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">600k</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">3 Hour Session</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">All Photos Edited</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm mt-1">check</span>
                  <span className="font-body-md text-on-surface-variant font-medium">Invite up to 6 members</span>
                </li>
              </ul>
              <Link href="/book" className="w-full block text-center py-3 px-6 rounded-full border border-primary/20 text-primary font-label-caps group-hover:bg-primary group-hover:text-white transition-colors duration-300 mt-auto">Book Grup</Link>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
