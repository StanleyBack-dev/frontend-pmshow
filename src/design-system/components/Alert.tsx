import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/design-system/utils/cn";

type AlertTone = "info" | "success" | "warning" | "danger";

const styles: Record<AlertTone, { box: string; icon: ReactNode }> = {
  info: {
    box: "border-info-border bg-info-soft text-info",
    icon: <Info className="size-4" />,
  },
  success: {
    box: "border-success-border bg-success-soft text-success",
    icon: <CheckCircle2 className="size-4" />,
  },
  warning: {
    box: "border-warning-border bg-warning-soft text-warning",
    icon: <AlertTriangle className="size-4" />,
  },
  danger: {
    box: "border-danger-border bg-danger-soft text-danger",
    icon: <XCircle className="size-4" />,
  },
};

type AlertProps = {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  className?: string;
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: AlertProps) {
  const style = styles[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-md border px-4 py-3 text-[13px]",
        style.box,
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">{style.icon}</span>
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && (
          <div className={cn(title && "mt-0.5", "opacity-90")}>{children}</div>
        )}
      </div>
    </div>
  );
}
