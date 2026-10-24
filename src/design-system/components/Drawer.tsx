"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/design-system/utils/cn";

type DrawerWidth = "sm" | "md" | "lg";

const widths: Record<DrawerWidth, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
};

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** Sticky footer, usually the action buttons. */
  footer?: ReactNode;
  width?: DrawerWidth;
  /** Blocks closing (Esc / backdrop / X) while saving. */
  busy?: boolean;
  children: ReactNode;
};

// Right-side panel for creating and editing records (the amoremio pattern):
// full width on phones, a fixed panel on larger screens, the page still
// visible behind it. Built on the native <dialog> (focus trap, Esc, top
// layer); the panel slides in with a CSS transition on open.
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  footer,
  width = "md",
  busy = false,
  children,
}: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current && !busy) onClose();
      }}
      className={cn(
        "m-0 ml-auto h-dvh max-h-dvh w-full max-w-full border-0 border-l border-border bg-surface p-0 text-fg shadow-pop",
        "backdrop:bg-black/45",
        "translate-x-0 transition-transform duration-200 starting:open:translate-x-full",
        widths[width],
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-chrome-line bg-chrome px-5 py-4">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="truncate text-[15px] font-semibold text-chrome-fg"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 truncate text-[12px] text-chrome-muted">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Fechar"
            className="grid size-8 shrink-0 place-items-center rounded-md text-chrome-subtle transition-colors hover:bg-chrome-hover hover:text-chrome-fg disabled:opacity-40"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-surface-muted px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
