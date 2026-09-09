"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "md", footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" />

      {/* Panel */}
      <div
        className={`relative w-full ${widths[maxWidth]} rounded-2xl border shadow-2xl animate-[slideUpFade_0.25s_ease] overflow-hidden`}
        style={{
          background: "var(--ad-sidebar-bg)",
          borderColor: "var(--ad-border)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.3)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--ad-border)" }}>
            <h2 id="modal-title" className="text-base font-semibold" style={{ color: "var(--ad-text)" }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: "var(--ad-text-faint)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--ad-text)";
                e.currentTarget.style.background = "var(--ad-hover-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ad-text-faint)";
                e.currentTarget.style.background = "transparent";
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh]" style={{ color: "var(--ad-text)" }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--ad-border)", background: "var(--ad-card)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
