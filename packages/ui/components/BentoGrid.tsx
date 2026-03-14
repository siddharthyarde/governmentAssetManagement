import React from "react";

interface BentoGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

export function BentoGrid({ children, cols = 3, className = "" }: BentoGridProps) {
  const colClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[cols];

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-4 ${className}`}>
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
  className?: string;
}

export function BentoItem({ children, span = 1, className = "" }: BentoItemProps) {
  const spanClass = {
    1: "",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
  }[span];

  return (
    <div className={`bento-card ${spanClass} ${className}`}>
      {children}
    </div>
  );
}
