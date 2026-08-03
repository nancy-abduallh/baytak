"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Technician } from "@/lib/types";
import { TechnicianCard } from "@/components/services/TechnicianCard";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Technician[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        api.getFavorites().then(setFavorites).catch((err) => setError(err instanceof ApiError ? err.message : "تعذر تحميل المفضلة"));
    };

    useEffect(() => { load(); }, []);

    const remove = async (technicianId: number) => {
        setFavorites((prev) => prev?.filter((t) => t.id !== technicianId) ?? prev);
        try {
            await api.removeFavorite(technicianId);
        } catch {
            load();
        }
    };

    if (error) {
        return <div className="rounded-md border border-danger/30 bg-danger/5 p-6 text-[13.5px] font-semibold text-danger">{error}</div>;
    }

    if (!favorites) {
        return <div className="rounded-md border border-line bg-white p-10 text-center text-[13.5px] text-[#8A9691]">جارِ التحميل...</div>;
    }

    if (favorites.length === 0) {
        return (
            <div className="grid min-h-[300px] place-items-center rounded-md border border-dashed border-line bg-white text-center">
                <div>
                    <Heart className="mx-auto mb-3 h-8 w-8 text-[#B7C1BC]" />
                    <h3 className="mb-1.5 text-[15px] font-bold">لا يوجد فنيون في المفضلة بعد</h3>
                    <p className="mb-4 text-[13px] text-[#8A9691]">أضف الفنيين المفضلين لديك من صفحات الخدمات لتجدهم هنا بسهولة.</p>
                    <Link href="/services" className="text-[13px] font-bold text-teal-700">تصفّح الخدمات</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-5 text-2xl font-extrabold">المفضلة</h2>
            {favorites.map((tech) => (
                <TechnicianCard key={tech.id} tech={tech} isFavorite onToggleFavorite={() => remove(tech.id)} />
            ))}
        </div>
    );
}