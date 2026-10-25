import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClasses } from "@/design-system/components/Button";
import { LinkPending } from "@/design-system/components/LinkPending";
import { PageSizeSelect } from "@/design-system/components/PageSizeSelect";
import { cn } from "@/design-system/utils/cn";

type PaginationProps = {
  /** 1-based current page. */
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  hrefFor: (page: number) => string;
  /** Sizes offered in "Itens por página" (omit to hide the selector). */
  pageSizes?: readonly number[];
  /** Link for another page size (should go back to page 1). */
  pageSizeHref?: (size: number) => string;
};

// Compact page list: 1 … (p-1) p (p+1) … last.
function pageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) pages.push("…");
  for (let current = start; current <= end; current += 1) pages.push(current);
  if (end < totalPages - 1) pages.push("…");
  pages.push(totalPages);
  return pages;
}

// Footer of paginated lists (amoremio pattern): "Mostrando a–b de N",
// items per page and numbered pages. Plain links, so it works in server
// components and every page has its own URL.
export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  hrefFor,
  pageSizes,
  pageSizeHref,
}: PaginationProps) {
  // Nothing to page through: the list's empty state covers it.
  if (total === 0) return null;

  const pageCount = Math.max(totalPages, 1);
  const current = Math.min(Math.max(page, 1), pageCount);
  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const step = (
    target: number,
    label: string,
    icon: ReactNode,
    disabled: boolean,
  ) =>
    disabled ? (
      <span
        aria-disabled
        className={cn(
          buttonClasses("secondary", "sm"),
          "pointer-events-none opacity-40",
        )}
      >
        {icon}
        <span className="sr-only sm:not-sr-only">{label}</span>
      </span>
    ) : (
      <Link href={hrefFor(target)} className={buttonClasses("secondary", "sm")}>
        {icon}
        <span className="sr-only sm:not-sr-only">{label}</span>
        <LinkPending />
      </Link>
    );

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-[13px] text-muted sm:px-5"
    >
      <p className="tabular-nums">
        Mostrando{" "}
        <span className="font-medium text-fg">
          {from}–{to}
        </span>{" "}
        de <span className="font-medium text-fg">{total}</span>
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {pageSizes && pageSizeHref && (
          <PageSizeSelect
            value={pageSize}
            options={pageSizes.map((size) => ({
              size,
              href: pageSizeHref(size),
            }))}
          />
        )}
        <div className="flex items-center gap-1">
          {step(
            current - 1,
            "Anterior",
            <ChevronLeft className="size-4" />,
            current <= 1,
          )}
          {pageWindow(current, pageCount).map((entry, index) =>
            entry === "…" ? (
              <span
                key={`gap-${index}`}
                aria-hidden
                className="px-1 text-soft select-none"
              >
                …
              </span>
            ) : entry === current ? (
              <span
                key={entry}
                aria-current="page"
                className="grid h-8 min-w-8 place-items-center rounded-md bg-accent px-2 font-semibold text-accent-fg tabular-nums"
              >
                {entry}
              </span>
            ) : (
              <Link
                key={entry}
                href={hrefFor(entry)}
                aria-label={`Página ${entry}`}
                className="grid h-8 min-w-8 place-items-center rounded-md px-2 text-fg tabular-nums transition-colors hover:bg-surface-muted"
              >
                {entry}
              </Link>
            ),
          )}
          {step(
            current + 1,
            "Próxima",
            <ChevronRight className="size-4" />,
            current >= pageCount,
          )}
        </div>
      </div>
    </nav>
  );
}
