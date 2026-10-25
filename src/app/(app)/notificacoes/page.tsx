import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  Card,
  EmptyState,
  PageHeader,
  Pagination,
  SegmentedNav,
} from "@/design-system";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { authed } from "@/server/auth/current-user";
import { requestTime } from "@/server/request-time";
import { notificationsService } from "@/server/services/notifications.service";
import {
  PAGE_SIZES,
  buildHref,
  pageSizeParam,
  pageSizeQuery,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Notificações" };

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const unreadOnly = params.filtro === "nao-lidas";
  const page = Math.max(1, Number(params.pagina) || 1);
  const pageSize = pageSizeParam(params);
  const [result, now] = await Promise.all([
    authed((token) =>
      notificationsService.list(token, unreadOnly, page, pageSize),
    ),
    requestTime(),
  ]);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/notificacoes", {
      filtro: unreadOnly ? "nao-lidas" : undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Notificações"
        description={
          <>
            Escalas, mudanças em eventos e respostas aos seus pedidos. Escolha o
            que chega por e-mail em{" "}
            <Link
              href="/configuracoes/notificacoes"
              className="text-accent hover:underline"
            >
              Configurações
            </Link>
            .
          </>
        }
      />
      <div className="mb-4">
        <SegmentedNav
          label="Filtrar notificações"
          items={[
            { href: "/notificacoes", label: "Todas", active: !unreadOnly },
            {
              href: "/notificacoes?filtro=nao-lidas",
              label: "Não lidas",
              active: unreadOnly,
            },
          ]}
        />
      </div>
      {result.items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell className="size-5" />}
            title={unreadOnly ? "Tudo lido" : "Nenhuma notificação ainda"}
            description="Quando você for escalado ou algo mudar num evento seu, o aviso aparece aqui."
          />
        </Card>
      ) : (
        <>
          <NotificationList
            notifications={result.items}
            now={now.toISOString()}
          />
          <Card className="mt-4">
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              pageSize={pageSize}
              hrefFor={(target) => hrefWith({ pagina: target })}
              pageSizes={PAGE_SIZES}
              pageSizeHref={(size) =>
                hrefWith({ "por-pagina": size, pagina: undefined })
              }
            />
          </Card>
        </>
      )}
    </>
  );
}
