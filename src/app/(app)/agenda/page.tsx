import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  EmptyState,
  LinkPending,
  LinkPendingSwap,
  PageHeader,
  SegmentedNav,
  buttonClasses,
  cn,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { AgendaEventsTable } from "@/features/events/components/AgendaEventsTable";
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
import {
  buildHref,
  firstParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

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
  const onlyMine = firstParam(params, "minhas") === "1";
  const all = await authed((token) =>
    eventsService.list(token, monthRange(month)),
  );
  // Each person's agenda: every band event, but working days (expediente)
  // only when they are on them; "Só os meus" keeps what they are on.
  const events = all.filter((event) =>
    onlyMine || event.type === "EXPEDIENTE"
      ? event.myAssignment !== null
      : true,
  );
  const hrefWith = (overrides: Record<string, string | undefined>) =>
    buildHref("/agenda", {
      mes: month === thisMonth ? undefined : month,
      minhas: onlyMine ? "1" : undefined,
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Agenda"
        description="Apresentações, desfiles, ensaios e os seus expedientes. Em destaque, o que você está escalado."
      />

      {/* Phones: month on one row, the filter (and "Hoje") below it. */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-1 sm:justify-start">
          <Link
            href={hrefWith({ mes: shiftMonth(month, -1) })}
            aria-label="Mês anterior"
            className={buttonClasses("ghost", "sm")}
          >
            <LinkPendingSwap>
              <ChevronLeft className="size-4" />
            </LinkPendingSwap>
          </Link>
          <h2 className="min-w-36 flex-1 text-center text-base font-semibold text-fg first-letter:uppercase sm:flex-none">
            {formatMonth(month)}
          </h2>
          <Link
            href={hrefWith({ mes: shiftMonth(month, 1) })}
            aria-label="Próximo mês"
            className={buttonClasses("ghost", "sm")}
          >
            <LinkPendingSwap>
              <ChevronRight className="size-4" />
            </LinkPendingSwap>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedNav
            fill
            className="flex-1 sm:flex-none"
            label="Mostrar"
            items={[
              {
                label: "Todos",
                href: hrefWith({ minhas: undefined }),
                active: !onlyMine,
              },
              {
                label: "Só os meus",
                href: hrefWith({ minhas: "1" }),
                active: onlyMine,
              },
            ]}
          />
          {month !== thisMonth && (
            <Link
              href={hrefWith({ mes: undefined })}
              className={cn(buttonClasses("secondary", "sm"), "shrink-0")}
            >
              <LinkPending />
              Hoje
            </Link>
          )}
        </div>
      </div>

      <MonthGrid month={month} today={today} events={events} />
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand-gold" /> Você está
          escalado
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-info" /> Seu expediente
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-accent" /> Evento da banda
        </li>
      </ul>

      {/* The month's events in detail (phones: the calendar only marks the days). */}
      <div className="mt-4">
        {events.length > 0 ? (
          <Card>
            <AgendaEventsTable events={events} />
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon={<CalendarDays className="size-5" />}
              title={
                onlyMine
                  ? "Você não está escalado neste mês"
                  : "Nada agendado neste mês"
              }
            />
          </Card>
        )}
      </div>
    </>
  );
}
