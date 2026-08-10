import Image from "next/image";
import { ChevronDown } from "lucide-react";

const FOOTER_LINKS = {
    services: ["سباكة", "كهرباء", "تكييف", "نجارة ودهانات"],
    company: ["من نحن", "انضم كفني", "الأسئلة الشائعة"],
    contact: ["9200 12345", "info@balady.sa", "www.balady.sa"],
};

export function Footer() {
    return (
        <footer className="bg-ink px-4 pb-6 pt-10 text-[#B9C7C2] md:px-10 md:pb-7 md:pt-14">
            <div className="mx-auto hidden max-w-[1360px] grid-cols-[1.3fr_.8fr_.8fr_.9fr] gap-10 border-b border-white/10 pb-9 md:grid">
                <FooterIntro />
                <FooterColumn title="الخدمات" items={FOOTER_LINKS.services} />
                <FooterColumn title="الشركة" items={FOOTER_LINKS.company} />
                <FooterColumn title="تواصل معنا" items={FOOTER_LINKS.contact} />
            </div>

            <div className="mx-auto max-w-[1360px] border-b border-white/10 pb-3 md:hidden">
                <FooterIntro />
                <div className="mt-7 divide-y divide-white/10">
                    <FooterDisclosure title="الخدمات" items={FOOTER_LINKS.services} />
                    <FooterDisclosure title="الشركة" items={FOOTER_LINKS.company} />
                    <FooterDisclosure title="تواصل معنا" items={FOOTER_LINKS.contact} />
                </div>
            </div>

            <div className="mx-auto mt-5 flex max-w-[1360px] flex-col gap-2 text-[12px] text-[#728882] md:flex-row md:justify-between md:text-[12.5px]">
                <span>© {new Date().getFullYear()} بلدي. جميع الحقوق محفوظة.</span>
                <span>متوفر في جميع مناطق المملكة</span>
            </div>
        </footer>
    );
}

function FooterIntro() {
    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <span className="relative h-[34px] w-[34px] flex-none overflow-hidden rounded-xl">
                    <Image src="/logo.png" alt="بيتك" fill sizes="34px" className="object-cover" />
                </span>
                <span className="font-heading text-[17px] font-black text-white">بيتك</span>
            </div>
            <p className="max-w-[280px] text-[13.5px] leading-[1.85]">
                تطبيق متكامل لخدمات صيانة وتشغيل المنازل، يقدم لك حلولًا سريعة وموثوقة لجميع احتياجات منزلك، بإشراف بلدي.
            </p>
        </div>
    );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h5 className="mb-4 text-[14.5px] font-bold text-white">{title}</h5>
            <ul className="space-y-2.5 text-[13.5px]">
                {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
        </div>
    );
}

function FooterDisclosure({ title, items }: { title: string; items: string[] }) {
    return (
        <details className="group py-1">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-[14px] font-bold text-white [&::-webkit-details-marker]:hidden">
                {title}
                <ChevronDown className="h-4 w-4 text-[#9FC2B7] transition-transform group-open:rotate-180" />
            </summary>
            <ul className="space-y-3 pb-4 text-[13px] leading-relaxed text-[#B9C7C2]">
                {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
        </details>
    );
}