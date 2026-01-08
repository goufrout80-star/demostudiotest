import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Preloader from "@/components/layout/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STUDIO. | Digital Experience Agency",
  description: "We craft digital experiences that transcend the ordinary. Premium web design, development, and creative solutions.",
  keywords: ["web design", "digital agency", "creative studio", "web development", "UI/UX"],
  authors: [{ name: "Studio" }],
  openGraph: {
    title: "STUDIO. | Digital Experience Agency",
    description: "We craft digital experiences that transcend the ordinary.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        <SmoothScrollProvider>
          <Preloader />
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <div className="noise" />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
