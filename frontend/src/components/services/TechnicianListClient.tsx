"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Technician } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api } from "@/lib/api";
import { TechnicianCard } from "./TechnicianCard";

type SortBy = "rating" | "price" | "experience";

const SORT_LABELS: Record<SortBy, string> = {
    rating: "الأعلى تقييمًا",
    price: "الأقل سعرًا",
    experience: "الأكثر خبرة",
};

export function TechnicianListClient({
    technicians, categoryLabel, sortBy,
}: {
    technicians: Technician[]; categoryLabel: string; sortBy: SortBy;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const accessToken = useAuthStore((s) => s.accessToken);

    const [menuOpen, setMenuOpen] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (!accessToken) return;
        api.getFavoriteIds().then((ids) => setFavoriteIds(new Set(ids))).catch(() => undefined);
    }, [accessToken]);

    const changeSort = (next: SortBy) => {
        setMenuOpen(false);
        const params = new URLSearchParams(searchParams.toString());
        if (next === "rating") params.delete("sortBy"); else params.set("sortBy", next);
        const qs = params.toString();
        router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    };

    const toggleFavorite = async (technicianId: number) => {
        if (!accessToken) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        const isFav = favoriteIds.has(technicianId);
        setFavoriteIds((prev) => {
            const next = new Set(prev);
            if (isFav) next.delete(technicianId); else next.add(technicianId);
            return next;
        });
        try {
            if (isFav) await api.removeFavorite(technicianId); else await api.addFavorite(technicianId);
        } catch {
            // Revert optimistic update on failure
            setFavoriteIds((prev) => {
                const next = new Set(prev);
                if (isFav) next.add(technicianId); else next.delete(technicianId);
                return next;
            });
        }
    };

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div className="text-[14px] text-[#57655F]">
                    عرض <b className="text-ink">{technicians.length}</b> فني {categoryLabel} متاح
                </div>
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-semibold"
                    >
                        {SORT_LABELS[sortBy]} <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {menuOpen && (
                        <div className="absolute left-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-md border border-line bg-white shadow-card">
                            {(Object.keys(SORT_LABELS) as SortBy[]).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => changeSort(key)}
                                    className={`block w-full px-4 py-2.5 text-start text-[13px] font-semibold hover:bg-sand-100 ${key === sortBy ? "text-teal-700" : "text-[#57655F]"}`}
                                >
                                    {SORT_LABELS[key]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {technicians.map((tech) => (
                <TechnicianCard
                    key={tech.id}
                    tech={tech}
                    isFavorite={favoriteIds.has(tech.id)}
                    onToggleFavorite={() => toggleFavorite(tech.id)}
                />
            ))}
        </div>
    );
}