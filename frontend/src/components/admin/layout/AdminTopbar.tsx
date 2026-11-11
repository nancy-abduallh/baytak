"use client";
import { useEffect, useState } from "react";
import { Calendar, Sparkles } from "lucide-react";

export function AdminTopbar({ title, description }: { title: string; description?: string }) {
    const [today, setToday] = useState("");

    useEffect(() => {
        setToday(new Intl.DateTimeFormat("ar-SA", { weekday: "long", day: "numeric", month: "long" }).format(new Date()));
    }, []);

    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
                <div className="mb-2 flex items-center gap-2 text-[11.5px] font-bold text-teal-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    لوحة التحكم الإدارية
                </div>
                <h1 className="font-heading text-[26px] font-extrabold text-ink">{title}</h1>
                {description && <p className="mt-1.5 text-[13.5px] text-[#63756F]">{description}</p>}
                <div className="mt-3 h-[3px] w-14 rounded-full" style={{ background: "linear-gradient(90deg,#1E6B5C,#4C9A6A)" }} />
            </div>

            {today && (
                <div className="card-elevated flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] font-semibold text-[#57655F]">
                    <Calendar className="h-4 w-4 text-teal-700" />
                    {today}
                </div>
            )}
        </div>
    );
}