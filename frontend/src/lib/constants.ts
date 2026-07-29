import { Droplet, Zap, Snowflake, Hammer, PaintRoller, Sparkles, LucideIcon } from "lucide-react";
import { OrderStatus } from "./types";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
    droplet: Droplet,
    zap: Zap,
    snowflake: Snowflake,
    hammer: Hammer,
    "paint-roller": PaintRoller,
    sparkles: Sparkles,
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    pending: "جديد",
    confirmed: "مؤكد",
    in_progress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
    pending: "bg-[#E6EEF2] text-[#3B6B7D]",
    confirmed: "bg-[#E6EEF2] text-[#3B6B7D]",
    in_progress: "bg-gold-100 text-[#8A6417]",
    completed: "bg-green-100 text-teal-800",
    cancelled: "bg-danger/10 text-danger",
};