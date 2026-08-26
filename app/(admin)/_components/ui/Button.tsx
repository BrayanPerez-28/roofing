"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0C14] select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#b7c4ff] to-[#dde1ff] text-[#1b2b68] hover:shadow-lg hover:shadow-[#b7c4ff]/30 focus:ring-[#b7c4ff] active:scale-95 font-['Montserrat',sans-serif]",
      secondary:
        "bg-white/10 text-white hover:bg-white/15 border border-white/10 focus:ring-white/30 active:scale-95",
      danger:
        "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 focus:ring-red-500 active:scale-95",
      ghost:
        "text-white/70 hover:text-white hover:bg-white/8 focus:ring-white/20 active:scale-95",
      outline:
        "border border-white/15 text-white/80 hover:bg-white/8 hover:border-white/25 focus:ring-white/20 active:scale-95",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
