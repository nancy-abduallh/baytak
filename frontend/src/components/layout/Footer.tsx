import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Phone, Mail, Globe, MapPin, Clock, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { ServiceCategory, SiteSettings } from "@/lib/types";

const FOOTER_COMPANY_LINKS = ["من نحن", "انضم كفني", "الأسئلة الشائعة"];

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

// ---------- link helpers (make sure every href actually resolves) ----------
function withProtocol(url: string): string {
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function telHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function whatsappHref(phone: string): string {
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) digits = `966${digits.slice(1)}`; // local KSA format -> international
    return `https://wa.me/${digits}`;
}

function mapsHref(address: string): string {
    return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
}

export async function Footer() {
    let settings: SiteSettings = FALLBACK_SETTINGS;
    let categories: ServiceCategory[] = [];

    const [settingsResult, categoriesResult] = await Promise.allSettled([
        api.getSiteSettings(),
        api.getCategories(),
    ]);
    if (settingsResult.status === "fulfilled") settings = settingsResult.value;
    if (categoriesResult.status === "fulfilled") categories = categoriesResult.value;

    // ---------- every editable settings field, rendered as a real, working link where possible ----------
    const contactItems: { key: string; label: string; href?: string; icon: typeof Phone }[] = [];
    if (settings.contactPhone?.trim()) {
        contactItems.push({ key: "phone", label: settings.contactPhone, href: telHref(settings.contactPhone), icon: Phone });
    }
    if (settings.contactWhatsapp?.trim()) {
        contactItems.push({ key: "whatsapp", label: "واتساب", href: whatsappHref(settings.contactWhatsapp), icon: MessageCircle });
    }
    if (settings.contactEmail?.trim()) {
        contactItems.push({ key: "email", label: settings.contactEmail, href: `mailto:${settings.contactEmail}`, icon: Mail });
    }
    if (settings.websiteUrl?.trim()) {
        contactItems.push({ key: "website", label: settings.websiteUrl, href: withProtocol(settings.websiteUrl), icon: Globe });
    }
    if (settings.address?.trim()) {
        contactItems.push({ key: "address", label: settings.address, href: mapsHref(settings.address), icon: MapPin });
    }
    if (settings.workingHours?.trim()) {
        // Working hours has no meaningful destination — shown as plain info, not a dead link.
        contactItems.push({ key: "hours", label: settings.workingHours, icon: Clock });
    }

    const serviceLinks = categories.length > 0
        ? categories.map((c) => ({ label: c.nameAr, href: `/services/${c.slug}` }))
        : [{ label: "كل الخدمات", href: "/services" }];

    return (
        <footer className="bg-ink px-4 pb-6 pt-10 text-[#B9C7C2] md:px-10 md:pb-7 md:pt-14">
            <div className="mx-auto hidden max-w-[1360px] grid-cols-[1.3fr_.8fr_.8fr_1fr] gap-10 border-b border-white/10 pb-9 md:grid">
                <FooterIntro settings={settings} />
                <FooterColumn title="الخدمات">
                    <ul className="space-y-2.5 text-[13.5px]">
                        {serviceLinks.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="transition hover:text-white">{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </FooterColumn>
                <FooterColumn title="الشركة">
                    <ul className="space-y-2.5 text-[13.5px]">
                        {FOOTER_COMPANY_LINKS.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </FooterColumn>
                <FooterColumn title="تواصل معنا">
                    <FooterContactList items={contactItems} />
                </FooterColumn>
            </div>

            <div className="mx-auto max-w-[1360px] border-b border-white/10 pb-3 md:hidden">
                <FooterIntro settings={settings} />
                <div className="mt-7 divide-y divide-white/10">
                    <FooterDisclosure title="الخدمات">
                        <ul className="space-y-3 pb-4 text-[13px] leading-relaxed text-[#B9C7C2]">
                            {serviceLinks.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="transition hover:text-white">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </FooterDisclosure>
                    <FooterDisclosure title="الشركة">
                        <ul className="space-y-3 pb-4 text-[13px] leading-relaxed text-[#B9C7C2]">
                            {FOOTER_COMPANY_LINKS.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </FooterDisclosure>
                    <FooterDisclosure title="تواصل معنا">
                        <div className="pb-4">
                            <FooterContactList items={contactItems} />
                        </div>
                    </FooterDisclosure>
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
        {
            href: settings.facebookUrl,
            label: "فيسبوك",
            Icon: FacebookIcon,
            hoverBg: "group-hover/social:bg-[#1877F2]",
            glow: "hover:shadow-[0_10px_24px_-8px_rgba(24,119,242,0.65)]",
        },
        {
            href: settings.twitterUrl,
            label: "تويتر (X)",
            Icon: XIcon,
            hoverBg: "group-hover/social:bg-black",
            glow: "hover:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.55)]",
        },
        {
            href: settings.instagramUrl,
            label: "انستغرام",
            Icon: InstagramIcon,
            hoverBg: "group-hover/social:bg-gradient-to-tr group-hover/social:from-[#F58529] group-hover/social:via-[#DD2A7B] group-hover/social:to-[#8134AF]",
            glow: "hover:shadow-[0_10px_24px_-8px_rgba(221,42,123,0.55)]",
        },
        {
            href: settings.tiktokUrl,
            label: "تيك توك",
            Icon: TikTokIcon,
            hoverBg: "group-hover/social:bg-black",
            glow: "hover:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.55)]",
        },
    ].filter(
        (link): link is { href: string; label: string; Icon: typeof FacebookIcon; hoverBg: string; glow: string } =>
            Boolean(link.href && link.href.trim()),
    );

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
                <div className="mt-5 flex items-center gap-3">
                    {socialLinks.map(({ href, label, Icon, hoverBg, glow }) => (
                        <a
                            key={label}
                            href={withProtocol(href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className={`group/social relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.06] text-[#B9C7C2] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.12] hover:border-white/0 hover:text-white ${glow}`}
                        >
                            <span
                                className={`absolute inset-0 scale-0 rounded-full opacity-0 transition-all duration-300 ease-out group-hover/social:scale-100 group-hover/social:opacity-100 ${hoverBg}`}
                            />
                            <Icon className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover/social:scale-110" />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

function FooterContactList({ items }: { items: { key: string; label: string; href?: string; icon: typeof Phone }[] }) {
    if (items.length === 0) {
        return <p className="text-[13px] text-[#728882]">لا تتوفر بيانات تواصل حاليًا</p>;
    }
    return (
        <ul className="space-y-3 text-[13.5px]">
            {items.map(({ key, label, href, icon: Icon }) => (
                <li key={key} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 flex-none text-[#6FAF93]" />
                    {href ? (
                        <a
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                            dir="ltr"
                            className="text-left transition hover:text-white"
                        >
                            {label}
                        </a>
                    ) : (
                        <span dir="rtl">{label}</span>
                    )}
                </li>
            ))}
        </ul>
    );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h5 className="mb-4 text-[14.5px] font-bold text-white">{title}</h5>
            {children}
        </div>
    );
}

function FooterDisclosure({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <details className="group py-1">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-[14px] font-bold text-white [&::-webkit-details-marker]:hidden">
                {title}
                <ChevronDown className="h-4 w-4 text-[#9FC2B7] transition-transform group-open:rotate-180" />
            </summary>
            {children}
        </details>
    );
}

// ---------- lightweight brand icons (lucide-react's installed version ships
// no social-brand glyphs, so these small inline SVGs stand in for them) ----------
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.459h-1.26c-1.243 0-1.63.771-1.63 1.562v1.877h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
        </svg>
    );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M18.244 2h3.086l-6.74 7.703L22.5 22h-6.28l-4.92-6.43L5.6 22H2.51l7.207-8.24L1.5 2h6.44l4.45 5.88L18.244 2Zm-1.083 18h1.71L7.03 3.9H5.19L17.161 20Z" />
        </svg>
    );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
            <circle cx="12" cy="12" r="4.6" />
            <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none" />
        </svg>
    );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M16.6 2h-3.03v13.94a3.1 3.1 0 1 1-2.19-2.97V9.85a6.17 6.17 0 1 0 5.22 6.09V8.63a7.83 7.83 0 0 0 4.43 1.37V6.98a4.9 4.9 0 0 1-3.13-1.29A4.85 4.85 0 0 1 16.6 2Z" />
        </svg>
    );
}