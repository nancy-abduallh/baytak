export function AdminTopbar({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-7">
            <h1 className="font-heading text-2xl font-extrabold text-ink">{title}</h1>
            {description && <p className="mt-1 text-[13.5px] text-[#63756F]">{description}</p>}
        </div>
    );
}