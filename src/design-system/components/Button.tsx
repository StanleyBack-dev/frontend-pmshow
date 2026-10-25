import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "@/design-system/components/Spinner";
import { cn } from "@/design-system/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  // Solid PM green: the main action.
  primary:
    "border border-accent-hover bg-accent text-accent-fg hover:bg-accent-hover",
  // Light, with a gold edge on hover.
  secondary:
    "border border-border-strong bg-surface text-fg hover:border-brand-gold hover:bg-surface-muted",
  ghost:
    "border border-transparent text-muted hover:bg-surface-muted hover:text-fg",
  danger: "border border-danger bg-danger text-white hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-[13px] gap-2",
  lg: "h-11 px-6 text-sm gap-2",
  // Square, icon-only (give it an aria-label).
  icon: "size-9 shrink-0",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
) {
  return cn(
    "inline-flex items-center justify-center rounded-md font-semibold tracking-wide transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-55",
    variants[variant],
    sizes[size],
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClasses(variant, size), className)}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
}
