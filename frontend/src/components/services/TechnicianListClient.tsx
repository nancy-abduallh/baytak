"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Technician } from "@/lib/types";
import { TechnicianCard } from "./TechnicianCard";

export function TechnicianListClient({ technicians, categoryLabel }: { technicians: Technician[]; categoryLabel: string }) {
    const [sorted, setSorted] = useState(() => [...technicians].sort((a, b) => b.averageRating - a.averageRating));

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div className="text-[14px] text-[#57655F]">
                    عرض <b className="text-ink">{sorted.length}</b> فني {categoryLabel} متاح
                </div>
                <button
                    onClick={() => setSorted((prev) => [...prev].sort((a, b) => b.averageRating - a.averageRating))}
                    className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-semibold"
                >
                    الأعلى تقييمًا <ChevronDown className="h-3.5 w-3.5" />
                </button>
            </div>
            {sorted.map((tech) => <TechnicianCard key={tech.id} tech={tech} />)}
        </div>
    );
}