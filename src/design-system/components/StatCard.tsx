import type { ReactNode } from "react";
import type { Tone } from "@/design-system/components/Badge";
import { Card } from "@/design-system/components/Card";
import { cn } from "@/design-system/utils/cn";

const iconTones: Record<Tone, string> = {
  neutral: "border-border-strong bg-surface-muted text-muted",
  accent: "border-accent-border bg-accent-soft text-accent",
  gold: "border-brand-gold-border bg-brand-gold-soft text-brand-gold-ink",
  success: "border-success-border bg-success-soft text-success",
  danger: "border-danger-border bg-danger-soft text-danger",
  warning: "border-warning-border bg-warning-soft text-warning",
  info: "border-info-border bg-info-soft text-info",
};

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "gold",
}: StatCardProps) {
  return (
    // Compact on phones (two per row), roomier from sm up.
    <Card className="flex h-full min-w-0 flex-col p-3.5 sm:p-5">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <p className="min-w-0 text-[10px] leading-[14px] font-medium tracking-[0.02em] break-words text-muted uppercase sm:text-[12px] sm:leading-4 sm:tracking-[0.06em]">
          {label}
        </p>
        {icon && (
          <span
            className={cn(
              "hidden size-9 shrink-0 place-items-center rounded-md border sm:grid [&>svg]:size-5",
              iconTones[tone],
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 pt-2 sm:pt-3">
        <p className="text-xl leading-7 font-semibold tabular-nums text-fg sm:text-2xl">
          {value}
        </p>
        {icon && (
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-md border sm:hidden [&>svg]:size-4",
              iconTones[tone],
            )}
          >
            {icon}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-soft sm:text-xs">
          {hint}
        </p>
      )}
    </Card>
  );
}
