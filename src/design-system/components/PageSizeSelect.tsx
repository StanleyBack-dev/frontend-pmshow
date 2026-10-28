"use client";

import { useId, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/design-system/components/Spinner";

// "Itens por página" of the Pagination footer: each size is a URL (built on
// the server), so changing it is just a navigation; a spinner shows until
// the new page arrives.
export function PageSizeSelect({
  value,
  options,
}: {
  value: number;
  options: { size: number; href: string }[];
}) {
  const router = useRouter();
  const id = useId();
  const [pending, startTransition] = useTransition();
  return (
    <label htmlFor={id} className="flex items-center gap-2">
      <span>Itens por página</span>
      <select
        id={id}
        value={value}
        disabled={pending}
        aria-busy={pending}
        onChange={(event) => {
          const option = options.find(
            (item) => item.size === Number(event.target.value),
          );
          if (option) startTransition(() => router.push(option.href));
        }}
        className="h-8 rounded-md border border-border-strong bg-surface px-2 text-[13px] text-fg focus:border-brand-gold focus:ring-2 focus:ring-ring focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.size} value={option.size}>
            {option.size}
          </option>
        ))}
      </select>
      {pending && <Spinner size="sm" className="shrink-0" />}
    </label>
  );
}
