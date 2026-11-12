import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { StepsSection } from "@/components/home/StepsSection";
import { TrustBar } from "@/components/home/TrustBar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { api } from "@/lib/api";
import { ServiceCategory } from "@/lib/types";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DEFAULT_DESCRIPTION,
  getBreadcrumbSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DEFAULT_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: `${SITE_NAME} - ${SITE_TAGLINE}`,
      },
    ],
  },
};

export default async function HomePage() {
  let categories: ServiceCategory[] = [];
  try {
    categories = await api.getCategories();
  } catch {
    // The marketing homepage should still render even if the API is
    // down — this section just shows a note instead of throwing.
  }

  return (
    <main>
      <JsonLd data={getBreadcrumbSchema([{ name: "الرئيسية", url: "/" }])} />
      <Hero />
      {categories.length > 0 ? (
        <ServicesGrid categories={categories} />
      ) : (
        <div className="mx-auto max-w-[1360px] px-5 py-16 text-center text-[14px] text-[#8A9691] lg:px-10 lg:py-24">
          تعذر تحميل باقة الخدمات حاليًا. الرجاء التأكد من اتصال الخادم ثم إعادة تحديث الصفحة.
        </div>
      )}
      <StepsSection />
      <TrustBar />
      <Footer />
    </main>
  );
}
