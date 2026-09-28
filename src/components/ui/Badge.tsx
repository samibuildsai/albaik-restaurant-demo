"use client";

import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "popular" | "new" | "spicy" | "vegetarian";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    popular: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    new: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    spicy: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    vegetarian: "bg-gradient-to-r from-green-600 to-green-700 text-white",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export interface SpicyLevelProps {
  level: 0 | 1 | 2 | 3;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function SpicyLevel({ level, size = "md", showLabel = false }: SpicyLevelProps) {
  if (level === 0) return null;

  const sizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4.5 w-4.5",
    lg: "h-5.5 w-5.5",
  };

  const labels = {
    1: "Mild",
    2: "Medium",
    3: "Hot",
  };

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Spicy level: ${labels[level as keyof typeof labels]}`}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`${level} out of 3 chili peppers`}>
        {[1, 2, 3].map((i) => (
          <svg
            key={i}
            className={cn(
              sizes[size],
              i <= level ? "text-red-500 fill-current" : "text-gray-200"
            )}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C10.9 2 9.9 2.4 9.1 3.1L4 17.1c-.7 1.2.3 2.6 1.6 2.6h12.8c1.3 0 2.3-1.4 1.6-2.6L14.9 3.1c-.8-.7-1.8-1.1-2.9-1.1zM9 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
        ))}
      </div>
      {showLabel && <span className="text-sm font-medium text-red-600">{labels[level as keyof typeof labels]}</span>}
    </div>
  );
}