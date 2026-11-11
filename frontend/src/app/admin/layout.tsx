import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "بيتك | لوحة التحكم",
    description: "لوحة تحكم إدارية لمنصة بيتك — إدارة الطلبات والفنيين والمستخدمين.",
    robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
