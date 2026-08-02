import { ReactNode } from "react";

export interface Column<T> {
    header: string;
    render: (row: T) => ReactNode;
    className?: string;
}

export function DataTable<T extends { id: number }>({
    columns, rows, emptyLabel = "لا توجد بيانات لعرضها",
}: {
    columns: Column<T>[];
    rows: T[];
    emptyLabel?: string;
}) {
    if (rows.length === 0) {
        return (
            <div className="card-elevated grid place-items-center p-14 text-center text-[13.5px] text-[#8A9691]">
                {emptyLabel}
            </div>
        );
    }

    return (
        <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-start text-[13.5px]">
                    <thead>
                        <tr
                            className="border-b border-line text-[12px] font-bold text-[#4F6058]"
                            style={{ background: "linear-gradient(180deg,#F6F3EC,#EFEAE0)" }}
                        >
                            {columns.map((col) => (
                                <th key={col.header} className="whitespace-nowrap px-5 py-4 text-start">{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr
                                key={row.id}
                                className={`border-b border-line/70 last:border-none transition-colors hover:bg-teal-700/[.05] ${i % 2 === 1 ? "bg-sand-50/40" : ""}`}
                            >
                                {columns.map((col) => (
                                    <td key={col.header} className={col.className ?? "px-5 py-4"}>{col.render(row)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}