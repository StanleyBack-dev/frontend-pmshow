"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/design-system/utils/cn";

// An icon button that explains itself: the text shows on hover and keyboard
// focus, and on tap (phones have no hover). Esc or a tap elsewhere hides it.
export function Hint({
  icon,
  label,
  children,
  className,
}: {
  icon: ReactNode;
  /** Short accessible name of the button. */
  label: string;
  /** The explanation shown in the bubble. */
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span
      ref={rootRef}
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
      >
        {icon}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-40 mb-2 w-56 -translate-x-1/2 rounded-md border border-chrome-line bg-chrome px-3 py-2 text-xs leading-snug text-chrome-fg shadow-pop"
        >
          {children}
        </span>
      )}
    </span>
  );
}
