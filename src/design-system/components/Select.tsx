import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import {
  inputClasses,
  labelClasses,
  RequiredMark,
} from "@/design-system/components/Field";
import { cn } from "@/design-system/utils/cn";

export type SelectOption = { value: string; label: string };

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  /** Visually hide the label (still read by screen readers). */
  hideLabel?: boolean;
  options: SelectOption[];
  /** First option, with value "" (e.g. "Todos"). */
  placeholder?: string;
  error?: string;
  /** Control beside the select (e.g. a "+" button); errors go below both. */
  addon?: ReactNode;
};

// Native <select> styled with the design tokens: accessible, keyboard and
// mobile friendly out of the box.
export function Select({
  label,
  hideLabel = false,
  options,
  placeholder,
  error,
  addon,
  className,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className={className}>
      <label
        htmlFor={selectId}
        className={cn(labelClasses, hideLabel && "sr-only")}
      >
        {label}
        {props.required && <RequiredMark />}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <select
            id={selectId}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              inputClasses,
              "cursor-pointer appearance-none pr-9",
              error && "border-danger focus:border-danger focus:ring-danger/25",
            )}
            {...props}
          >
            {placeholder !== undefined && (
              <option value="">{placeholder}</option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-soft"
            aria-hidden
          />
        </div>
        {addon}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-[11px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
