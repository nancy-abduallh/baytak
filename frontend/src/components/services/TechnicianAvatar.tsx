import clsx from "clsx";
import { getAssetUrl } from "@/lib/api";

const SIZE_STYLES = {
    md: { box: "h-14 w-14 rounded-2xl", text: "text-lg" },
    lg: { box: "h-16 w-16 rounded-2xl", text: "text-xl" },
} as const;

export function TechnicianAvatar({
    fullName,
    initials,
    avatarUrl,
    size = "lg",
    className,
}: {
    fullName: string;
    initials: string;
    avatarUrl?: string | null;
    size?: keyof typeof SIZE_STYLES;
    className?: string;
}) {
    const { box, text } = SIZE_STYLES[size];
    const src = getAssetUrl(avatarUrl);

    if (src) {
        return (
            <img
                src={src}
                alt={fullName}
                className={clsx(box, "object-cover", className)}
            />
        );
    }

    return (
        <div
            className={clsx(
                box,
                "grid place-items-center bg-gradient-to-br from-[#DCEAE3] to-[#C6DED3] font-heading font-extrabold text-teal-700",
                text,
                className,
            )}
        >
            {initials}
        </div>
    );
}