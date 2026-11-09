import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بيتك | المنصة الأولى لخدمات صيانة المنازل بالمملكة",
  description: "كل خدمات صيانة بيتك في منصة واحدة وبثقة تامة — فنيين معتمدين ومرخصين، أسعار واضحة ومحددة، وضمان ذهبي لراحة بالك.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${almarai.variable} font-body antialiased`} suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
