import type { Metadata } from "next";
import { CalendarRange } from "lucide-react";
import {
  Card,
  EmptyState,
  Field,
  FilterActions,
  FilterPanel,
  PageHeader,
  Pagination,
  SegmentedNav,
  Select,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { NewDutyScheduleButton } from "@/features/duty-schedules/components/DutyScheduleDrawer";
import { DutySchedulesTable } from "@/features/duty-schedules/components/DutySchedulesTable";
import { DUTY_STATUS } from "@/features/duty-schedules/model/duty-labels";
import { MyRostersTable } from "@/features/rosters/components/MyRostersTable";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { dutySchedulesService } from "@/server/services/duty-schedules.service";
import { eventsService } from "@/server/services/events.service";
import { membersService } from "@/server/services/members.service";
import { rostersService } from "@/server/services/rosters.service";
import type { DutyScheduleStatus } from "@/shared/contracts/duty-schedules";
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

export const metadata: Metadata = { title: "Expedientes" };

const STATUSES = Object.keys(DUTY_STATUS) as DutyScheduleStatus[];

// Working days: everyone sees their own; who builds rosters also launches
// expedientes for the band and follows the ones launched.
export default async function DutySchedulesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "ROSTERS_READ_OWN")) return <AccessDenied />;
  const canLaunch = can(user, "ROSTERS_MANAGE", "EVENTS_MANAGE");
  const canSeeLaunched = can(user, "ROSTERS_MANAGE");

  const params = await searchParams;
  const launchedTab =
    canSeeLaunched && firstParam(params, "aba") === "lancados";
  const search = firstParam(params, "busca")?.slice(0, 120) ?? "";
  const status = oneOf(firstParam(params, "situacao"), STATUSES);
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const [mine, launched, venues, band] = await authed((token) =>
    Promise.all([
      rostersService.minePage(token, {
        tab: "DUTY",
        page: launchedTab ? 1 : page,
        limit: pageSize,
      }),
      launchedTab
        ? dutySchedulesService.page(token, {
            search,
            status,
            page,
            limit: pageSize,
          })
        : Promise.resolve(null),
      canLaunch ? eventsService.venues(token) : Promise.resolve([]),
      canLaunch ? membersService.bandMembers(token) : Promise.resolve([]),
    ]),
  );
  const filtered = Boolean(search || status);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/expedientes", {
      aba: launchedTab ? "lancados" : undefined,
      busca: launchedTab ? search : undefined,
      situacao: launchedTab ? status : undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });
  const tabHref = (lancados: boolean) =>
    hrefWith({
      aba: lancados ? "lancados" : undefined,
      busca: undefined,
      situacao: undefined,
      page: undefined,
    });
  const list = launched ?? mine.page;

  return (
    <>
      <PageHeader
        title="Expedientes"
        description={
          canLaunch
            ? "Dias de trabalho da semana ou do mês: os seus e os lançados para a banda."
            : "Seus dias de trabalho, com entrada e saída. Não é preciso confirmar."
        }
        actions={
          canLaunch ? (
            <NewDutyScheduleButton venues={venues} members={band} />
          ) : undefined
        }
      />

      {canSeeLaunched && (
        <div className="mb-4">
          <SegmentedNav
            label="Expedientes"
            items={[
              {
                label: "Meus expedientes",
                href: tabHref(false),
                active: !launchedTab,
                count: mine.counts.duty,
              },
              {
                label: "Lançados",
                href: tabHref(true),
                active: launchedTab,
              },
            ]}
          />
        </div>
      )}

      {launchedTab && (
        <FilterPanel hasActiveFilters={filtered}>
          <form
            role="search"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <input type="hidden" name="aba" value="lancados" />
            {pageSize !== DEFAULT_PAGE_SIZE && (
              <input type="hidden" name="por-pagina" value={pageSize} />
            )}
            <Field
              label="Buscar"
              name="busca"
              defaultValue={search}
              placeholder="Nome do expediente"
            />
            <Select
              label="Situação"
              name="situacao"
              defaultValue={status ?? ""}
              placeholder="Todas"
              options={STATUSES.map((value) => ({
                value,
                label: DUTY_STATUS[value].label,
              }))}
            />
            <FilterActions
              clearHref={tabHref(true)}
              hasActiveFilters={filtered}
            />
          </form>
        </FilterPanel>
      )}

      <Card>
        {launched ? (
          launched.items.length === 0 ? (
            <EmptyState
              icon={<CalendarRange className="size-5" />}
              title={
                filtered
                  ? "Nenhum expediente encontrado"
                  : "Nenhum expediente lançado"
              }
              description={
                filtered
                  ? "Tente outros filtros."
                  : canLaunch
                    ? "Lance a semana ou o mês em “Novo expediente”."
                    : undefined
              }
            />
          ) : (
            <DutySchedulesTable
              schedules={launched.items}
              canCancel={canLaunch}
            />
          )
        ) : mine.page.items.length === 0 ? (
          <EmptyState
            icon={<CalendarRange className="size-5" />}
            title="Nenhum expediente pela frente"
            description="Quando um gestor lançar um expediente com você, ele aparece aqui, na agenda e chega por e-mail."
          />
        ) : (
          <MyRostersTable assignments={mine.page.items} duty />
        )}
        <Pagination
          page={list.page}
          totalPages={list.totalPages}
          total={list.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
