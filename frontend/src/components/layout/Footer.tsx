import Image from "next/image";
import { Home, ChevronDown, Link2 } from "lucide-react";
import { api } from "@/lib/api";
import { SiteSettings } from "@/lib/types";

const FOOTER_NAV = {
    services: ["سباكة", "كهرباء", "تكييف", "نجارة ودهانات"],
    company: ["من نحن", "انضم كفني", "الأسئلة الشائعة"],
};

// Used only if the settings API is unreachable, so the footer never
// breaks the page even when the backend is down.
const FALLBACK_SETTINGS: SiteSettings = {
    siteName: "بيتك",
    footerDescription:
        "تطبيق متكامل لخدمات صيانة وتشغيل المنازل، يقدم لك حلولًا سريعة وموثوقة لجميع احتياجات منزلك، بإشراف بيتك.",
    availabilityNote: "متوفر في جميع مناطق المملكة",
    contactPhone: "9200 12345",
    contactWhatsapp: null,
    contactEmail: "info@baytak.sa",
    websiteUrl: "www.baytak.sa",
    address: null,
    workingHours: null,
    facebookUrl: null,
    twitterUrl: null,
    instagramUrl: null,
    tiktokUrl: null,
    copyrightText: null,
    updatedAt: "",
};

export async function Footer() {
    let settings: SiteSettings = FALLBACK_SETTINGS;
    try {
        settings = await api.getSiteSettings();
    } catch {
        // Keep the fallback values — the footer should always render.
    }

    const contactItems = [settings.contactPhone, settings.contactEmail, settings.websiteUrl].filter(
        (item): item is string => Boolean(item && item.trim()),
    );

    const footerLinks = {
        services: FOOTER_NAV.services,
        company: FOOTER_NAV.company,
        contact: contactItems,
    };

    return (
        <footer className="bg-ink px-4 pb-6 pt-10 text-[#B9C7C2] md:px-10 md:pb-7 md:pt-14">
            <div className="mx-auto hidden max-w-[1360px] grid-cols-[1.3fr_.8fr_.8fr_.9fr] gap-10 border-b border-white/10 pb-9 md:grid">
                <FooterIntro settings={settings} />
                <FooterColumn title="الخدمات" items={footerLinks.services} />
                <FooterColumn title="الشركة" items={footerLinks.company} />
                <FooterColumn title="تواصل معنا" items={footerLinks.contact} />
            </div>

            <div className="mx-auto max-w-[1360px] border-b border-white/10 pb-3 md:hidden">
                <FooterIntro settings={settings} />
                <div className="mt-7 divide-y divide-white/10">
                    <FooterDisclosure title="الخدمات" items={footerLinks.services} />
                    <FooterDisclosure title="الشركة" items={footerLinks.company} />
                    <FooterDisclosure title="تواصل معنا" items={footerLinks.contact} />
                </div>
            </div>

            <div className="mx-auto mt-5 flex max-w-[1360px] flex-col gap-2 text-[12px] text-[#728882] md:flex-row md:justify-between md:text-[12.5px]">
                <span>{settings.copyrightText || `© ${new Date().getFullYear()} ${settings.siteName}. جميع الحقوق محفوظة.`}</span>
                <span>{settings.availabilityNote || "متوفر في جميع مناطق المملكة"}</span>
            </div>
        </footer>
    );
}

function FooterIntro({ settings }: { settings: SiteSettings }) {
    const socialLinks = [
        { href: settings.facebookUrl, label: "فيسبوك" },
        { href: settings.twitterUrl, label: "تويتر" },
        { href: settings.instagramUrl, label: "انستغرام" },
        { href: settings.tiktokUrl, label: "تيك توك" },
    ].filter((link): link is { href: string; label: string } => Boolean(link.href && link.href.trim()));

    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <span className="relative grid h-[34px] w-[34px] place-items-center overflow-hidden rounded-full bg-green-500">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        fill
                        sizes="34px"
                        className="object-cover"
                        priority
                    />
                </span>

                <span className="font-heading text-[17px] font-black text-white">
                    {settings.siteName}
                </span>
            </div>
            <p className="max-w-[280px] text-[13.5px] leading-[1.85]">
                {settings.footerDescription || FALLBACK_SETTINGS.footerDescription}
            </p>
            {socialLinks.length > 0 && (
                <div className="mt-4 flex items-center gap-3">
                    {socialLinks.map(({ href, label }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                        >
                            <Link2 className="h-4 w-4" />
                        </a>
                    ))}
                </div>
            )
            }
        </div >
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