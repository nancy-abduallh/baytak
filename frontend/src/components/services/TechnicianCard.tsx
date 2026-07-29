import { BadgeCheck, Star } from "lucide-react";
import { Technician } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function TechnicianCard({ tech }: { tech: Technician }) {
    return (
        <div className="mb-3.5 grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-5 rounded-md border border-line bg-white p-5 transition hover:shadow-card">
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
            <Button variant="dark">احجز الآن</Button>
        </div>
    );
}