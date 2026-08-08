import { Hero } from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { StepsSection } from "@/components/home/StepsSection";
import { TrustBar } from "@/components/home/TrustBar";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";
import { ServiceCategory } from "@/lib/types";

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
      <Hero />
      {categories.length > 0 ? (
        <ServicesGrid categories={categories} />
      ) : (
        <div className="mx-auto max-w-[1360px] px-5 py-16 text-center text-[14px] text-[#8A9691] lg:px-10 lg:py-24">
          تعذر تحميل قائمة الخدمات حاليًا. تأكد من تشغيل الخادم الخلفي على المنفذ 4000، ثم أعد تحميل الصفحة.
        </div>
      )}
      <StepsSection />
      <TrustBar />
      <Footer />
    </main>
  );
}