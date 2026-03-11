"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: "default" | "saffron" | "green" | "gold" | "danger";
  size?: "sm" | "md" | "lg";
}

const VARIANT_CLASSES = {
  default:  "bg-white border-border",
  saffron:  "bg-saffron-50 border-saffron-200",
  green:    "bg-green-50 border-green-200",
  gold:     "bg-gold-50 border-gold-200",
  danger:   "bg-red-50 border-red-200",
};

const TREND_CLASSES = {
  up:      "text-green-600",
  down:    "text-danger",
  neutral: "text-[#7A7A7A]",
};

const TREND_ARROWS = {
  up:      "↑",
  down:    "↓",
  neutral: "→",
};

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  variant = "default",
  size = "md",
}: StatCardProps) {
  return (
    <div
      className={`bento-card ${VARIANT_CLASSES[variant]} flex flex-col gap-3 ${
        size === "lg" ? "col-span-2" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider leading-tight">
          {title}
        </p>
        {icon && (
          <span className="text-[#9A9A9A] opacity-70 mt-0.5">
            {icon}
          </span>
        )}
      </div>

      <div>
        <p
          className={`font-bold text-[#1A1A1A] leading-none ${
            size === "lg" ? "text-4xl" : size === "sm" ? "text-2xl" : "text-3xl"
          }`}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-[#7A7A7A] mt-1.5">{subtitle}</p>
        )}
      </div>

      {trend && trendValue && (
        <p className={`text-xs font-semibold ${TREND_CLASSES[trend]}`}>
          {TREND_ARROWS[trend]} {trendValue}
        </p>
      )}
    </div>
  );
}
