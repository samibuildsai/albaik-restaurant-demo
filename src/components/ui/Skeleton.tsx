"use client";

import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  lines,
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gray-200 rounded";

  if (variant === "text") {
    return (
      <div className={cn(baseStyles, className)} style={{ width, height: height || "1rem" }} />
    );
  }

  if (variant === "circular") {
    return (
      <div
        className={cn(baseStyles, "rounded-full", className)}
        style={{ width: width || "3rem", height: height || "3rem" }}
      />
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className={cn(baseStyles, "h-48 rounded-xl")} />
        <div className="space-y-3 px-2">
          <div className={cn(baseStyles, "h-6 w-3/4 rounded")} />
          <div className={cn(baseStyles, "h-4 w-1/2 rounded")} />
          <div className={cn(baseStyles, "h-4 w-1/3 rounded")} />
        </div>
        <div className="flex gap-2 px-2">
          <div className={cn(baseStyles, "h-10 w-24 rounded-xl")} />
          <div className={cn(baseStyles, "h-10 flex-1 rounded-xl")} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, className)}
      style={{ width: width || "100%", height: height || "1rem" }}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl overflow-hidden bg-white shadow-sm", className)}>
      <Skeleton variant="rectangular" height="200px" width="100%" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="60%" height="24px" />
        <Skeleton variant="text" width="40%" height="16px" />
        <Skeleton variant="text" width="80%" height="16px" />
        <div className="flex gap-2 pt-2">
          <Skeleton variant="rectangular" width="80px" height="36px" />
          <Skeleton variant="rectangular" width="100px" height="36px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonMenuGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}