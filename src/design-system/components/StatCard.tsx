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
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-medium tracking-[0.06em] text-muted uppercase">
          {label}
        </p>
        {icon && (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-md border",
              iconTones[tone],
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-fg">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-soft">{hint}</p>}
    </Card>
  );
}
