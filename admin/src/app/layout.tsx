import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
    subsets: ["arabic"],
    weight: ["300", "400", "700", "800"],
    variable: "--font-almarai",
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
            <body className={`${almarai.variable} font-body antialiased`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
