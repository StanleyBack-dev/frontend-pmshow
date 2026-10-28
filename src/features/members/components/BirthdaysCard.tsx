import { Cake } from "lucide-react";
import { Avatar, Badge, Card } from "@/design-system";
import { RANK_LABELS } from "@/features/members/model/member-labels";
import type { Birthday } from "@/shared/contracts/members";

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// The month's birthdays on the home page: everyone in the band, by day; today
// stands out.
export function BirthdaysCard({
  birthdays,
  today,
}: {
  birthdays: Birthday[];
  /** Day and month (1-12) of today in the app's timezone. */
  today: { day: number; month: number };
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-gold-soft text-brand-gold-ink [&>svg]:size-4">
          <Cake />
        </span>
        <h2 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-fg">
          Aniversariantes de {MONTHS[today.month - 1]}
        </h2>
      </div>
      {birthdays.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted sm:px-5">
          Nenhum aniversariante neste mês.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {birthdays.map((person) => {
            const isToday = person.day === today.day;
            const passed = person.day < today.day;
            return (
              <li
                key={person.userId}
                className="flex items-center gap-3 px-4 py-2.5 sm:px-5"
              >
                <Avatar name={person.warName} src={person.photoUrl} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">
                    {person.warName}
                  </span>
                  {person.rank && (
                    <span className="block truncate text-xs text-soft">
                      {RANK_LABELS[person.rank].label}
                    </span>
                  )}
                </span>
                {isToday ? (
                  <Badge tone="gold">Hoje</Badge>
                ) : (
                  <span
                    className={
                      passed
                        ? "text-xs text-soft tabular-nums"
                        : "text-xs font-medium text-fg tabular-nums"
                    }
                  >
                    {String(person.day).padStart(2, "0")}/
                    {String(today.month).padStart(2, "0")}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
