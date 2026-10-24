"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { cn } from "@/design-system";
import { notificationsClient } from "@/features/notifications/api/notifications.client";

const POLL_MS = 60_000;

// Unread counter: starts with the server's value, then refreshes on every
// navigation, every minute while the tab is visible, and when it regains
// focus (the musician coming back to the app).
export function NotificationBell({
  initialCount,
  className,
}: {
  initialCount: number;
  className?: string;
}) {
  const pathname = usePathname();
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      notificationsClient
        .unreadCount()
        .then((result) => !cancelled && setCount(result.count))
        .catch(() => undefined);
    };
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [pathname]);

  const label =
    count > 0
      ? `Notificações: ${count} não lida${count === 1 ? "" : "s"}`
      : "Notificações";

  return (
    <Link
      href="/notificacoes"
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-fg",
        pathname === "/notificacoes" && "bg-accent-soft text-accent",
        className,
      )}
    >
      <Bell className="size-[18px]" aria-hidden />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] leading-none font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
