"use client";
import clsx from "clsx";

type TabKey = "all" | "in_progress" | "completed";

export function StatusTabs({
    counts, active, onChange,
}: {
    counts: { all: number; inProgress: number; completed: number };
    active: TabKey;
    onChange: (v: TabKey) => void;
}) {
    const tabs: { key: TabKey; label: string }[] = [
        { key: "all", label: `الكل (${counts.all})` },
        { key: "in_progress", label: `قيد التنفيذ (${counts.inProgress})` },
        { key: "completed", label: `مكتمل (${counts.completed})` },
    ];

    return (
        <div className="flex gap-1.5 rounded-full border border-line bg-white p-1.5">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={clsx("rounded-full px-4 py-2.5 text-[13px] font-semibold", active === tab.key ? "bg-ink text-white" : "text-[#57655F]")}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}