"use client";

export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <span
      className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
