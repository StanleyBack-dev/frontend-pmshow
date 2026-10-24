"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/design-system/utils/cn";

// Collapsible box for a list page's filters (amoremio pattern): the trigger
// sits centered on the dark chrome, the panel starts closed and a gold dot
// tells when some filter is applied. The fields inside are a plain GET form,
// so filters stay in the URL.
export function FilterPanel({
  children,
  label = "Filtros",
  defaultOpen = false,
  hasActiveFilters = false,
  className,
}: {
  children: ReactNode;
  label?: string;
  defaultOpen?: boolean;
  hasActiveFilters?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <div
      className={cn(
        "filter-panel mb-4 rounded-lg border border-chrome-line bg-chrome p-3",
        className,
      )}
    >
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={regionId}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-chrome-muted uppercase transition-colors hover:bg-chrome-hover hover:text-chrome-fg"
        >
          <SlidersHorizontal aria-hidden className="size-3.5" />
          <span>{label}</span>
          {hasActiveFilters && (
            <>
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-brand-gold"
              />
              <span className="sr-only">(filtros aplicados)</span>
            </>
          )}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
      {open && (
        <div id={regionId} className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}
