import type { Metadata } from "next";
import { Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google";
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
    title: "بيتك | لوحة التحكم",
    description: "لوحة تحكم إدارية لمنصة بيتك — إدارة الطلبات والفنيين والمستخدمين.",
    robots: { index: false, follow: false }, // never indexed — admin surface
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body className={`${tajawal.variable} ${plexArabic.variable} font-body antialiased`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}