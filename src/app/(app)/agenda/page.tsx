import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, EmptyState, PageHeader, buttonClasses } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { EventList } from "@/features/events/components/EventList";
import { MonthGrid } from "@/features/events/components/MonthGrid";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { requestTime } from "@/server/request-time";
import { eventsService } from "@/server/services/events.service";
import { can } from "@/shared/lib/access";
import {
  currentMonth,
  formatMonth,
  isMonth,
  localDay,
  monthRange,
  shiftMonth,
} from "@/shared/lib/datetime";
import { firstParam, type RawSearchParams } from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Agenda" };

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "EVENTS_READ")) return <AccessDenied />;

  const now = await requestTime();
  const today = localDay(now);
  const params = await searchParams;
  const monthParam = firstParam(params, "mes");
  const thisMonth = currentMonth(now);
  const month = isMonth(monthParam) ? monthParam : thisMonth;
  const events = await authed((token) =>
    eventsService.list(token, monthRange(month)),
  );

  return (
    <>
      <PageHeader
        title="Agenda"
        description="Calendário das apresentações, desfiles, solenidades e ensaios. Para cadastrar e organizar, use Eventos."
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/agenda?mes=${shiftMonth(month, -1)}`}
            aria-label="Mês anterior"
            className={buttonClasses("ghost", "sm")}
          >
            <ChevronLeft className="size-4" />
          </Link>
          <h2 className="min-w-36 text-center text-base font-semibold text-fg first-letter:uppercase">
            {formatMonth(month)}
          </h2>
          <Link
            href={`/agenda?mes=${shiftMonth(month, 1)}`}
            aria-label="Próximo mês"
            className={buttonClasses("ghost", "sm")}
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>
        {month !== thisMonth && (
          <Link href="/agenda" className={buttonClasses("secondary", "sm")}>
            Hoje
          </Link>
        )}
      </div>

      <MonthGrid month={month} today={today} events={events} />

      {/* Phones: the calendar only marks the days; the details are here. */}
      <div className="mt-4 sm:hidden">
        {events.length > 0 ? (
          <EventList events={events} />
        ) : (
          <Card>
            <EmptyState
              icon={<CalendarDays className="size-5" />}
              title="Nada agendado neste mês"
            />
          </Card>
        )}
      </div>
    </>
  );
}
