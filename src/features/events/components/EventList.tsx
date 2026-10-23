import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Badge, cn } from "@/design-system";
import {
  EVENT_STATUS,
  EVENT_TYPE_LABELS,
} from "@/features/events/model/event-labels";
import type { BandEvent } from "@/shared/contracts/events";
import { formatLongDay, formatTime, localDay } from "@/shared/lib/datetime";

/** Events grouped by calendar day (Goiás time), in start order. */
export function EventList({ events }: { events: BandEvent[] }) {
  const days = new Map<string, BandEvent[]>();
  for (const event of events) {
    const key = localDay(event.startsAt);
    days.set(key, [...(days.get(key) ?? []), event]);
  }

  return (
    <div className="space-y-6">
      {[...days.entries()].map(([day, items]) => (
        <section key={day}>
          <h3 className="mb-2 text-sm font-semibold text-fg first-letter:uppercase">
            {formatLongDay(items[0].startsAt)}
          </h3>
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {items.map((event) => (
              <li key={event.id}>
                <EventRow event={event} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function EventRow({ event }: { event: BandEvent }) {
  const cancelled = event.status === "CANCELADO";
  return (
    <Link
      href={`/agenda/${event.id}`}
      className="flex items-start gap-3 px-4 py-3 hover:bg-surface-muted"
    >
      <span className="w-12 shrink-0 pt-0.5 text-sm font-semibold text-accent tabular-nums">
        {formatTime(event.startsAt)}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate font-medium",
            cancelled ? "text-soft line-through" : "text-fg",
          )}
        >
          {event.title}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span>{EVENT_TYPE_LABELS[event.type]}</span>
          {event.callTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" /> Concentração{" "}
              {formatTime(event.callTime)}
            </span>
          )}
          {event.venue && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {event.venue.name}
            </span>
          )}
        </span>
      </span>
      {event.status !== "PLANEJADO" && (
        <Badge tone={EVENT_STATUS[event.status].tone}>
          {EVENT_STATUS[event.status].label}
        </Badge>
      )}
    </Link>
  );
}
