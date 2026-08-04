"use client";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api, ApiError } from "@/lib/api";
import { Technician, Address, Review } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TechnicianAvatar } from "@/components/services/TechnicianAvatar";

export default function BookingPage() {
    const params = useParams<{ technicianId: string }>();
    const technicianId = Number(params.technicianId);
    const router = useRouter();
    const { accessToken, hasHydrated } = useAuthStore();

    const [technician, setTechnician] = useState<Technician | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [addressId, setAddressId] = useState<number | null>(null);
    const [scheduledDate, setScheduledDate] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (hasHydrated && !accessToken) router.replace(`/login?redirect=/booking/${technicianId}`);
    }, [hasHydrated, accessToken, technicianId, router]);

    useEffect(() => {
        api.getTechnician(technicianId).then(setTechnician).catch(() => setError("تعذر تحميل بيانات الفني"));
        api.getTechnicianReviews(technicianId).then(setReviews).catch(() => undefined);
    }, [technicianId]);

    useEffect(() => {
        if (!accessToken) return;
        api.getMyAddresses().then((rows) => {
            setAddresses(rows);
            setAddressId(rows.find((a) => a.isDefault)?.id ?? rows[0]?.id ?? null);
        }).catch(() => undefined);
    }, [accessToken]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!technician || !addressId || !scheduledDate) {
            setError("الرجاء اختيار العنوان والتاريخ");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await api.createOrder({
                categoryId: technician.primaryCategoryId,
                technicianId: technician.id,
                addressId,
                description,
                scheduledDate,
                amount: technician.priceFrom,
            });
            setSuccess(true);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "تعذر إنشاء الطلب");
        } finally {
            setSubmitting(false);
        }
    };

    if (!hasHydrated || !accessToken) return null;

    if (success) {
        return (
            <main className="mx-auto max-w-[520px] px-6 py-24 text-center">
                <h1 className="mb-2 text-xl font-extrabold">تم تأكيد الحجز بنجاح</h1>
                <p className="mb-6 text-[13.5px] text-[#63756F]">سيصلك الفني في الموعد المحدد. يمكنك متابعة حالة الطلب من طلباتي.</p>
                <Link href="/dashboard/orders"><Button variant="dark">الذهاب إلى طلباتي</Button></Link>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-[640px] px-6 py-12">
            <h1 className="mb-6 text-2xl font-extrabold">تأكيد الحجز</h1>

            {technician && (
                <div className="mb-6 flex items-center gap-4 rounded-md border border-line bg-white p-5">
                    <TechnicianAvatar fullName={technician.fullName} initials={technician.initials} avatarUrl={technician.avatarUrl} size="md" />
                    <div>
                        <h4 className="mb-1 flex items-center gap-2 text-base font-bold">
                            {technician.fullName} {technician.isVerified && <BadgeCheck className="h-4 w-4 text-green-500" />}
                        </h4>
                        <div className="flex items-center gap-2 text-[13px] text-[#8A9691]">
                            <Star className="h-3.5 w-3.5 fill-current text-gold-500" /> {technician.averageRating} · فني {technician.categoryLabel} · {technician.priceFrom} ر.س
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="rounded-md border border-line bg-white p-6">
                {error && <p className="mb-4 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{error}</p>}

                <label className="mb-1.5 block text-[13px] font-semibold text-[#57655F]">العنوان</label>
                {addresses.length > 0 ? (
                    <select value={addressId ?? ""} onChange={(e) => setAddressId(Number(e.target.value))} className="mb-4 w-full rounded-md border border-line px-3.5 py-3 text-sm">
                        {addresses.map((a) => <option key={a.id} value={a.id}>{a.label} — {a.city}، {a.district}</option>)}
                    </select>
                ) : (
                    <p className="mb-4 text-[13px] text-[#8A9691]">
                        لا توجد عناوين محفوظة. <Link href="/dashboard/account" className="font-bold text-teal-700">أضف عنوانًا</Link> أولًا.
                    </p>
                )}

                <label className="mb-1.5 block text-[13px] font-semibold text-[#57655F]">التاريخ المناسب</label>
                <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="mb-4 w-full rounded-md border border-line px-3.5 py-3 text-sm" />

                <label className="mb-1.5 block text-[13px] font-semibold text-[#57655F]">وصف المشكلة (اختياري)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mb-5 w-full rounded-md border border-line px-3.5 py-3 text-sm" />

                <Button type="submit" variant="dark" className="w-full justify-center">
                    {submitting ? "جارِ التأكيد..." : `تأكيد الحجز — ${technician?.priceFrom ?? "—"} ر.س`}
                </Button>
            </form>

            <div className="mt-8 rounded-md border border-line bg-white p-6">
                <h4 className="mb-4 text-[15px] font-bold">
                    آراء العملاء {technician ? `(${technician.reviewCount})` : ""}
                </h4>
                {reviews.length === 0 ? (
                    <p className="text-[13px] text-[#8A9691]">لا توجد تقييمات بعد لهذا الفني.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-dashed border-line pb-4 last:border-0 last:pb-0">
                                <div className="mb-1.5 flex items-center justify-between">
                                    <b className="text-[13.5px] text-ink">{review.reviewerName}</b>
                                    <div className="flex items-center gap-1 text-gold-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current" : "text-[#D8DFDB]"}`} />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && <p className="text-[13px] text-[#63756F]">{review.comment}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}