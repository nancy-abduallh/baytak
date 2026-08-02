"use client";
import { LucideIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export interface DonutSegment {
    label: string;
    value: number;
    color: string;
}

const RADIAN = Math.PI / 180;

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
    return (
        <div className="card-elevated p-5">
            <h3 className="mb-4 text-center font-heading text-[15px] font-extrabold text-ink">{title}</h3>

            <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                    <div className="mb-2.5 text-[11.5px] font-bold text-muted">{legendTitle}</div>
                    <ul className="space-y-2.5">
                        {segments.map((s) => (
                            <li key={s.label} className="flex items-start gap-2 text-[12px] font-semibold text-[#3E4B45]">
                                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full" style={{ background: s.color }} />
                                <span className="leading-snug break-words">
                                    {s.label}
                                    <span className="ms-1 font-bold text-ink">{s.value.toLocaleString()}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Force LTR here: under the page's dir="rtl", recharts' SVG <text>
                    nodes (axis/labels) mis-position and overlap other elements —
                    this is what made the on-chart percentages unreadable. */}
                <div className="relative h-[116px] w-[116px] flex-none" style={{ direction: "ltr" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={segments}
                                dataKey="value"
                                nameKey="label"
                                innerRadius={32}
                                outerRadius={50}
                                paddingAngle={2}
                                stroke="none"
                                labelLine={{ stroke: "#9CA79F", strokeWidth: 1 }}
                                label={(props: any) => {
                                    const { cx, cy, midAngle, outerRadius: r, percent, value } = props;
                                    if (!value) return null;
                                    const radius = r + 12;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            textAnchor={x > cx ? "start" : "end"}
                                            dominantBaseline="central"
                                            fontSize={10.5}
                                            fontWeight={800}
                                            fill="#12302E"
                                        >
                                            {`${Math.round(percent * 100)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {segments.map((s) => (
                                    <Cell key={s.label} fill={s.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 grid place-items-center">
                        <span
                            className="grid h-9 w-9 place-items-center rounded-full text-teal-700"
                            style={{ background: "#F6F3EC", boxShadow: "inset 0 0 0 1px #E2DDD0" }}
                        >
                            <Icon className="h-[16px] w-[16px]" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}