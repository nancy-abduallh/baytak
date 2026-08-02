"use client";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

export function ConfirmDialog({
    open, onClose, onConfirm, title, description, confirmLabel = "تأكيد", busy = false, tone = "danger",
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    busy?: boolean;
    tone?: "danger" | "teal";
}) {
    return (
        <Modal open={open} onClose={onClose} title={title} description={description} width="420px">
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-sand-50 p-4">
                <span
                    className="icon-badge-glow grid h-9 w-9 flex-none place-items-center rounded-xl text-white"
                    style={{
                        background: tone === "danger" ? "linear-gradient(135deg,#D97060,#B24B3C)" : "linear-gradient(135deg,#E4B15C,#BF8A34)",
                        ["--glow-color" as any]: tone === "danger" ? "rgba(178,75,60,.4)" : "rgba(191,138,52,.4)",
                    }}
                >
                    <AlertTriangle className="h-4 w-4" />
                </span>
                <p className="pt-1 text-[13px] text-[#57655F]">لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.</p>
            </div>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-[#57655F] transition hover:bg-sand-50"
                >
                    إلغاء
                </button>
                <button
                    onClick={onConfirm}
                    disabled={busy}
                    className="rounded-full px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(18,48,46,.45)] transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                    style={{ background: tone === "danger" ? "linear-gradient(135deg,#D97060,#B24B3C)" : "linear-gradient(135deg,#2F8F79,#1E6B5C)" }}
                >
                    {busy ? "جارِ التنفيذ..." : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}