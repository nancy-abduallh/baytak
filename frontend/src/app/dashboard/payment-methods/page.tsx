import { CreditCard } from "lucide-react";

export default function PaymentMethodsPage() {
    return (
        <div className="grid min-h-[300px] place-items-center rounded-md border border-dashed border-line bg-white text-center">
            <div>
                <CreditCard className="mx-auto mb-3 h-8 w-8 text-[#B7C1BC]" />
                <h3 className="mb-1.5 text-[15px] font-bold">طرق الدفع — قريبًا</h3>
                <p className="text-[13px] text-[#8A9691]">لم يتم بناء هذه الميزة على الخادم الخلفي بعد.</p>
            </div>
        </div>
    );
}