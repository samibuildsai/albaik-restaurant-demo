import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, symbol: string = "₨"): string {
  return `${symbol}${price.toLocaleString()}`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FF-${timestamp}-${random}`;
}

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal >= 2000) return 0;
  if (subtotal >= 1000) return 100;
  return 150;
}

export function calculateDiscount(subtotal: number, promoCode?: string): number {
  if (promoCode === "FREESHIP") return calculateDeliveryFee(subtotal);
  if (promoCode === "WELCOME10") return Math.round(subtotal * 0.1);
  if (promoCode === "SAVE200" && subtotal >= 1500) return 200;
  return 0;
}

export function getEstimatedDeliveryTime(): string {
  const now = new Date();
  const prepTime = 20; // minutes
  const deliveryTime = 30; // minutes
  const totalMinutes = prepTime + deliveryTime;
  const estimated = new Date(now.getTime() + totalMinutes * 60000);
  return estimated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}