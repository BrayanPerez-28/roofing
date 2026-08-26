"use client";

import { useEffect, useCallback } from "react";
import type { Toast as ToastType } from "../../_lib/types";

// ─── Single Toast ──────────────────────────────────────────────────────────────

const icons: Record<ToastType["type"], string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const colors: Record<ToastType["type"], string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-300",
  error:   "border-red-500/30 bg-red-500/10 text-red-300",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  info:    "border-blue-500/30 bg-blue-500/10 text-blue-300",
};

const iconColors: Record<ToastType["type"], string> = {
  success: "bg-green-500/20 text-green-400",
  error:   "bg-red-500/20 text-red-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  info:    "bg-blue-500/20 text-blue-400",
};

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4500);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg shadow-xl animate-[slideInRight_0.3s_ease] ${colors[toast.type]}`}
      role="alert"
    >
      <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </span>
      <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity text-current"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Toast Container ───────────────────────────────────────────────────────────

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── useToast Hook ─────────────────────────────────────────────────────────────

import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = useCallback((type: ToastType["type"], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast("success", msg),
    error:   (msg: string) => addToast("error", msg),
    info:    (msg: string) => addToast("info", msg),
    warning: (msg: string) => addToast("warning", msg),
  };

  return { toasts, toast, dismissToast };
}
