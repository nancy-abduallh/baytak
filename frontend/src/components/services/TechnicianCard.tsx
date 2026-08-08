import { BadgeCheck, Star, Heart } from "lucide-react";
import clsx from "clsx";
import { Technician } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TechnicianAvatar } from "./TechnicianAvatar";

export function TechnicianCard({
    tech, isFavorite = false, onToggleFavorite,
}: {
    tech: Technician;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}) {
    return (
        <div className="mb-3.5 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 rounded-md border border-line bg-white p-4 transition hover:shadow-card sm:p-5 lg:grid-cols-[auto_auto_1fr_auto_auto_auto] lg:gap-5">
            <div className="col-span-2 flex items-center gap-4 lg:contents">
                {onToggleFavorite && (
                    <button
                        onClick={onToggleFavorite}
                        aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                        className={clsx(
                            "order-2 grid h-9 w-9 flex-none place-items-center rounded-full border transition lg:order-none",
                            isFavorite ? "border-danger/30 bg-danger/10 text-danger" : "border-line text-[#B7C1BC] hover:text-danger"
                        )}
                    >
                        <Heart className={clsx("h-[18px] w-[18px]", isFavorite && "fill-current")} />
                    </button>
                )}
                <TechnicianAvatar fullName={tech.fullName} initials={tech.initials} avatarUrl={tech.avatarUrl} size="lg" className="order-1 flex-none lg:order-none" />
                <div className="order-1 min-w-0 flex-1 lg:order-none">
                    <h4 className="mb-1 flex items-center gap-2 text-[15px] font-bold sm:text-base">
                        {tech.fullName}
                        {tech.isVerified && <BadgeCheck className="h-4 w-4 flex-none text-green-500" />}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12.5px] text-[#8A9691] sm:text-[13px]">
                        <span>فني {tech.categoryLabel}</span><span className="hidden sm:inline">·</span>
                        <span>+{tech.yearsExperience} سنوات خبرة</span><span className="hidden sm:inline">·</span>
                        <span>{tech.district}{tech.distanceKm ? ` (${tech.distanceKm} كم)` : ""}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5 self-start justify-self-start rounded-full bg-gold-100 px-2.5 py-1 text-[12.5px] font-bold text-[#8A6417] lg:self-auto lg:justify-self-auto">
                <Star className="h-3.5 w-3.5 fill-current" /> {tech.averageRating}
                <span className="opacity-60">({tech.reviewCount})</span>
            </div>

            <div className="text-end lg:text-center">
                <div className="font-heading text-base font-extrabold sm:text-lg">{tech.priceFrom} ر.س</div>
                <div className="text-[11.5px] text-[#8A9691]">بداية السعر</div>
            </div>

            <Button href={`/booking/${tech.id}`} variant="dark" className="col-span-2 justify-center lg:col-span-1 lg:justify-start">احجز الآن</Button>
        </div>
    );
}