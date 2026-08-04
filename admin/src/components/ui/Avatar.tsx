import clsx from "clsx";
import { getAssetUrl } from "@/lib/api";

export function Avatar({
    fullName,
    initials,
    avatarUrl,
    className,
}: {
    fullName: string;
    initials?: string;
    avatarUrl?: string | null;
    className?: string;
}) {
    const src = getAssetUrl(avatarUrl);

    if (src) {
        return (
            <img
                src={src}
                alt={fullName}
                className={clsx("h-10 w-10 rounded-full object-cover", className)}
            />
        );
    }

    return (
        <div
            className={clsx(
                "grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#DCEAE3] to-[#C6DED3] text-sm font-extrabold text-teal-700",
                className,
            )}
        >
            {initials || fullName.slice(0, 1)}
        </div>
    );
}