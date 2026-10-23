import Link from "next/link";
import { cn } from "@/design-system";
import type { BandEvent } from "@/shared/contracts/events";
import { formatTime, localDay } from "@/shared/lib/datetime";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MAX_PER_DAY = 3;

/** Month calendar (desktop). `month` is "YYYY-MM"; `today` is "YYYY-MM-DD". */
export function MonthGrid({
  month,
  today,
  events,
}: {
  month: string;
  today: string;
  events: BandEvent[];
}) {
  const [year, monthIndex] = month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, monthIndex - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const byDay = new Map<string, BandEvent[]>();
  for (const event of events) {
    const key = localDay(event.startsAt);
    byDay.set(key, [...(byDay.get(key) ?? []), event]);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-surface-muted text-center text-xs font-medium text-soft">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          const key = day ? `${month}-${String(day).padStart(2, "0")}` : null;
          const items = key ? (byDay.get(key) ?? []) : [];
          return (
            <div
              key={index}
              className={cn(
                "min-h-24 border-r border-b border-border p-1.5 text-xs [&:nth-child(7n)]:border-r-0",
                !day && "bg-surface-sunken/50",
              )}
            >
              {day && (
                <span
                  className={cn(
                    "mb-1 inline-grid size-6 place-items-center rounded-full",
                    key === today ? "bg-accent text-accent-fg" : "text-muted",
                  )}
                >
                  {day}
                </span>
              )}
              <ul className="space-y-1">
                {items.slice(0, MAX_PER_DAY).map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/agenda/${event.id}`}
                      title={event.title}
                      className={cn(
                        "block truncate rounded px-1 py-0.5",
                        event.status === "CANCELADO"
                          ? "bg-danger-soft text-danger line-through"
                          : "bg-accent-soft text-accent hover:underline",
                      )}
                    >
                      {formatTime(event.startsAt)} {event.title}
                    </Link>
                  </li>
                ))}
                {items.length > MAX_PER_DAY && (
                  <li className="px-1 text-soft">
                    +{items.length - MAX_PER_DAY}
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
