import { BadgeCheck, ShieldCheck, Tag, Headphones } from "lucide-react";

const ITEMS = [
    { icon: BadgeCheck, title: "فنيون موثوقون", desc: "تحقق من الهوية والخبرة قبل الاعتماد" },
    { icon: ShieldCheck, title: "ضمان على الخدمة", desc: "إعادة تنفيذ مجانية عند أي ملاحظة" },
    { icon: Tag, title: "أسعار تنافسية وواضحة", desc: "السعر معروف قبل تأكيد الحجز" },
    { icon: Headphones, title: "دعم متواصل ٢٤/٧", desc: "فريق دعم جاهز لأي طارئ في أي وقت" },
];

export function TrustBar() {
    return (
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-4 px-4 pt-12 pb-16 sm:grid-cols-2 sm:px-6 sm:pt-14 md:grid-cols-4 md:gap-5 md:px-10 md:pt-16 md:pb-24">
            {ITEMS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex min-w-0 items-center gap-4 rounded-md border border-line bg-white p-5 md:p-6">
                    <div className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-gold-100 text-gold-500">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="mb-0.5 text-[15px] font-bold">{title}</h4>
                        <p className="text-[12.5px] text-[#63756F]">{desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}