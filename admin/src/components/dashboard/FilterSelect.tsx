"use client";
import { ChevronDown } from "lucide-react";

export function FilterSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-bold text-[#63756F]">{label}</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="card-elevated h-10 min-w-[150px] cursor-pointer appearance-none rounded-[10px] py-0 pe-9 ps-3.5 text-[12.5px] font-semibold text-ink outline-none"
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 start-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8A9691]" />
            </div>
        </div>
    );
}