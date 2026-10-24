"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/design-system/utils/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Shown next to the title (e.g. a warning icon). */
  icon?: ReactNode;
  tone?: "neutral" | "danger";
  children: ReactNode;
  /** Action buttons, right-aligned in the footer. */
  footer?: ReactNode;
  /** Blocks closing (Esc / backdrop) while an action is in flight. */
  busy?: boolean;
};

// Centered dialog for short, focused steps (confirmations, a reason to
// type). Forms with several fields open in a Drawer instead. Built on the
// native <dialog>: showModal() gives the focus trap, Esc handling and the
// top layer for free.
export function Modal({
  open,
  onClose,
  title,
  icon,
  tone = "neutral",
  children,
  footer,
  busy = false,
}: ModalProps) {
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
        // Keep the open state owned by the parent.
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current && !busy) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-lg border border-border bg-surface p-0 text-fg shadow-pop backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-chrome-line bg-chrome px-5 py-4">
        {icon && (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-md",
              tone === "danger"
                ? "bg-danger text-white"
                : "bg-brand-gold/15 text-brand-gold",
            )}
          >
            {icon}
          </span>
        )}
        <h2
          id={titleId}
          className="min-w-0 flex-1 truncate text-[15px] font-semibold text-chrome-fg"
        >
          {title}
        </h2>
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
      <div className="px-5 py-5 text-[13px] leading-relaxed text-muted">
        {children}
      </div>
      {footer && (
        <div className="flex justify-end gap-2 border-t border-border bg-surface-muted px-5 py-3.5">
          {footer}
        </div>
      )}
    </dialog>
  );
}
