"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium" style={{ color: "var(--ad-text-muted)" }}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ad-text-faint)" }}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              "w-full rounded-xl border text-sm transition-all duration-200",
              "px-4 py-2.5",
              "focus:outline-none focus:ring-2",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              background: error ? "rgba(239,68,68,0.05)" : "var(--ad-input-bg)",
              borderColor: error ? "rgba(239,68,68,0.5)" : "var(--ad-input-border)",
              color: "var(--ad-text)",
            }}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ad-text-faint)" }}>
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs flex items-center gap-1" style={{ color: "var(--ad-error)" }}>⚠ {error}</p>}
        {hint && !error && <p className="text-xs" style={{ color: "var(--ad-text-faint)" }}>{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

// ─── Textarea variant ──────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium" style={{ color: "var(--ad-text-muted)" }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={[
            "w-full rounded-xl border text-sm transition-all duration-200 resize-none",
            "px-4 py-2.5",
            "focus:outline-none focus:ring-2",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            background: error ? "rgba(239,68,68,0.05)" : "var(--ad-input-bg)",
            borderColor: error ? "rgba(239,68,68,0.5)" : "var(--ad-input-border)",
            color: "var(--ad-text)",
          }}
          {...props}
        />
        {error && <p className="text-xs" style={{ color: "var(--ad-error)" }}>⚠ {error}</p>}
        {hint && !error && <p className="text-xs" style={{ color: "var(--ad-text-faint)" }}>{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
