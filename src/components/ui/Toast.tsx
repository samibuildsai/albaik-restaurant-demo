"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastMessage } from "@/types";

export interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
};

const bgColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
};

export function Toast({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-sm",
        bgColors[toast.type]
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={cn("flex-shrink-0 mt-0.5", iconColors[toast.type])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastMessage[]; onClose: (id: string) => void }) {
  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={onClose} />
          </div>
        ))}
      </div>
    </AnimatePresence>
  );
}