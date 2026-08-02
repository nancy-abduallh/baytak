export interface RankedItem {
    label: string;
    value: number;
    color: string;
    highlighted?: boolean;
}

export function RankedList({
    title,
    items,
    unit,
}: {
    title: string;
    items: RankedItem[];
    unit?: string;
}) {
    return (
        <div className="card-elevated p-5">
            <h3 className="mb-3 text-center font-heading text-[15px] font-extrabold text-ink">{title}</h3>
            <ul className="divide-y divide-line">
                {items.map((item) => (
                    <li
                        key={item.label}
                        className="flex flex-col gap-0.5 border-s-[3px] py-3 ps-3 transition-opacity"
                        style={{
                            borderColor: item.color,
                            opacity: item.highlighted === false ? 0.4 : 1,
                        }}
                    >
                        <span className="text-[12.5px] font-bold" style={{ color: item.color }}>
                            {item.label}
                        </span>
                        <span className="font-heading text-[16px] font-extrabold text-ink">
                            {item.value.toLocaleString()}
                            {unit ? <span className="ms-1 text-[11px] font-semibold text-[#8A9691]">{unit}</span> : null}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}