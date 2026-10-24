import { useId, type InputHTMLAttributes } from "react";
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
};

export function Field({ label, error, className, id, ...props }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={className}>
      <label htmlFor={inputId} className={labelClasses}>
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          inputClasses,
          error && "border-danger focus:border-danger focus:ring-danger/25",
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-[11px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
