"use client";

import type { ReactNode } from "react";
import { useLinkStatus } from "next/link";
import { Spinner } from "@/design-system/components/Spinner";
import { cn } from "@/design-system/utils/cn";

// Placed inside a <Link>: a small spinner while that link's navigation is
// pending. For links that stay on the same page (filters, tabs, pagination
// in the query string), where no loading.tsx fallback shows.
export function LinkPending({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  return pending ? (
    <Spinner size="sm" className={cn("shrink-0", className)} />
  ) : null;
}

// Placed inside a <Link>: its content swapped for the spinner while pending
// (e.g. a page number, so the link keeps its size).
export function LinkPendingSwap({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();
  return pending ? <Spinner size="sm" className="shrink-0" /> : children;
}
