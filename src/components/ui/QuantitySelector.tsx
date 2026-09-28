"use client";

import { forwardRef } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export const QuantitySelector = forwardRef<HTMLDivElement, QuantitySelectorProps>(
  ({ value, onChange, min = 1, max = 99, size = "md", className, disabled = false }, ref) => {
    const handleIncrement = () => {
      if (value < max) onChange(value + 1);
    };

    const handleDecrement = () => {
      if (value > min) onChange(value - 1);
    };

    const sizes = {
      sm: { btn: "p-1.5", icon: "h-3.5 w-3.5", input: "w-10 text-sm" },
      md: { btn: "p-2", icon: "h-4 w-4", input: "w-14 text-base" },
      lg: { btn: "p-2.5", icon: "h-5 w-5", input: "w-16 text-lg" },
    };

    const s = sizes[size];

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center border border-gray-200 rounded-xl overflow-hidden", className)}
        role="group"
        aria-label="Quantity selector"
      >
        <Button
          type="button"
          variant="ghost"
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
          className={cn("h-auto rounded-none border-r border-gray-200 hover:bg-gray-50", s.btn)}
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label="Decrease quantity"
        >
          <Minus className={s.icon} />
        </Button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const val = parseInt(e.target.value) || min;
            onChange(Math.min(Math.max(val, min), max));
          }}
          onBlur={(e) => {
            const val = parseInt(e.target.value) || min;
            onChange(Math.min(Math.max(val, min), max));
          }}
          className={cn(
            "text-center border-none focus:outline-none focus:ring-0 bg-white",
            s.input,
            "disabled:bg-gray-50"
          )}
          disabled={disabled}
          aria-label="Quantity"
          inputMode="numeric"
        />
        <Button
          type="button"
          variant="ghost"
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
          className={cn("h-auto rounded-none border-l border-gray-200 hover:bg-gray-50", s.btn)}
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label="Increase quantity"
        >
          <Plus className={s.icon} />
        </Button>
      </div>
    );
  }
);

QuantitySelector.displayName = "QuantitySelector";