import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "accent" | "emerald" | "amber" | "rose";
  delay?: number;
}

const colorMap = {
  primary: {
    bg: "bg-primary/10",
    icon: "text-primary",
    badge: "bg-primary/10 text-primary",
  },
  accent: {
    bg: "bg-accent/10",
    icon: "text-accent",
    badge: "bg-accent/10 text-accent",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-600",
    badge: "bg-emerald-500/10 text-emerald-600",
  },
  amber: {
    bg: "bg-amber-500/10",
    icon: "text-amber-600",
    badge: "bg-amber-500/10 text-amber-600",
  },
  rose: {
    bg: "bg-rose-500/10",
    icon: "text-rose-600",
    badge: "bg-rose-500/10 text-rose-600",
  },
};

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend = "neutral",
  color = "primary",
  delay = 0 
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="card-elevated p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
        {change && (
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold",
            trend === "up" && "bg-emerald-500/10 text-emerald-600",
            trend === "down" && "bg-rose-500/10 text-rose-600",
            trend === "neutral" && colors.badge
          )}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </motion.div>
  );
}
