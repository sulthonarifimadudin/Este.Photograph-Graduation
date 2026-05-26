import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClientWrapper from "../components/ClientWrapper";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const madeTommy = localFont({
  src: "../../public/fonts/MADE Tommy Soft Bold PERSONAL USE.otf",
  variable: "--font-made",
});

const authenticSignature = localFont({
  src: "../../public/fonts/Authentic Signature.otf",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Este Photograph - Graduation",
  description: "Capturing timeless editorial stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${madeTommy.variable} ${authenticSignature.variable} scroll-smooth`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-body-md bg-background text-on-background selection:bg-secondary/20 selection:text-primary antialiased">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
