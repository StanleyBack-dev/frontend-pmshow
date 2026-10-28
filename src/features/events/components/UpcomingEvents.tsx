import Link from "next/link";
import { ChevronRight, Clock, MapPin } from "lucide-react";
import { Badge, cn } from "@/design-system";
import {
  EVENT_STATUS,
  EVENT_TYPE_LABELS,
} from "@/features/events/model/event-labels";
import type { BandEvent } from "@/shared/contracts/events";
import { dateParts, formatTime } from "@/shared/lib/datetime";

/** What the list needs (an event, or the event of an assignment). */
export type UpcomingItem = Pick<
  BandEvent,
  "id" | "title" | "type" | "status" | "callTime" | "startsAt" | "endsAt"
> & { venue: { name: string } | null };

// Next events on the home page: a calendar chip with the date, the title and
// the essentials (time, place), one tap to the event page. Working days
// (expediente) show in blue, with the hours they end.
export function UpcomingEvents({ events }: { events: UpcomingItem[] }) {
  return (
    <ul className="divide-y divide-border">
      {events.map((event) => {
        const date = dateParts(event.startsAt);
        const cancelled = event.status === "CANCELADO";
        const duty = event.type === "EXPEDIENTE";
        return (
          <li key={event.id}>
            <Link
              href={`/eventos/${event.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted sm:px-5"
            >
              <span
                className={cn(
                  "flex w-12 shrink-0 flex-col items-center rounded-md border py-1",
                  duty
                    ? "border-info-border bg-info-soft text-info"
                    : "border-accent-border bg-accent-soft text-accent",
                )}
              >
                <span className="text-[10px] font-semibold tracking-wide uppercase">
                  {date.weekday}
                </span>
                <span className="text-lg leading-5 font-bold tabular-nums">
                  {date.day}
                </span>
                <span className="text-[10px] font-medium uppercase">
                  {date.month}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-sm font-semibold",
                    cancelled ? "text-soft line-through" : "text-fg",
                  )}
                >
                  {event.title}
                </span>
                <span className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted">
                  <Clock aria-hidden className="size-3 shrink-0" />
                  {formatTime(event.startsAt)}
                  {duty && event.endsAt && ` às ${formatTime(event.endsAt)}`}
                  {event.callTime &&
                    ` · concentração ${formatTime(event.callTime)}`}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  <MapPin aria-hidden className="size-3 shrink-0" />
                  <span className="truncate">
                    {event.venue?.name ?? "Local a definir"} ·{" "}
                    {EVENT_TYPE_LABELS[event.type]}
                  </span>
                </span>
                {event.status !== "PLANEJADO" && (
                  <span className="mt-1.5 block sm:hidden">
                    <Badge tone={EVENT_STATUS[event.status].tone}>
                      {EVENT_STATUS[event.status].label}
                    </Badge>
                  </span>
                )}
              </span>
              <span className="flex shrink-0 flex-col items-end gap-2">
                {event.status !== "PLANEJADO" && (
                  <span className="hidden sm:block">
                    <Badge tone={EVENT_STATUS[event.status].tone}>
                      {EVENT_STATUS[event.status].label}
                    </Badge>
                  </span>
                )}
                <ChevronRight aria-hidden className="size-4 text-soft" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
