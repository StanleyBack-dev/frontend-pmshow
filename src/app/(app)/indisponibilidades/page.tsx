import type { Metadata } from "next";
import { CalendarOff } from "lucide-react";
import {
  Card,
  EmptyState,
  PageHeader,
  Pagination,
  SegmentedNav,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import {
  AbsencesTable,
  type AbsencePerson,
} from "@/features/availability/components/AbsencesTable";
import { NewAbsenceButton } from "@/features/availability/components/NewAbsenceButton";
import { RANK_LABELS } from "@/features/members/model/member-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { requestTime } from "@/server/request-time";
import { absencesService } from "@/server/services/absences.service";
import { membersService } from "@/server/services/members.service";
import { can } from "@/shared/lib/access";
import { localDay } from "@/shared/lib/datetime";
import {
  PAGE_SIZES,
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  pageSizeParam,
  pageSizeQuery,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Indisponibilidades" };

// Managers (Gestor, Administrador geral) review requests and see who is
// away from today on; they don't ask for absences. Musicians see their own.
const TABS = ["analisar", "aprovadas", "minhas"] as const;
type Tab = (typeof TABS)[number];

const EMPTY: Record<Tab, string> = {
  analisar: "Nenhum pedido aguardando análise",
  aprovadas: "Ninguém indisponível a partir de hoje",
  minhas: "Você ainda não pediu nenhuma indisponibilidade",
};

export default async function AbsencesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  // Musicians ask for their own; managers (who don't ask) review.
  const canRequest = can(user, "ABSENCES_REQUEST");
  const isManager = can(user, "ABSENCES_MANAGE");
  if (!canRequest && !isManager) return <AccessDenied />;
  const today = localDay(await requestTime());

  const params = await searchParams;
  const asked = oneOf(firstParam(params, "aba"), TABS);
  const tab: Tab = !isManager
    ? "minhas"
    : asked === "minhas" && !canRequest
      ? "analisar"
      : (asked ?? "analisar");
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const [mine, pending, current, band] = await authed((token) =>
    Promise.all([
      canRequest ? absencesService.mine(token) : Promise.resolve([]),
      isManager
        ? absencesService.list(token, { statuses: ["PENDENTE"] })
        : Promise.resolve([]),
      isManager
        ? absencesService.list(token, { statuses: ["APROVADA"], from: today })
        : Promise.resolve([]),
      isManager && can(user, "MEMBERS_READ")
        ? membersService.bandMembers(token)
        : Promise.resolve([]),
    ]),
  );
  const viewer = { id: user.id, isManager, today };
  const people: Record<string, AbsencePerson> = Object.fromEntries(
    band
      .filter((entry) => entry.profile)
      .map((entry) => [
        entry.userId,
        {
          name: entry.name,
          warName: entry.profile!.warName,
          rank: entry.profile!.rank,
          section: entry.profile!.section,
          phone: entry.profile!.phone,
          registration: entry.profile!.registration,
        },
      ]),
  );
  const members = band.map((entry) => ({
    userId: entry.userId,
    label: entry.profile
      ? `${RANK_LABELS[entry.profile.rank].label} - ${entry.profile.warName}`
      : entry.name,
  }));

  // Oldest request first (to review); closest return first (approved).
  const lists: Record<Tab, typeof mine> = {
    analisar: [...pending].reverse(),
    aprovadas: [...current].reverse(),
    minhas: mine,
  };
  const rows = lists[tab];
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = rows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/indisponibilidades", {
      aba: tab === "analisar" || !isManager ? undefined : tab,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });
  const tabHref = (target: Tab) =>
    hrefWith({
      aba: target === "analisar" ? undefined : target,
      page: undefined,
    });

  return (
    <>
      <PageHeader
        title="Indisponibilidades"
        description="Férias, licenças, dispensas e missões. Aprovadas, impedem a escala no período."
        actions={
          // Phones: the buttons share one row; larger screens: at the right.
          <div className="grid w-full auto-cols-fr grid-flow-col gap-2 sm:flex sm:w-auto sm:justify-end [&>button]:justify-center">
            {isManager && members.length > 0 && (
              <NewAbsenceButton
                members={members}
                label="Lançar para integrante"
                variant="secondary"
              />
            )}
            {canRequest && <NewAbsenceButton label="Pedir indisponibilidade" />}
          </div>
        }
      />

      {isManager && (
        <div className="mb-4">
          <SegmentedNav
            label="Indisponibilidades"
            items={[
              {
                label: "Para analisar",
                href: tabHref("analisar"),
                active: tab === "analisar",
                count: pending.length,
              },
              {
                label: "Aprovadas",
                href: tabHref("aprovadas"),
                active: tab === "aprovadas",
                count: current.length,
              },
              ...(canRequest
                ? [
                    {
                      label: "Minhas",
                      href: tabHref("minhas"),
                      active: tab === "minhas",
                      count: mine.length,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      )}

      <Card>
        {visible.length === 0 ? (
          <EmptyState
            icon={<CalendarOff className="size-5" />}
            title={EMPTY[tab]}
            description={
              tab === "analisar"
                ? "Quem pede recebe a resposta no app e por e-mail."
                : tab === "minhas"
                  ? "Peça em “Pedir indisponibilidade”; um gestor analisa."
                  : undefined
            }
          />
        ) : (
          <AbsencesTable
            absences={visible}
            viewer={viewer}
            people={tab === "minhas" ? undefined : people}
          />
        )}
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          total={rows.length}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
