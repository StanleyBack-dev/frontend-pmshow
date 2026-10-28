import Link from "next/link";
import { LinkPending } from "@/design-system/components/LinkPending";
import { cn } from "@/design-system/utils/cn";

export type SegmentedNavItem = {
  label: string;
  href: string;
  active: boolean;
  count?: number;
};

// URL-driven segmented control (filters live in the query string, so the
// page stays a Server Component and every state is linkable).
export function SegmentedNav({
  items,
  label,
  fill = false,
  className,
}: {
  items: SegmentedNavItem[];
  label: string;
  /** Options share the whole width (e.g. a toolbar on phones). */
  fill?: boolean;
  className?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "inline-flex max-w-full overflow-x-auto rounded-md border border-border-strong bg-surface p-1",
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-colors",
            fill && "flex-1 justify-center",
            item.active
              ? "bg-chrome text-chrome-fg"
              : "text-muted hover:bg-surface-muted hover:text-fg",
          )}
        >
          {item.label}
          <LinkPending />
          {item.count !== undefined && (
            <span
              className={cn(
                "text-xs tabular-nums",
                item.active ? "text-brand-gold" : "text-soft",
              )}
            >
              {item.count}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
