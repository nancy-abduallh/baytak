import { BadgeCheck, Star, Heart } from "lucide-react";
import clsx from "clsx";
import { Technician } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function TechnicianCard({
    tech, isFavorite = false, onToggleFavorite,
}: {
    tech: Technician;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}) {
    return (
        <div className="mb-3.5 grid grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-5 rounded-md border border-line bg-white p-5 transition hover:shadow-card">
            {onToggleFavorite && (
                <button
                    onClick={onToggleFavorite}
                    aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    className={clsx(
                        "grid h-9 w-9 place-items-center rounded-full border transition",
                        isFavorite ? "border-danger/30 bg-danger/10 text-danger" : "border-line text-[#B7C1BC] hover:text-danger"
                    )}
                >
                    <Heart className={clsx("h-[18px] w-[18px]", isFavorite && "fill-current")} />
                </button>
            )}
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#DCEAE3] to-[#C6DED3] font-heading text-xl font-extrabold text-teal-700">
                {tech.initials}
            </div>
            <div>
                <h4 className="mb-1 flex items-center gap-2 text-base font-bold">
                    {tech.fullName}
                    {tech.isVerified && <BadgeCheck className="h-4 w-4 text-green-500" />}
                </h4>
                <div className="flex items-center gap-3.5 text-[13px] text-[#8A9691]">
                    <span>فني {tech.categoryLabel}</span><span>·</span>
                    <span>+{tech.yearsExperience} سنوات خبرة</span><span>·</span>
                    <span>{tech.district}{tech.distanceKm ? ` (${tech.distanceKm} كم)` : ""}</span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-1 text-[12.5px] font-bold text-[#8A6417]">
                <Star className="h-3.5 w-3.5 fill-current" /> {tech.averageRating}
                <span className="opacity-60">({tech.reviewCount})</span>
            </div>
            <div className="text-center">
                <div className="font-heading text-lg font-extrabold">{tech.priceFrom} ر.س</div>
                <div className="text-[11.5px] text-[#8A9691]">بداية السعر</div>
            </div>
            <Button href={`/booking/${tech.id}`} variant="dark">احجز الآن</Button>
        </div>
    );
}