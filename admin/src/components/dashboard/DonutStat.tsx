"use client";
import { LucideIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export interface DonutSegment {
    label: string;
    value: number;
    color: string;
}

export function DonutStat({
    title,
    legendTitle,
    icon: Icon,
    segments,
}: {
    title: string;
    legendTitle: string;
    icon: LucideIcon;
    segments: DonutSegment[];
}) {
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

    return (
        <div className="card-elevated p-5">
            <h3 className="mb-4 text-center font-heading text-[15px] font-extrabold text-ink">{title}</h3>

            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    <div className="mb-2.5 text-[11.5px] font-bold text-[#8A9691]">{legendTitle}</div>
                    <ul className="space-y-2">
                        {segments.map((s) => (
                            <li key={s.label} className="flex items-center gap-2 text-[12px] font-semibold text-[#3E4B45]">
                                <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: s.color }} />
                                <span className="truncate">{s.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative h-[130px] w-[130px] flex-none">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={segments}
                                dataKey="value"
                                nameKey="label"
                                innerRadius={38}
                                outerRadius={58}
                                paddingAngle={2}
                                stroke="none"
                                label={({ value }) => `${Math.round((value / total) * 100)}%`}
                                labelLine={{ stroke: "#C8C2B2", strokeWidth: 1 }}
                                fontSize={10}
                            >
                                {segments.map((s) => (
                                    <Cell key={s.label} fill={s.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 grid place-items-center">
                        <span
                            className="grid h-10 w-10 place-items-center rounded-full text-teal-700"
                            style={{ background: "#F6F3EC", boxShadow: "inset 0 0 0 1px #E2DDD0" }}
                        >
                            <Icon className="h-[18px] w-[18px]" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}