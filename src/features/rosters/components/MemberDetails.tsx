"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/design-system";
import { CopyShareValue } from "@/features/admin/components/CopyShareValue";
import {
  RANK_LABELS,
  formatPhone,
} from "@/features/members/model/member-labels";
import type { Rank } from "@/shared/graphql/schema-enums";

/** Full rank and full name: "3º Sargento - Fulano de Tal". */
export const personTitle = (rank: Rank, name: string) =>
  `${RANK_LABELS[rank].label} - ${name}`;

// Chevron that opens a musician's details under their line.
export function DetailsToggle({
  open,
  name,
  onClick,
}: {
  open: boolean;
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={`${open ? "Ocultar" : "Ver"} dados de ${name}`}
      title={open ? "Ocultar dados" : "Ver dados do músico"}
      className="grid size-8 shrink-0 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
    >
      <ChevronDown
        className={cn("size-4 transition-transform", open && "rotate-180")}
      />
    </button>
  );
}

/** Matrícula with a copy button, or a dash. */
export const registrationValue = (registration: string | null) =>
  registration ? (
    <CopyShareValue
      value={registration}
      label="Matrícula"
      share={false}
      valueClassName="text-fg"
    />
  ) : (
    "—"
  );

/** Phone with a copy button, or a dash. */
export const phoneValue = (phone: string | null) =>
  phone ? (
    <CopyShareValue
      value={formatPhone(phone)}
      label="Telefone"
      share={false}
      valueClassName="text-fg"
    />
  ) : (
    "—"
  );

// A musician's details, one item per line (label over value).
export function DetailsList({
  items,
  className,
}: {
  items: [string, ReactNode][];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "space-y-2 rounded-md border border-border bg-surface p-3 text-sm",
        className,
      )}
    >
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-[11px] font-semibold tracking-[0.05em] text-soft uppercase">
            {label}
          </dt>
          <dd className="min-w-0 text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
