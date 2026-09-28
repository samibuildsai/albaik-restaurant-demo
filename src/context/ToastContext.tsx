"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { ToastMessage } from "@/types";

interface ToastState {
  toasts: ToastMessage[];
}

type ToastAction =
  | { type: "ADD_TOAST"; payload: Omit<ToastMessage, "id"> }
  | { type: "REMOVE_TOAST"; payload: string }
  | { type: "CLEAR_TOASTS" };

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD_TOAST": {
      const id = Math.random().toString(36).substring(2, 9);
      return { ...state, toasts: [...state.toasts, { ...action.payload, id }] };
    }
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    case "CLEAR_TOASTS":
      return { ...state, toasts: [] };
    default:
      return state;
  }
}

const initialState: ToastState = { toasts: [] };

interface ToastContextType extends ToastState {
  showToast: (message: string, type?: ToastMessage["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const showToast = (message: string, type: ToastMessage["type"] = "info", duration = 3000) => {
    dispatch({ type: "ADD_TOAST", payload: { message, type, duration } });
  };

  const removeToast = (id: string) => dispatch({ type: "REMOVE_TOAST", payload: id });
  const clearToasts = () => dispatch({ type: "CLEAR_TOASTS" });

  return (
    <ToastContext.Provider
      value={{
        ...state,
        showToast,
        removeToast,
        clearToasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}