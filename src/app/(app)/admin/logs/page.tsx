import type { Metadata } from "next";
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  ScrollText,
  XCircle,
} from "lucide-react";
import {
  Card,
  EmptyState,
  Field,
  FilterActions,
  FilterPanel,
  Pagination,
  Select,
  StatCard,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { SystemLogsTable } from "@/features/admin/components/SystemLogsTable";
import {
  CATEGORY_LABELS,
  ENVIRONMENTS,
  LEVEL_LABELS,
} from "@/features/admin/model/system-log-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { systemLogsService } from "@/server/services/system-logs.service";
import {
  SYSTEM_CATEGORIES,
  SYSTEM_LEVELS,
  type SystemLevel,
} from "@/shared/contracts/system-logs";
import { can } from "@/shared/lib/access";
import { dayRange, isDay } from "@/shared/lib/datetime";
import {
  buildHref,
  firstParam,
  oneOf,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  pageParam,
  pageSizeParam,
  pageSizeQuery,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Logs do sistema" };

const LEVEL_ICONS: Record<SystemLevel, React.ReactNode> = {
  INFO: <Info />,
  WARN: <AlertTriangle />,
  ERROR: <XCircle />,
  CRITICAL: <AlertOctagon />,
};

// ADMIN_MASTER: API and database errors, security events, notices not
// delivered, failed GitHub Actions routines and screen errors. The serious
// ones also arrive as a notification and an e-mail.
export default async function SystemLogsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "AUDIT_READ")) return <AccessDenied />;

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 100) ?? "";
  const from = firstParam(params, "de");
  const to = firstParam(params, "ate");
  const level = oneOf(firstParam(params, "nivel"), SYSTEM_LEVELS);
  const category = oneOf(firstParam(params, "tipo"), SYSTEM_CATEGORIES);
  const environment = oneOf(
    firstParam(params, "ambiente"),
    ENVIRONMENTS.map((item) => item.value),
  );
  const fromDay = isDay(from) ? from : undefined;
  const toDay = isDay(to) ? to : undefined;
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/admin/logs", {
      busca: search,
      de: fromDay,
      ate: toDay,
      nivel: level,
      tipo: category,
      ambiente: environment,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  const [logs, summary] = await authed((token) =>
    Promise.all([
      systemLogsService.list(
        token,
        {
          search: search || undefined,
          from: fromDay ? dayRange(fromDay).from : undefined,
          to: toDay ? dayRange(toDay).to : undefined,
          levels: level ? [level] : undefined,
          categories: category ? [category] : undefined,
          environment,
        },
        { page, limit: pageSize },
      ),
      systemLogsService.summary(token),
    ]),
  );
  const filtered = Boolean(
    search || fromDay || toDay || level || category || environment,
  );
  const countOf = (value: SystemLevel) =>
    summary.find((row) => row.level === value) ?? {
      last24h: 0,
      last7d: 0,
    };

  return (
    <>
      <ul className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SYSTEM_LEVELS.map((value) => {
          const count = countOf(value);
          return (
            <li key={value}>
              <StatCard
                label={`${LEVEL_LABELS[value].label} · 24 h`}
                value={count.last24h}
                hint={`${count.last7d} em 7 dias`}
                icon={LEVEL_ICONS[value]}
                tone={
                  value === "INFO"
                    ? "info"
                    : value === "WARN"
                      ? "warning"
                      : "danger"
                }
              />
            </li>
          );
        })}
      </ul>

      <FilterPanel hasActiveFilters={filtered}>
        <form
          role="search"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {pageSize !== DEFAULT_PAGE_SIZE && (
            <input type="hidden" name="por-pagina" value={pageSize} />
          )}
          <Field
            label="Buscar"
            name="busca"
            defaultValue={search}
            placeholder="Mensagem ou origem"
          />
          <Field label="De" name="de" type="date" defaultValue={fromDay} />
          <Field label="Até" name="ate" type="date" defaultValue={toDay} />
          <Select
            label="Nível"
            name="nivel"
            defaultValue={level ?? ""}
            placeholder="Todos"
            options={SYSTEM_LEVELS.map((value) => ({
              value,
              label: LEVEL_LABELS[value].label,
            }))}
          />
          <Select
            label="Tipo"
            name="tipo"
            defaultValue={category ?? ""}
            placeholder="Todos"
            options={SYSTEM_CATEGORIES.map((value) => ({
              value,
              label: CATEGORY_LABELS[value],
            }))}
          />
          <Select
            label="Ambiente"
            name="ambiente"
            defaultValue={environment ?? ""}
            placeholder="Todos"
            options={ENVIRONMENTS}
          />
          <FilterActions clearHref="/admin/logs" hasActiveFilters={filtered} />
        </form>
      </FilterPanel>

      <Card>
        {logs.items.length === 0 ? (
          <EmptyState
            icon={<ScrollText className="size-5" />}
            title={filtered ? "Nenhum registro encontrado" : "Nenhum registro"}
            description={
              filtered
                ? "Tente outros filtros."
                : "Erros, eventos de segurança e falhas das rotinas aparecem aqui. Os registros ficam 90 dias."
            }
          />
        ) : (
          <SystemLogsTable logs={logs.items} />
        )}

        <Pagination
          page={logs.page}
          totalPages={logs.totalPages}
          total={logs.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
