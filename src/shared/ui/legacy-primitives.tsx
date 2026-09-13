// src/shared/ui/legacy-primitives.tsx
import React from "react";

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`bg-paper focus:border-signal focus-visible:ring-focus-ring min-h-28 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-4 ${className}`}
      {...props}
    />
  );
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "error" | "success" | "warning" | "brand";
  children: React.ReactNode;
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  let variantClasses = "";
  switch (variant) {
    case "error":
      variantClasses =
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50";
      break;
    case "success":
      variantClasses =
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50";
      break;
    case "warning":
      variantClasses =
        "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50";
      break;
    case "brand":
      variantClasses =
        "bg-brand-primary text-white border-brand-primary dark:bg-brand-accent dark:text-black dark:border-brand-accent";
      break;
    case "default":
    default:
      variantClasses = "bg-soft text-ink border-line dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700";
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function Chip({ active = false, className = "", children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={`focus-visible:ring-brand-accent dark:focus-visible:ring-offset-ink inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        active
          ? "border-brand-primary bg-brand-primary dark:text-ink text-white dark:border-white dark:bg-white"
          : "border-line bg-paper text-ink hover:bg-soft hover:text-brand-primary dark:border-gray-700 dark:hover:text-white"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  size?: "sm" | "md" | "lg";
}

// FIXED: Added missing Avatar component
export function Avatar({ name = "Desk", size = "md", className = "", ...props }: AvatarProps) {
  // Generate initials (e.g., "Daily Samachar" -> "DS")
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base md:h-16 md:w-16 md:text-lg",
  };

  return (
    <span
      className={`bg-soft text-ink flex shrink-0 items-center justify-center rounded-full font-bold dark:bg-gray-800 dark:text-gray-100 ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {initials || "?"}
    </span>
  );
}
