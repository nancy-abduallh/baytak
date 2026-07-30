"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => { console.error(error); }, [error]);

    return (
        <main className="mx-auto flex min-h-[60vh] max-w-[480px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-danger/10 text-danger">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <h1 className="mb-2 text-xl font-extrabold">حدث خطأ غير متوقع</h1>
            <p className="mb-6 text-[13.5px] text-[#63756F]">تعذر تحميل هذه الصفحة. تأكد من تشغيل الخادم الخلفي على المنفذ 4000 ثم حاول مرة أخرى.</p>
            <Button variant="dark" onClick={reset}>إعادة المحاولة</Button>
        </main>
    );
}