"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const portfolioImages = [
  {
    "id": 1,
    "url": "/FOTO2/DSC01607.JPG",
    "title": "Graduation Session 1"
  },
  {
    "id": 2,
    "url": "/FOTO2/DSC01653.JPG",
    "title": "Graduation Session 2"
  },
  {
    "id": 3,
    "url": "/FOTO2/DSC05783.jpg",
    "title": "Graduation Session 3"
  },
  {
    "id": 4,
    "url": "/FOTO2/DSC05839.jpg",
    "title": "Graduation Session 4"
  },
  {
    "id": 5,
    "url": "/FOTO2/DSCF0102.JPG",
    "title": "Graduation Session 5"
  },
  {
    "id": 6,
    "url": "/FOTO2/DSCF0123.JPG",
    "title": "Graduation Session 6"
  },
  {
    "id": 7,
    "url": "/FOTO2/DSCF0127.JPG",
    "title": "Graduation Session 7"
  },
  {
    "id": 8,
    "url": "/FOTO2/DSCF0131.JPG",
    "title": "Graduation Session 8"
  },
  {
    "id": 9,
    "url": "/FOTO2/DSCF0808.jpg",
    "title": "Graduation Session 9"
  },
  {
    "id": 10,
    "url": "/FOTO2/DSCF3323.JPG",
    "title": "Graduation Session 10"
  },
  {
    "id": 11,
    "url": "/FOTO2/DSCF3357.JPG",
    "title": "Graduation Session 11"
  },
  {
    "id": 12,
    "url": "/FOTO2/DSCF4204.jpg",
    "title": "Graduation Session 12"
  },
  {
    "id": 13,
    "url": "/FOTO2/DSCF4545.jpg",
    "title": "Graduation Session 13"
  },
  {
    "id": 14,
    "url": "/FOTO2/DSCF4877.jpg",
    "title": "Graduation Session 14"
  },
  {
    "id": 15,
    "url": "/FOTO2/DSCF4887.jpg",
    "title": "Graduation Session 15"
  },
  {
    "id": 16,
    "url": "/FOTO2/DSCF4896.jpg",
    "title": "Graduation Session 16"
  },
  {
    "id": 17,
    "url": "/FOTO2/DSCF4919.jpg",
    "title": "Graduation Session 17"
  },
  {
    "id": 18,
    "url": "/FOTO2/DSCF4922.jpg",
    "title": "Graduation Session 18"
  },
  {
    "id": 19,
    "url": "/FOTO2/DSCF5014.jpg",
    "title": "Graduation Session 19"
  },
  {
    "id": 20,
    "url": "/FOTO2/DSCF5335.jpg",
    "title": "Graduation Session 20"
  },
  {
    "id": 21,
    "url": "/FOTO2/DSCF5373.jpg",
    "title": "Graduation Session 21"
  },
  {
    "id": 22,
    "url": "/FOTO2/DSCF5382.JPG",
    "title": "Graduation Session 22"
  },
  {
    "id": 23,
    "url": "/FOTO2/DSCF5421.JPG",
    "title": "Graduation Session 23"
  },
  {
    "id": 24,
    "url": "/FOTO2/DSCF5468.jpg",
    "title": "Graduation Session 24"
  },
  {
    "id": 25,
    "url": "/FOTO2/DSCF5514.jpg",
    "title": "Graduation Session 25"
  },
  {
    "id": 26,
    "url": "/FOTO2/DSCF5521.jpg",
    "title": "Graduation Session 26"
  },
  {
    "id": 27,
    "url": "/FOTO2/DSCF5950.jpg",
    "title": "Graduation Session 27"
  },
  {
    "id": 28,
    "url": "/FOTO2/DSCF5957.jpg",
    "title": "Graduation Session 28"
  },
  {
    "id": 29,
    "url": "/FOTO2/DSCF5975.jpg",
    "title": "Graduation Session 29"
  },
  {
    "id": 30,
    "url": "/FOTO2/DSCF6009.jpg",
    "title": "Graduation Session 30"
  },
  {
    "id": 31,
    "url": "/FOTO2/DSCF6074.jpg",
    "title": "Graduation Session 31"
  },
  {
    "id": 32,
    "url": "/FOTO2/DSCF6095.jpg",
    "title": "Graduation Session 32"
  },
  {
    "id": 33,
    "url": "/FOTO2/DSCF7931.jpg",
    "title": "Graduation Session 33"
  },
  {
    "id": 34,
    "url": "/FOTO2/DSCF7951.jpg",
    "title": "Graduation Session 34"
  },
  {
    "id": 35,
    "url": "/FOTO2/DSCF9110.jpg",
    "title": "Graduation Session 35"
  },
  {
    "id": 36,
    "url": "/FOTO2/DSCF9131.jpg",
    "title": "Graduation Session 36"
  },
  {
    "id": 37,
    "url": "/FOTO2/DSCF9140.jpg",
    "title": "Graduation Session 37"
  },
  {
    "id": 38,
    "url": "/FOTO2/DSCF9250.jpg",
    "title": "Graduation Session 38"
  },
  {
    "id": 39,
    "url": "/FOTO2/DSCF9286.jpg",
    "title": "Graduation Session 39"
  },
  {
    "id": 40,
    "url": "/FOTO2/DSCF9317.jpg",
    "title": "Graduation Session 40"
  },
  {
    "id": 41,
    "url": "/FOTO2/DSCF9345.jpg",
    "title": "Graduation Session 41"
  },
  {
    "id": 42,
    "url": "/FOTO2/DSCF9539.jpg",
    "title": "Graduation Session 42"
  },
  {
    "id": 43,
    "url": "/FOTO2/DSCF9630.jpg",
    "title": "Graduation Session 43"
  },
  {
    "id": 44,
    "url": "/FOTO2/DSCF9762.jpg",
    "title": "Graduation Session 44"
  },
  {
    "id": 45,
    "url": "/FOTO2/_DSC0668.jpg",
    "title": "Graduation Session 45"
  },
  {
    "id": 46,
    "url": "/FOTO2/_DSC0689.jpg",
    "title": "Graduation Session 46"
  },
  {
    "id": 47,
    "url": "/FOTO2/_DSC0743.jpg",
    "title": "Graduation Session 47"
  },
  {
    "id": 48,
    "url": "/FOTO2/_DSC0782.jpg",
    "title": "Graduation Session 48"
  },
  {
    "id": 49,
    "url": "/FOTO2/_DSC0944.jpg",
    "title": "Graduation Session 49"
  },
  {
    "id": 50,
    "url": "/FOTO2/_DSC0998.jpg",
    "title": "Graduation Session 50"
  },
  {
    "id": 51,
    "url": "/FOTO2/_DSC1067.jpg",
    "title": "Graduation Session 51"
  },
  {
    "id": 52,
    "url": "/FOTO2/_DSC1209.jpg",
    "title": "Graduation Session 52"
  },
  {
    "id": 53,
    "url": "/FOTO2/_DSC1265.jpg",
    "title": "Graduation Session 53"
  },
  {
    "id": 54,
    "url": "/FOTO2/_DSC1318.jpg",
    "title": "Graduation Session 54"
  },
  {
    "id": 55,
    "url": "/FOTO2/_DSC1352.jpg",
    "title": "Graduation Session 55"
  },
  {
    "id": 56,
    "url": "/FOTO2/_DSC1379.jpg",
    "title": "Graduation Session 56"
  },
  {
    "id": 57,
    "url": "/FOTO2/_DSC1394.jpg",
    "title": "Graduation Session 57"
  },
  {
    "id": 58,
    "url": "/FOTO2/_DSC1438.jpg",
    "title": "Graduation Session 58"
  },
  {
    "id": 59,
    "url": "/FOTO2/_DSC1462.jpg",
    "title": "Graduation Session 59"
  },
  {
    "id": 60,
    "url": "/FOTO2/_DSC1473.jpg",
    "title": "Graduation Session 60"
  },
  {
    "id": 61,
    "url": "/FOTO2/_DSC1581.jpg",
    "title": "Graduation Session 61"
  }
];

