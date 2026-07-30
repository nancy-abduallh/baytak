import { api } from "@/lib/api";
import { CategoryCard } from "@/components/services/CategoryCard";
import { Footer } from "@/components/layout/Footer";

export default async function ServicesIndexPage() {
    let categories: Awaited<ReturnType<typeof api.getCategories>> = [];
    let loadError = false;

    try {
        categories = await api.getCategories();
    } catch {
        loadError = true;
    }

    return (
        <main>
            <div className="border-b border-line bg-white px-10 py-10">
                <div className="mx-auto max-w-[1360px]">
                    <div className="mb-2.5 text-[12.5px] text-[#8A9691]">الرئيسية / <b className="text-ink">الخدمات</b></div>
                    <h1 className="mb-1.5 font-heading text-[28px] font-extrabold">اختر نوع الخدمة</h1>
                    <p className="text-[14px] text-[#63756F]">ست فئات رئيسية، بأسعار معلنة قبل الحجز — اختر ما يناسب طلبك لعرض الفنيين المتاحين.</p>
                </div>
            </div>

            <div className="mx-auto max-w-[1360px] px-10 py-12">
                {loadError && (
                    <div className="mb-6 rounded-md border border-danger/30 bg-danger/5 px-5 py-4 text-[13.5px] font-semibold text-danger">
                        تعذر تحميل قائمة الخدمات حاليًا. تأكد من تشغيل الخادم الخلفي (backend) على المنفذ 4000 ثم أعد المحاولة.
                    </div>
                )}
                <div className="grid grid-cols-3 gap-5">
                    {categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
                </div>
            </div>

            <Footer />
        </main>
    );
}