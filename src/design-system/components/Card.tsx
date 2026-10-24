import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/design-system/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-card",
        className,
      )}
      {...props}
    />
  );
}

type CardHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function CardHeader({
  title,
  description,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-5",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
        {description && (
          <p className="mt-1 text-[13px] leading-5 text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-5", className)} {...props} />;
}
