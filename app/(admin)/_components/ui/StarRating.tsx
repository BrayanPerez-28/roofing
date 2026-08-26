"use client";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const sizes = { sm: "text-sm", md: "text-xl", lg: "text-2xl" };

  return (
    <div className={`flex gap-0.5 ${sizes[size]}`} role="group" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          onClick={() => !readonly && onChange?.(star)}
          className={[
            "transition-all duration-150 leading-none",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-125",
            star <= value ? "text-orange-400" : "text-white/20",
          ].join(" ")}
          tabIndex={readonly ? -1 : 0}
        >
          ★
        </button>
      ))}
    </div>
  );
}
