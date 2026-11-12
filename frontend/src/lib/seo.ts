export const SITE_URL = "https://baytak.ksaplatforms.com";
export const SITE_NAME = "بيتك";
export const SITE_TAGLINE = "المنصة الأولى لخدمات صيانة المنازل بالمملكة العربية السعودية";
export const SITE_DEFAULT_DESCRIPTION =
    "احجز أفضل الفنيين المعتمدين لخدمات صيانة المنازل في المملكة العربية السعودية: سباكة، كهرباء، تكييف، تنظيف، دهانات، ونجارة بأسعار واضحة وضمان ذهبي 30 يوماً.";

export interface CategorySeoData {
    nameAr: string;
    title: string;
    description: string;
    keywords: string[];
    image: string;
    priceStartingAt: number;
}

export const CATEGORIES_SEO: Record<string, CategorySeoData> = {
    ac: {
        nameAr: "صيانة وغسيل المكيفات",
        title: "صيانة وغسيل المكيفات وتعبئة فريون | منصة بيتك",
        description:
            "احجز فني تكييف معتمد لصيانة وغسيل مكيفات سبليت وشباك ومركزي، تعبئة فريون أصلي، وفحص كفاءة التبريد في السعودية بضمان ذهبي 30 يوماً.",
        keywords: [
            "صيانة مكيفات",
            "غسيل مكيفات سبليت",
            "تعبئة فريون مكيف",
            "فني تكييف بالرياض",
            "تصليح مكيفات السعودية",
            "صيانة مكيفات مركزية",
        ],
        image: "/images/categories/ac.jpg",
        priceStartingAt: 120,
    },
    plumbing: {
        nameAr: "كشف التسريبات والسباكة",
        title: "خدمات السباكة وكشف تسربات المياه إلكترونياً | منصة بيتك",
        description:
            "فني سباكة معتمد لكشف تسربات المياه إلكترونياً بدون تكسير، تسليك مجاري وشبكات الصرف، وصيانة وتركيب السخانات والمضخات والخلاطات بضمان معتمد.",
        keywords: [
            "سباك معتمد",
            "كشف تسربات المياه بدون تكسير",
            "تسليك مجاري بالرياض",
            "صيانة سباكة منازل",
            "تركيب وصيانة سخانات",
            "سباك ممتاز بالرياض",
        ],
        image: "/images/categories/plumbing.jpg",
        priceStartingAt: 80,
    },
    electrical: {
        nameAr: "تمديدات وفحص الكهرباء",
        title: "خدمات الكهرباء وإصلاح الأعطال المنزلية المعتمدة | منصة بيتك",
        description:
            "فحص وإصلاح أعطال الكهرباء والالتماس المفاجئ، تمديدات الإنارة والأفياش والقواطع، وتأسيس لوحات الكهرباء بأعلى معايير السلامة والأمان بالمملكة.",
        keywords: [
            "كهربائي منازل",
            "فني كهرباء معتمد",
            "إصلاح التماس كهربائي",
            "كهربائي منازل بالرياض",
            "تمديدات كهربائية",
            "تركيب مفاتيح وإنارة",
        ],
        image: "/images/categories/electrical.jpg",
        priceStartingAt: 100,
    },
    painting: {
        nameAr: "الدهانات والتشطيبات الحديثة",
        title: "خدمات الدهانات والتشطيبات والديكورات الحديثة | منصة بيتك",
        description:
            "معلم دهانات داخلية وخارجية، معالجة الرطوبة والتشققات، تركيب بديل خشب ورخام، وتنسيق ألوان احترافي بأجود أنواع الدهانات المعتمدة.",
        keywords: [
            "معلم دهانات بالرياض",
            "دهانات داخلية وخارجية",
            "تركيب بديل رخام وخشب",
            "تشطيبات وديكورات منازل",
            "أفضل دهان بالرياض",
        ],
        image: "/images/categories/painting.jpg",
        priceStartingAt: 120,
    },
    cleaning: {
        nameAr: "تنظيف الفلل والمنازل الشامل",
        title: "خدمات تنظيف المنازل والفلل بالبخار والتعقيم | منصة بيتك",
        description:
            "تنظيف فلل وشقق ومنازل شامل، تنظيف بعد التشطيب، غسيل مجالس وكنب وسجاد بالبخار، وتنظيف وتعقيم خزانات المياه بأحدث المعدات ومواد آمنة.",
        keywords: [
            "تنظيف منازل بالرياض",
            "تنظيف فلل بعد التشطيب",
            "غسيل كنب ومجالس بالبخار",
            "غسيل خزانات مياه",
            "شركة تنظيف بالسعودية",
            "نظافة شقق بالرياض",
        ],
        image: "/images/categories/cleaning.jpg",
        priceStartingAt: 150,
    },
    carpentry: {
        nameAr: "النجارة وتركيب الأثاث",
        title: "خدمات النجارة وتركيب وصيانة الأثاث والأبواب | منصة بيتك",
        description:
            "فني نجارة محترف لفك وتركيب وصيانة غرف النوم ومطابخ ايكيا، صيانة الأبواب والأقفال والكوالين، وتفصيل وتعديل الخزائن بدقة واحترافية.",
        keywords: [
            "نجار بالرياض",
            "فني تركيب غرف نوم",
            "تركيب اثاث ايكيا",
            "صيانة ابواب وافصال",
            "نجار شاطر بالرياض",
        ],
        image: "/images/categories/carpentry.jpg",
        priceStartingAt: 90,
    },
};

export function getOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": ["Organization", "HomeAndConstructionBusiness"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ["منصة بيتك", "بيتك لخدمات الصيانة", "Baytak Platform"],
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/logo.png`,
        description:
            "منصة بيتك لخدمات صيانة وتشغيل المنازل بالمملكة العربية السعودية، نجمع لك نخبة من الفنيين المعتمدين لضمان صيانة موثوقة وبأعلى معايير الجودة.",
        telephone: "920012345",
        email: "info@baytak.sa",
        priceRange: "$$",
        currenciesAccepted: "SAR",
        paymentAccepted: "Cash, Credit Card, Mada, Apple Pay",
        areaServed: {
            "@type": "Country",
            name: "المملكة العربية السعودية",
            alternateName: "Saudi Arabia",
        },
        address: {
            "@type": "PostalAddress",
            addressCountry: "SA",
            addressRegion: "منطقة الرياض",
            addressLocality: "الرياض",
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
            },
        ],
    };
}

export function getWebSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: "منصة بيتك لخدمات صيانة المنازل",
        description: SITE_DEFAULT_DESCRIPTION,
        inLanguage: "ar-SA",
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/services?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}

export function getServiceSchema(slug: string, nameAr: string, priceFrom: number) {
    const seoData = CATEGORIES_SEO[slug];
    const description = seoData?.description || `خدمة ${nameAr} المعتمدة من منصة بيتك بالمملكة العربية السعودية.`;
    const image = seoData?.image ? `${SITE_URL}${seoData.image}` : `${SITE_URL}/logo.png`;

    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/services/${slug}#service`,
        name: nameAr,
        serviceType: nameAr,
        description,
        provider: {
            "@id": `${SITE_URL}/#organization`,
        },
        areaServed: {
            "@type": "Country",
            name: "المملكة العربية السعودية",
        },
        image,
        offers: {
            "@type": "Offer",
            priceCurrency: "SAR",
            price: priceFrom > 0 ? priceFrom : seoData?.priceStartingAt || 80,
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/services/${slug}`,
        },
    };
}
