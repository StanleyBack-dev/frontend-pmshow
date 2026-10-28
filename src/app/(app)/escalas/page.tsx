import type { Metadata } from "next";
import { ClipboardList, Repeat } from "lucide-react";
import {
  Card,
  EmptyState,
  PageHeader,
  Pagination,
  SegmentedNav,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { MyRostersTable } from "@/features/rosters/components/MyRostersTable";
import { SwapRequestsTable } from "@/features/rosters/components/SwapRequestsTable";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { rostersService } from "@/server/services/rosters.service";
import { can } from "@/shared/lib/access";
import {
  PAGE_SIZES,
  buildHref,
  firstParam,
  pageParam,
  pageSizeParam,
  pageSizeQuery,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Escalas" };

type Tab = "cientes" | "pendentes" | "trocas";

// The events I am on, by answer (working days live in "Expedientes"); for
// managers, also the open swap requests to solve.
export default async function RostersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  const canOwn = can(user, "ROSTERS_READ_OWN");
  const canSwaps = can(user, "ROSTERS_MANAGE");
  if (!canOwn && !canSwaps) return <AccessDenied />;

  const params = await searchParams;
  // "Cientes" by default; "?aba=pendentes" still to answer; "?aba=trocas"
  // the swap requests (managers).
  const asked = firstParam(params, "aba");
  const tab: Tab =
    asked === "trocas" && canSwaps
      ? "trocas"
      : !canOwn
        ? "trocas"
        : asked === "pendentes"
          ? "pendentes"
          : "cientes";
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const [mine, swaps, swapCount] = await authed((token) =>
    Promise.all([
      canOwn
        ? rostersService.minePage(token, {
            tab: tab === "pendentes" ? "PENDING" : "ACKNOWLEDGED",
            // The swap tab only needs the counts.
            page: tab === "trocas" ? 1 : page,
            limit: tab === "trocas" ? 1 : pageSize,
          })
        : Promise.resolve(null),
      tab === "trocas"
        ? rostersService.swapRequests(token, { page, limit: pageSize })
        : Promise.resolve(null),
      // The tab's badge when another tab is open.
      canSwaps && tab !== "trocas"
        ? rostersService
            .swapRequests(token, { page: 1, limit: 1 })
            .then((result) => result.total)
        : Promise.resolve(null),
    ]),
  );
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/escalas", {
      aba: tab === "cientes" ? undefined : tab,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  const items = [
    ...(canOwn && mine
      ? [
          {
            label: "Cientes",
            href: hrefWith({ aba: undefined, page: undefined }),
            active: tab === "cientes",
            count: mine.counts.acknowledged,
          },
          {
            label: "Não cientes",
            href: hrefWith({ aba: "pendentes", page: undefined }),
            active: tab === "pendentes",
            count: mine.counts.pending,
          },
        ]
      : []),
    ...(canSwaps
      ? [
          {
            label: "Pedidos de troca",
            href: hrefWith({ aba: "trocas", page: undefined }),
            active: tab === "trocas",
            count: swaps?.total ?? swapCount ?? 0,
          },
        ]
      : []),
  ];
  const list = tab === "trocas" ? swaps : (mine?.page ?? null);

  return (
    <>
      <PageHeader
        title="Escalas"
        description={
          tab === "trocas"
            ? "Quem pediu para ser trocado: substitua ou mantenha na escala."
            : "Eventos em que você está escalado. Confirme a ciência de cada um."
        }
      />

      {items.length > 1 && (
        <div className="mb-4">
          <SegmentedNav label="Escalas" items={items} />
        </div>
      )}

      <Card>
        {tab === "trocas" ? (
          swaps && swaps.items.length > 0 ? (
            <SwapRequestsTable
              requests={swaps.items}
              canPublish={can(user, "ROSTERS_PUBLISH")}
            />
          ) : (
            <EmptyState
              icon={<Repeat className="size-5" />}
              title="Nenhum pedido de troca em aberto"
              description="Quando alguém de uma escala publicada pedir troca, o pedido aparece aqui e os gestores são avisados."
            />
          )
        ) : mine && mine.page.items.length > 0 ? (
          <MyRostersTable assignments={mine.page.items} />
        ) : (
          <EmptyState
            icon={<ClipboardList className="size-5" />}
            title={
              tab === "pendentes"
                ? "Nenhuma escala aguardando sua ciência"
                : "Nenhuma escala com ciência confirmada"
            }
            description="Quando um gestor publicar uma escala com você, ela aparece aqui e chega por e-mail."
          />
        )}
        {list && (
          <Pagination
            page={list.page}
            totalPages={list.totalPages}
            total={list.total}
            pageSize={pageSize}
            hrefFor={(target) => hrefWith({ page: target })}
            pageSizes={PAGE_SIZES}
            pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
          />
        )}
      </Card>
    </>
  );
}
