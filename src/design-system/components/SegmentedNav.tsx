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
}: {
  items: SegmentedNavItem[];
  label: string;
}) {
  return (
    <nav
      aria-label={label}
      className="inline-flex max-w-full overflow-x-auto rounded-md border border-border-strong bg-surface p-1"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-colors",
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
