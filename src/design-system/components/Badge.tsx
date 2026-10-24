import type { ReactNode } from "react";
import { cn } from "@/design-system/utils/cn";

export type Tone =
  "neutral" | "accent" | "gold" | "success" | "danger" | "warning" | "info";

const tones: Record<Tone, string> = {
  neutral: "border-border-strong bg-surface-muted text-muted",
  accent: "border-accent-border bg-accent-soft text-accent",
  gold: "border-brand-gold-border bg-brand-gold-soft text-brand-gold-ink",
  success: "border-success-border bg-success-soft text-success",
  danger: "border-danger-border bg-danger-soft text-danger",
  warning: "border-warning-border bg-warning-soft text-warning",
  info: "border-info-border bg-info-soft text-info",
};

type BadgeProps = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
};

export function Badge({
  tone = "neutral",
  children,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
