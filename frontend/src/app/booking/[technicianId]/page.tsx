import type { Metadata } from "next";
import { BookingPageClient } from "@/components/booking/BookingPageClient";

export const metadata: Metadata = {
    title: "حجز موعد خدمة صيانة منزلية",
    description: "حجز موعد خدمة صيانة منزلية مع فني معتمد من منصة بيتك.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function BookingPage() {
    return <BookingPageClient />;
}
