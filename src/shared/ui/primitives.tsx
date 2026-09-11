import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

// ============================================================================
// BUTTON PRIMITIVE
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    // Tailwind classes based on variant and size
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-slate-950";

    const variants = {
      primary: "bg-signal text-white shadow-sm hover:bg-signal-dark",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700",
      outline:
        "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 dark:border-slate-800 dark:text-slate-50 dark:hover:bg-slate-800",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-900 dark:text-slate-50 dark:hover:bg-slate-800",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        data-state={isLoading ? "loading" : undefined}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

// ============================================================================
// INPUT PRIMITIVE
// ============================================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", error, id, ...props }, ref) => {
  // Generate a unique ID if not provided, useful for aria-describedby
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const baseStyles =
    "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-offset-slate-950";

  const borderStyles = error
    ? "border-red-500 focus-visible:ring-red-600"
    : "border-slate-200 focus-visible:ring-signal dark:border-slate-800";

  const combinedClassName = `${baseStyles} ${borderStyles} ${className}`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <input
        ref={ref}
        id={inputId}
        className={combinedClassName}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-xs font-medium text-red-500 dark:text-red-400" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
Input.displayName = "Input";
