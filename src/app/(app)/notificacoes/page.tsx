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

export const metadata: Metadata = { title: "Notificações" };

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; pagina?: string }>;
}) {
  const { filtro, pagina } = await searchParams;
  const unreadOnly = filtro === "nao-lidas";
  const page = Math.max(1, Number(pagina) || 1);
  const [result, now] = await Promise.all([
    authed((token) => notificationsService.list(token, unreadOnly, page)),
    requestTime(),
  ]);

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
          <div className="mt-4">
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              hrefFor={(target) =>
                `/notificacoes?${new URLSearchParams({
                  ...(unreadOnly ? { filtro: "nao-lidas" } : {}),
                  pagina: String(target),
                })}`
              }
            />
          </div>
        </>
      )}
    </>
  );
}
