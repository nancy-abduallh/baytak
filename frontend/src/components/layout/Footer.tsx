import { Home } from "lucide-react";

const FOOTER_LINKS = {
    services: ["سباكة", "كهرباء", "تكييف", "نجارة ودهانات"],
    company: ["من نحن", "انضم كفني", "الأسئلة الشائعة"],
    contact: ["9200 12345", "info@balady.sa", "www.balady.sa"],
};

export function Footer() {
    return (
        <footer className="bg-ink px-10 pb-7 pt-14 text-[#B9C7C2]">
            <div className="mx-auto grid max-w-[1360px] grid-cols-[1.3fr_.8fr_.8fr_.9fr] gap-10 border-b border-white/10 pb-9">
                <div>
                    <div className="mb-4 flex items-center gap-3">
                        <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-green-500">
                            <Home className="h-4 w-4 text-teal-900" />
                        </span>
                        <span className="font-heading text-[17px] font-black text-white">بيتك</span>
                    </div>
                    <p className="max-w-[280px] text-[13.5px] leading-[1.85]">
                        تطبيق متكامل لخدمات صيانة وتشغيل المنازل، يقدم لك حلولًا سريعة وموثوقة لجميع احتياجات منزلك، بإشراف بلدي.
                    </p>
                </div>
                <FooterColumn title="الخدمات" items={FOOTER_LINKS.services} />
                <FooterColumn title="الشركة" items={FOOTER_LINKS.company} />
                <FooterColumn title="تواصل معنا" items={FOOTER_LINKS.contact} />
            </div>
            <div className="mx-auto mt-5 flex max-w-[1360px] justify-between text-[12.5px] text-[#728882]">
                <span>© {new Date().getFullYear()} بلدي. جميع الحقوق محفوظة.</span>
                <span>متوفر في جميع مناطق المملكة</span>
            </div>
        </footer>
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