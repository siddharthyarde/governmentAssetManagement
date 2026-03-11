import React from "react";

type BadgeVariant = "active" | "pending" | "danger" | "inactive" | "saffron" | "gold";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  active:   "badge-active",
  pending:  "badge-pending",
  danger:   "badge-danger",
  inactive: "badge-inactive",
  saffron:  "badge-saffron",
  gold:     "bg-gold-100 text-gold-800 badge",
};

export function Badge({ variant = "inactive", children, className = "" }: BadgeProps) {
  return (
    <span className={`${BADGE_CLASSES[variant]} ${className}`}>
      {children}
    </span>
  );
}