export default function Portfolio() {
  return (
    <main className="min-h-screen pt-20 md:pt-32 pb-24 md:pb-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        <h1 className="font-headline-xl text-4xl md:text-7xl text-primary tracking-tight mb-4">Our Gallery</h1>
        <p className="font-editorial-accent text-2xl md:text-4xl text-secondary max-w-2xl mx-auto">
          Timeless stories preserved in every frame.
        </p>
      </motion.div>

      {/* Masonry Grid (Pinterest Style) */}
      <div className="columns-2 lg:columns-3 gap-3 md:gap-6">
        {portfolioImages.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="break-inside-avoid relative group overflow-hidden rounded-xl md:rounded-2xl bg-surface-variant/30 mb-3 md:mb-6"
          >
            <Image 
              src={img.url} 
              alt={img.title}
              width={800}
              height={1200}
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3 md:p-6">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 w-full">
                <p className="font-label-caps text-[8px] md:text-xs text-secondary-fixed tracking-widest mb-1">GRADUATION</p>
                <h3 className="font-headline-lg text-sm md:text-2xl text-white leading-tight">{img.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-24 text-center"
      >
        <p className="font-headline-lg text-2xl text-primary mb-6">Ready to create your own story?</p>
        <Link href="/book" className="inline-block bg-primary text-white px-8 py-4 rounded-full font-label-caps tracking-widest hover:bg-secondary hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95">
          BOOK YOUR SESSION
        </Link>
      </motion.div>

    </main>
  );
}
