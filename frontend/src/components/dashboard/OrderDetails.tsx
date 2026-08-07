"use client";
import { FormEvent, useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";
import { Order } from "@/lib/types";
import { api, ApiError, getAssetUrl } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ORDER_STATUS_LABEL } from "@/lib/constants";

export function OrderDetails({ order }: { order: Order }) {
    return (
        <div className="mt-6 rounded-md border border-line bg-white p-6">
            <h4 className="mb-4 text-[15px] font-bold">تفاصيل الطلب {order.orderNumber}</h4>
            <div className="mb-4 grid grid-cols-4 gap-5 border-b border-dashed border-line pb-5 text-[13.5px] text-[#57655F]">
                <Field label="رقم الطلب" value={order.orderNumber} />
                <Field label="حالة الطلب" value={ORDER_STATUS_LABEL[order.status]} />
                <Field label="الفني" value={order.technician?.fullName ?? "—"} />
                <Field label="العنوان" value={order.address} />
            </div>
            <p className="mb-4 text-[13.5px] text-[#57655F]">{order.description}</p>

            {order.images.length > 0 && (
                <div className="mb-4">
                    <p className="mb-2 text-[13px] font-semibold text-[#57655F]">صور المشكلة المرفقة</p>
                    <div className="flex flex-wrap gap-3">
                        {order.images.map((url) => (
                            <a key={url} href={getAssetUrl(url) ?? "#"} target="_blank" rel="noreferrer" className="block h-20 w-20 overflow-hidden rounded-md border border-line">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={getAssetUrl(url) ?? ""} alt="صورة المشكلة" className="h-full w-full object-cover" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <Button variant="dark">تواصل مع الفني</Button>

            {order.canReview && <ReviewForm orderId={order.id} technicianName={order.technician?.fullName ?? "الفني"} />}
            {order.hasReview && (
                <p className="mt-5 rounded-md bg-green-100 px-4 py-3 text-[13px] font-semibold text-teal-800">
                    شكرًا لك، تم إرسال تقييمك لهذا الطلب.
                </p>
            )}
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="mb-1.5 text-[#8A9691]">{label}</p>
            <b className="text-ink">{value}</b>
        </div>
    );
}

function ReviewForm({ orderId, technicianName }: { orderId: number; technicianName: string }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await api.createReview(orderId, { rating, comment: comment || undefined });
            setSent(true);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "تعذر إرسال التقييم");
        } finally {
            setSubmitting(false);
        }
    };

    if (sent) {
        return (
            <p className="mt-5 rounded-md bg-green-100 px-4 py-3 text-[13px] font-semibold text-teal-800">
                شكرًا لك، تم إرسال تقييمك لـ {technicianName} بنجاح.
            </p>
        );
    }

    return (
        <form onSubmit={submit} className="mt-5 rounded-md border border-line bg-sand-50 p-5">
            <h5 className="mb-3 text-[13.5px] font-bold">قيّم {technicianName}</h5>
            {error && <p className="mb-3 text-[12.5px] text-danger">{error}</p>}

            <div className="mb-4 flex items-center gap-1.5" dir="ltr">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${value} نجوم`}
                    >
                        <Star
                            className={clsx(
                                "h-6 w-6 transition",
                                (hoverRating || rating) >= value ? "fill-gold-500 text-gold-500" : "text-[#D8DFDB]"
                            )}
                        />
                    </button>
                ))}
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="اكتب رأيك في تجربتك مع الفني (اختياري)"
                className="mb-4 w-full rounded-md border border-line px-3.5 py-3 text-[13px]"
            />

            <Button type="submit" variant="dark">{submitting ? "جارِ الإرسال..." : "إرسال التقييم"}</Button>
        </form>
    );
}