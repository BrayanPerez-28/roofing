"use client";

type BadgeVariant = "success" | "error" | "warning" | "info" | "neutral" | "orange";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  success: "bg-green-500/15 text-green-400 border-green-500/20",
  error:   "bg-red-500/15 text-red-400 border-red-500/20",
  warning: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  info:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  neutral: "bg-white/8 text-white/60 border-white/10",
  orange:  "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

const dotStyles: Record<BadgeVariant, string> = {
  success: "bg-green-400",
  error:   "bg-red-400",
  warning: "bg-yellow-400",
  info:    "bg-blue-400",
  neutral: "bg-white/50",
  orange:  "bg-orange-400",
};

export function Badge({ variant = "neutral", children, dot = false, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
}

// ─── Convenience aliases ───────────────────────────────────────────────────────

export function ApprovedBadge({ approved }: { approved: boolean }) {
  return (
    <Badge variant={approved ? "success" : "warning"} dot>
      {approved ? "Approved" : "Pending"}
    </Badge>
  );
}
