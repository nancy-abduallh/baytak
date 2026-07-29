import type { Metadata } from "next";
import { Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بيتك | صيانة وتشغيل المنازل",
  description: "كل خدمات صيانة منزلك في مكان واحد وبثقة — فنيون معتمدون، أسعار واضحة، ودعم على مدار الساعة.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} ${plexArabic.variable} font-body antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}