import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "ghost" | "dark" | "outline";

const VARIANT_CLASSES: Record<Variant, string> = {
    primary: "bg-gold-500 text-white shadow-[0_12px_26px_rgba(191,138,52,.38)] hover:brightness-105",
    ghost: "text-white border border-white/35 hover:bg-white/10",
    dark: "bg-ink text-white hover:bg-teal-900",
    outline: "bg-white text-ink border border-line hover:border-teal-700",
};

interface ButtonProps {
    variant?: Variant;
    href?: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit";
}

export function Button({ variant = "primary", href, children, className, onClick, type = "button" }: ButtonProps) {
    const classes = clsx(
        "inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-bold transition",
        VARIANT_CLASSES[variant],
        className
    );
    if (href) return <Link href={href} className={classes}>{children}</Link>;
    return <button type={type} onClick={onClick} className={classes}>{children}</button>;
}