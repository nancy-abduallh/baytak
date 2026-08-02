"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function GaugeCard({
    title,
    value,
    max,
    valueLabel,
    color = "#1E6B5C",
}: {
    title: string;
    value: number;
    max: number;
    valueLabel: string;
    color?: string;
}) {
    const safeMax = Math.max(max, 1);
    const clamped = Math.min(Math.max(value, 0), safeMax);
    const data = [
        { name: "value", amount: clamped },
        { name: "rest", amount: safeMax - clamped },
    ];

    return (
        <div className="card-elevated p-5">
            <h3 className="mb-1 text-center font-heading text-[15px] font-extrabold text-ink">{title}</h3>

            <div className="relative mx-auto h-[150px] w-full max-w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="amount"
                            startAngle={180}
                            endAngle={0}
                            cx="50%"
                            cy="85%"
                            innerRadius={62}
                            outerRadius={92}
                            stroke="none"
                            cornerRadius={8}
                        >
                            <Cell fill={color} />
                            <Cell fill="#E9E4D6" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col items-center">
                    <span className="font-heading text-[24px] font-extrabold leading-none text-ink">{valueLabel}</span>
                </div>
                <div className="pointer-events-none absolute bottom-1 left-2 text-[10.5px] font-bold text-[#8A9691]">0</div>
                <div className="pointer-events-none absolute bottom-1 right-2 text-[10.5px] font-bold text-[#8A9691]">
                    {safeMax.toLocaleString()}
                </div>
            </div>
        </div>
    );
}