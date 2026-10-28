"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkPending, cn } from "@/design-system";
import {
  ADMIN_SECTIONS,
  type AdminSection,
} from "@/features/admin/model/admin-sections";

// Administração's menu: a two-column grid on phones (every area visible,
// no sideways scrolling) and a row of tiles (area, name and what it is for) on larger screens, so the
// tables below keep the full width.
export function AdminNav({ allowed }: { allowed: string[] }) {
  const pathname = usePathname();
  const sections = ADMIN_SECTIONS.filter((section) =>
    allowed.includes(section.href),
  );
  const isCurrent = (section: AdminSection) =>
    pathname === section.href || pathname.startsWith(`${section.href}/`);

  return (
    <nav aria-label="Administração" className="min-w-0">
      <ul className="mb-5 grid grid-cols-2 gap-2 lg:hidden">
        {sections.map((section) => {
          const Icon = section.icon;
          const current = isCurrent(section);
          return (
            // An odd last item takes the whole row.
            <li
              key={section.href}
              className="[&:last-child:nth-child(odd)]:col-span-2"
            >
              <Link
                href={section.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-full min-h-14 items-center gap-2.5 rounded-lg border p-2.5 transition-colors",
                  current
                    ? "border-chrome bg-chrome text-chrome-fg"
                    : "border-border bg-surface text-fg active:bg-surface-muted",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-md border",
                    current
                      ? "border-brand-gold/40 text-brand-gold"
                      : "border-border bg-surface-muted text-muted",
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 flex-1 text-[13px] leading-tight font-semibold">
                  {section.label}
                </span>
                <LinkPending />
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="mb-6 hidden gap-3 lg:grid lg:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const current = isCurrent(section);
          return (
            <li key={section.href}>
              <Link
                href={section.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "group flex h-full items-start gap-3 rounded-lg border p-3 transition-colors",
                  current
                    ? "border-chrome bg-chrome text-chrome-fg"
                    : "border-border bg-surface text-fg hover:border-border-strong hover:bg-surface-muted",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-md border",
                    current
                      ? "border-brand-gold/40 text-brand-gold"
                      : "border-border bg-surface-muted text-muted group-hover:text-fg",
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[10px] font-semibold tracking-[0.08em] uppercase",
                      current ? "text-brand-gold" : "text-soft",
                    )}
                  >
                    {section.group}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                    {section.label}
                    <LinkPending />
                  </span>
                  <span
                    className={cn(
                      "block text-xs",
                      current ? "text-chrome-fg/70" : "text-soft",
                    )}
                  >
                    {section.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
