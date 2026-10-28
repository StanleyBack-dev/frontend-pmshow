import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import {
  Card,
  EmptyState,
  Field,
  FilterActions,
  FilterPanel,
  PageHeader,
  Pagination,
  Select,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { NewEventButton } from "@/features/events/components/EventFormDrawer";
import { EventsTable } from "@/features/events/components/EventsTable";
import {
  EVENT_PERIODS,
  EVENT_STATUS,
  EVENT_STATUSES,
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
} from "@/features/events/model/event-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { eventsService } from "@/server/services/events.service";
import { can } from "@/shared/lib/access";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  pageSizeParam,
  pageSizeQuery,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Eventos" };

const PERIODS = Object.keys(EVENT_PERIODS) as (keyof typeof EVENT_PERIODS)[];

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "EVENTS_READ")) return <AccessDenied />;
  const canManage = can(user, "EVENTS_MANAGE");

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 120) ?? "";
  // Upcoming by default; "todos" lists every event, latest first.
  const periodParam = firstParam(params, "periodo");
  const period =
    periodParam === "todos"
      ? undefined
      : (oneOf(periodParam, PERIODS) ?? "proximos");
  const type = oneOf(firstParam(params, "tipo"), EVENT_TYPES);
  const status = oneOf(firstParam(params, "situacao"), EVENT_STATUSES);
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const [events, venues] = await authed((token) =>
    Promise.all([
      eventsService.page(token, {
        search,
        type,
        status,
        period: period ? EVENT_PERIODS[period].period : undefined,
        page,
        limit: pageSize,
      }),
      canManage ? eventsService.venues(token, true) : Promise.resolve([]),
    ]),
  );
  const filtered = Boolean(search || type || status || period !== "proximos");
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/eventos", {
      busca: search,
      periodo: period === "proximos" ? undefined : (period ?? "todos"),
      tipo: type,
      situacao: status,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Eventos"
        description="Cadastre e organize as apresentações: dados do evento, lista de músicas e escala dos músicos."
        actions={canManage ? <NewEventButton venues={venues} /> : undefined}
      />

      <FilterPanel hasActiveFilters={filtered}>
        <form
          role="search"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {pageSize !== DEFAULT_PAGE_SIZE && (
            <input type="hidden" name="por-pagina" value={pageSize} />
          )}
          <Field
            label="Evento"
            name="busca"
            defaultValue={search}
            placeholder="Parte do nome"
          />
          <Select
            label="Período"
            name="periodo"
            defaultValue={period ?? "todos"}
            options={[
              ...PERIODS.map((value) => ({
                value,
                label: EVENT_PERIODS[value].label,
              })),
              { value: "todos", label: "Todos" },
            ]}
          />
          <Select
            label="Tipo"
            name="tipo"
            defaultValue={type ?? ""}
            placeholder="Todos"
            options={EVENT_TYPES.map((value) => ({
              value,
              label: EVENT_TYPE_LABELS[value],
            }))}
          />
          <Select
            label="Situação"
            name="situacao"
            defaultValue={status ?? ""}
            placeholder="Todas"
            options={EVENT_STATUSES.map((value) => ({
              value,
              label: EVENT_STATUS[value].label,
            }))}
          />
          <FilterActions
            clearHref={hrefWith({
              busca: undefined,
              periodo: undefined,
              tipo: undefined,
              situacao: undefined,
              page: undefined,
            })}
            hasActiveFilters={filtered}
          />
        </form>
      </FilterPanel>

      <Card>
        {events.items.length === 0 ? (
          <EmptyState
            icon={<CalendarClock className="size-5" />}
            title={
              filtered
                ? "Nenhum evento encontrado"
                : "Nenhum evento pela frente"
            }
            description={
              filtered
                ? "Tente outros filtros ou o período “Todos”."
                : canManage
                  ? "Cadastre o próximo em “Novo evento”."
                  : undefined
            }
          />
        ) : (
          <EventsTable
            events={events.items}
            venues={venues}
            canManage={canManage}
            canBuildRoster={can(user, "ROSTERS_MANAGE")}
            canPublishRoster={can(user, "ROSTERS_PUBLISH")}

            rosterViewer={
              can(user, "ROSTERS_READ_OWN") || can(user, "ROSTERS_READ_ALL")
                ? {
                    id: user.id,
                    showManagerInfo: can(user, "ROSTERS_READ_ALL"),
                  }
                : undefined
            }
          />
        )}
        <Pagination
          page={events.page}
          totalPages={events.totalPages}
          total={events.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
