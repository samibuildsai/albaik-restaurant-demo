"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { OrderProvider } from "@/context/OrderContext";
import { ToastContainer } from "@/components/ui";
import { useToast } from "@/context/ToastContext";

function ToastListener() {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onClose={removeToast} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        <OrderProvider>
          {children}
          <ToastListener />
        </OrderProvider>
      </ToastProvider>
    </CartProvider>
  );
}