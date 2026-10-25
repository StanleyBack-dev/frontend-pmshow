import { useId, type TextareaHTMLAttributes } from "react";
import {
  inputClasses,
  labelClasses,
  RequiredMark,
} from "@/design-system/components/Field";
import { cn } from "@/design-system/utils/cn";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
};

export function TextArea({
  label,
  hint,
  className,
  id,
  rows = 4,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = `${textareaId}-hint`;

  return (
    <div className={className}>
      <label htmlFor={textareaId} className={labelClasses}>
        {label}
        {props.required && <RequiredMark />}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-describedby={hint ? hintId : undefined}
        className={cn(inputClasses, "h-auto resize-y py-2 leading-relaxed")}
        {...props}
      />
      {hint && (
        <p id={hintId} className="mt-1 text-[11px] text-soft">
          {hint}
        </p>
      )}
    </div>
  );
}
