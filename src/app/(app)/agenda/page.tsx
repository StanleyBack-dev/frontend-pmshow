import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import {
  Card,
  EmptyState,
  PageHeader,
  SegmentedNav,
  buttonClasses,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { EventList } from "@/features/events/components/EventList";
import { NewEventButton } from "@/features/events/components/EventFormModal";
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

const UPCOMING_DAYS = 120;

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "EVENTS_READ")) return <AccessDenied />;
  const canManage = can(user, "EVENTS_MANAGE");

  const now = await requestTime();
  const today = localDay(now);
  const params = await searchParams;
  const monthParam = firstParam(params, "mes");
  const monthView =
    firstParam(params, "visao") === "mes" || isMonth(monthParam);
  const month = isMonth(monthParam) ? monthParam : currentMonth(now);

  const range = monthView
    ? monthRange(month)
    : {
        from: `${today}T00:00:00-03:00`,
        to: new Date(now.getTime() + UPCOMING_DAYS * 86_400_000).toISOString(),
      };
  const [events, venues] = await authed((token) =>
    Promise.all([
      eventsService.list(token, range),
      canManage ? eventsService.venues(token, true) : Promise.resolve([]),
    ]),
  );

  return (
    <>
      <PageHeader
        title="Agenda"
        description="Apresentações, desfiles, solenidades e ensaios da banda."
        actions={
          canManage ? (
            <div className="flex gap-2">
              <Link
                href="/agenda/locais"
                className={buttonClasses("secondary")}
              >
                <MapPin className="size-4" /> Locais
              </Link>
              <NewEventButton venues={venues} />
            </div>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SegmentedNav
          label="Visão da agenda"
          items={[
            { label: "Próximos", href: "/agenda", active: !monthView },
            { label: "Mês", href: `/agenda?mes=${month}`, active: monthView },
          ]}
        />
        {monthView && (
          <div className="flex items-center gap-1">
            <Link
              href={`/agenda?mes=${shiftMonth(month, -1)}`}
              aria-label="Mês anterior"
              className={buttonClasses("ghost", "sm")}
            >
              <ChevronLeft className="size-4" />
            </Link>
            <span className="min-w-36 text-center text-sm font-medium text-fg first-letter:uppercase">
              {formatMonth(month)}
            </span>
            <Link
              href={`/agenda?mes=${shiftMonth(month, 1)}`}
              aria-label="Próximo mês"
              className={buttonClasses("ghost", "sm")}
            >
              <ChevronRight className="size-4" />
            </Link>
          </div>
        )}
      </div>

      {monthView ? (
        <>
          <div className="hidden md:block">
            <MonthGrid month={month} today={today} events={events} />
          </div>
          <div className="md:hidden">
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
      ) : events.length > 0 ? (
        <EventList events={events} />
      ) : (
        <Card>
          <EmptyState
            icon={<CalendarDays className="size-5" />}
            title="Nenhum evento nos próximos meses"
            description={
              canManage ? "Cadastre o próximo em “Novo evento”." : undefined
            }
          />
        </Card>
      )}
    </>
  );
}
