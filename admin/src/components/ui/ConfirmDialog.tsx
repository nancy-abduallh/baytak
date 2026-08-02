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
            <div className="mb-6 flex items-start gap-3 rounded-md bg-sand-50 p-4">
                <AlertTriangle className={tone === "danger" ? "h-5 w-5 flex-none text-danger" : "h-5 w-5 flex-none text-gold-500"} />
                <p className="text-[13px] text-[#57655F]">لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.</p>
            </div>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-[#57655F] hover:bg-sand-50"
                >
                    إلغاء
                </button>
                <button
                    onClick={onConfirm}
                    disabled={busy}
                    className={`rounded-full px-5 py-2.5 text-[13px] font-bold text-white disabled:opacity-60 ${tone === "danger" ? "bg-danger hover:bg-danger/90" : "bg-teal-700 hover:bg-teal-800"
                        }`}
                >
                    {busy ? "جارِ التنفيذ..." : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}