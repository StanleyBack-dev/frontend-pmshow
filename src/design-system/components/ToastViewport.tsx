"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { ToastItem, ToastVariant } from "@/shared/toast/ToastContext";

const styles: Record<ToastVariant, { box: string; icon: ReactNode }> = {
  success: {
    box: "border-success-border bg-success-soft text-success",
    icon: <CheckCircle2 className="size-4" />,
  },
  error: {
    box: "border-danger-border bg-danger-soft text-danger",
    icon: <XCircle className="size-4" />,
  },
  info: {
    box: "border-info-border bg-info-soft text-info",
    icon: <Info className="size-4" />,
  },
};

// The stack of toasts: bottom-right on desktop, full width at the bottom on a
// phone (above the iPhone home bar). A manual popover so it sits in the top layer, above an open Drawer
// or Modal (native <dialog>); re-shown on every change to stay on top.
export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = ref.current;
    if (!viewport?.showPopover) return;
    if (viewport.matches(":popover-open")) viewport.hidePopover();
    if (toasts.length > 0) viewport.showPopover();
  }, [toasts]);

  return (
    <div
      ref={ref}
      popover="manual"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed m-0 flex-col gap-3 overflow-visible border-0 bg-transparent p-0",
        "inset-x-4 top-auto bottom-[max(1rem,env(safe-area-inset-bottom))] w-auto",
        "sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-full sm:max-w-sm",
        "[&:popover-open]:flex",
      )}
    >
      {toasts.map((toast) => {
        const style = styles[toast.variant];

        return (
          <div
            key={toast.id}
            role={toast.variant === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-pop",
              style.box,
            )}
          >
            <span className="mt-0.5 shrink-0">{style.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 text-xs leading-5 opacity-90">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Fechar mensagem"
              className="shrink-0 rounded opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
