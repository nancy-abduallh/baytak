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
        return <div className="rounded-md border border-line bg-white p-10 text-center text-[13.5px] text-[#8A9691]">{emptyLabel}</div>;
    }

    return (
        <div className="overflow-hidden rounded-md border border-line bg-white">
            <table className="w-full text-start text-[13.5px]">
                <thead>
                    <tr className="border-b border-line bg-sand-50 text-[12.5px] text-[#63756F]">
                        {columns.map((col) => (
                            <th key={col.header} className="px-5 py-3.5 text-start font-semibold">{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b border-line last:border-none hover:bg-sand-50/60">
                            {columns.map((col) => (
                                <td key={col.header} className={col.className ?? "px-5 py-4"}>{col.render(row)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}