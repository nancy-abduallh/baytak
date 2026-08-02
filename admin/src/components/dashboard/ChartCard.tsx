import { ReactNode } from "react";

export function ChartCard({
    title, description, action, children, className = "",
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`rounded-md border border-line bg-white p-6 ${className}`}>
            <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-heading text-[15px] font-extrabold text-ink">{title}</h3>
                    {description && <p className="mt-0.5 text-[12.5px] text-[#63756F]">{description}</p>}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}