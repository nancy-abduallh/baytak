import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

function FieldShell({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div className="mb-4">
            <label className="mb-1.5 block text-[13px] font-semibold text-[#57655F]">{label}</label>
            {children}
            {error && <p className="mt-1 text-[12px] text-danger">{error}</p>}
        </div>
    );
}

export function TextField({
    label, error, className = "", ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <FieldShell label={label} error={error}>
            <input
                {...props}
                className={`w-full rounded-md border px-3.5 py-3 text-sm outline-none transition focus:border-teal-700 ${error ? "border-danger" : "border-line"
                    } ${className}`}
            />
        </FieldShell>
    );
}

export function TextareaField({
    label, error, className = "", ...props
}: { label: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <FieldShell label={label} error={error}>
            <textarea
                {...props}
                className={`w-full rounded-md border px-3.5 py-3 text-sm outline-none transition focus:border-teal-700 ${error ? "border-danger" : "border-line"
                    } ${className}`}
            />
        </FieldShell>
    );
}

export function SelectField({
    label, error, className = "", children, ...props
}: { label: string; error?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <FieldShell label={label} error={error}>
            <select
                {...props}
                className={`w-full rounded-md border bg-white px-3.5 py-3 text-sm outline-none transition focus:border-teal-700 ${error ? "border-danger" : "border-line"
                    } ${className}`}
            >
                {children}
            </select>
        </FieldShell>
    );
}

export function CheckboxField({
    label, ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <label className="mb-4 flex items-center gap-2.5 text-[13px] font-semibold text-[#57655F]">
            <input type="checkbox" {...props} className="h-4 w-4 rounded border-line accent-teal-700" />
            {label}
        </label>
    );
}