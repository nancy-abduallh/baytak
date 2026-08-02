"use client";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
    open, onClose, title, description, children, width = "560px",
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    width?: string;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 px-4 py-8" onMouseDown={onClose}>
            <div
                className="max-h-[90vh] w-full overflow-y-auto rounded-md border border-line bg-white shadow-lift"
                style={{ maxWidth: width }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-line px-6 py-5">
                    <div>
                        <h2 className="font-heading text-lg font-extrabold text-ink">{title}</h2>
                        {description && <p className="mt-1 text-[13px] text-[#63756F]">{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="grid h-8 w-8 flex-none place-items-center rounded-full text-[#63756F] hover:bg-sand-50"
                        aria-label="إغلاق"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
}