import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/design-system/utils/cn";

// Light fields with a gold focus ring; small uppercase labels (shared by
// Field, Select, TextArea and Combobox).
export const inputClasses = cn(
  "h-9 w-full rounded-md border border-border-strong bg-surface px-3 text-[13px] text-fg",
  "placeholder:text-soft transition-colors",
  "focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-ring",
  "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-soft",
);

export const labelClasses =
  "mb-1.5 block text-[11px] font-semibold tracking-[0.08em] text-muted uppercase";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  /** Decorative icon inside the field, on the left. */
  icon?: ReactNode;
  /** Control inside the field, on the right (e.g. show password). */
  trailing?: ReactNode;
  /** "lg": taller field for short, prominent forms (sign-in). */
  controlSize?: "md" | "lg";
};

export function Field({
  label,
  error,
  icon,
  trailing,
  controlSize = "md",
  className,
  id,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={className}>
      <label htmlFor={inputId} className={labelClasses}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-soft [&>svg]:size-4"
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            inputClasses,
            controlSize === "lg" && "h-11 text-sm",
            icon && "pl-9",
            trailing && "pr-11",
            error && "border-danger focus:border-danger focus:ring-danger/25",
          )}
          {...props}
        />
        {trailing && (
          <span className="absolute inset-y-0 right-1 flex items-center">
            {trailing}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-[11px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
