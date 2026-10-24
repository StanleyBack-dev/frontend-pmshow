import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// One entry of the Configurações list (amoremio pattern): icon, title,
// one-line description, and an arrow to the page it opens.
export function SettingsLinkItem({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-4 rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-brand-gold hover:bg-surface-muted"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-brand-gold-border bg-brand-gold-soft text-brand-gold-ink">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-fg">{title}</span>
        <span className="mt-0.5 block text-xs text-muted">{description}</span>
      </span>
      <ChevronRight aria-hidden className="size-[18px] shrink-0 text-soft" />
    </Link>
  );
}
