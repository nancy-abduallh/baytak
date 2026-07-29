import { Hero } from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { StepsSection } from "@/components/home/StepsSection";
import { TrustBar } from "@/components/home/TrustBar";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";

export default async function HomePage() {
  const categories = await api.getCategories();

  return (
    <main>
      <Hero />
      <ServicesGrid categories={categories} />
      <StepsSection />
      <TrustBar />
      <Footer />
    </main>
  );
}