"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn, inputClasses } from "@/design-system";
import type { NavItem } from "@/features/layout/model/navigation";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

// "Procurar menus…" in the top bar (amoremio): type part of a page name and
// jump to it. Only lists pages the user can open.
export function MenuSearch({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const term = normalize(query.trim());
  const matches = term
    ? items.filter((item) => normalize(item.label).includes(term))
    : [];

  function go(href: string) {
    setQuery("");
    router.push(href);
  }

  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-soft"
      />
      <input
        type="search"
        aria-label="Procurar menus"
        aria-controls={listId}
        aria-expanded={matches.length > 0}
        role="combobox"
        placeholder="Procurar menus…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && matches[0]) go(matches[0].href);
          if (event.key === "Escape") setQuery("");
        }}
        className={cn(inputClasses, "pl-9")}
      />
      {matches.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface py-1 shadow-pop"
        >
          {matches.map((item) => (
            <li key={item.href} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => go(item.href)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] text-muted hover:bg-surface-muted hover:text-fg"
              >
                <item.icon aria-hidden className="size-4 text-brand-brown" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
