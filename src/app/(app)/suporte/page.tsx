import type { Metadata } from "next";
import { LifeBuoy } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PageHeader,
  Pagination,
  SegmentedNav,
} from "@/design-system";
import { SupportRequestForm } from "@/features/support/components/SupportRequestForm";
import { SupportRequestsTable } from "@/features/support/components/SupportRequestsTable";
import {
  SUPPORT_STATUS,
  SUPPORT_STATUSES,
} from "@/features/support/model/support-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { supportService } from "@/server/services/support.service";
import { can } from "@/shared/lib/access";
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

export const metadata: Metadata = { title: "Suporte" };

// Everyone asks for help here (up to three requests a day) and follows the
// answers; who manages support (ADMIN_MASTER) answers in "Todas".
export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  const canManage = can(user, "SUPPORT_MANAGE");
  const params = await searchParams;
  const all = canManage && firstParam(params, "aba") === "todas";
  const status = all
    ? (oneOf(firstParam(params, "situacao"), SUPPORT_STATUSES) ?? null)
    : null;
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const [mine, everyone] = await authed((token) =>
    Promise.all([
      supportService.mine(token, {
        page: all ? 1 : page,
        limit: all ? 1 : pageSize,
      }),
      all
        ? supportService.all(token, { status, page, limit: pageSize })
        : Promise.resolve(null),
    ]),
  );
  const list = everyone ?? mine.requests;
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/suporte", {
      aba: all ? "todas" : undefined,
      situacao: status ?? undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Suporte"
        description={
          all
            ? "Solicitações de todos: responda e finalize. Quem pediu é avisado no app e por e-mail."
            : "Precisa de ajuda com o app? Envie uma solicitação e acompanhe a resposta por aqui."
        }
      />

      {canManage && (
        <div className="mb-4 space-y-3">
          <SegmentedNav
            label="Suporte"
            items={[
              {
                label: "Minhas",
                href: buildHref("/suporte", {}),
                active: !all,
                count: mine.requests.total,
              },
              {
                label: "Todas",
                href: buildHref("/suporte", { aba: "todas" }),
                active: all,
              },
            ]}
          />
          {all && (
            <SegmentedNav
              label="Situação"
              items={[
                {
                  label: "Todas as situações",
                  href: hrefWith({ situacao: undefined, page: undefined }),
                  active: status === null,
                },
                ...SUPPORT_STATUSES.map((value) => ({
                  label: SUPPORT_STATUS[value].label,
                  href: hrefWith({ situacao: value, page: undefined }),
                  active: status === value,
                })),
              ]}
            />
          )}
        </div>
      )}

      <div className="space-y-6">
        {!all && (
          <Card>
            <CardHeader title="Falar com o suporte" />
            <CardBody>
              <SupportRequestForm quota={mine.quota} />
            </CardBody>
          </Card>
        )}

        <Card>
          {!all && <CardHeader title="Minhas solicitações" />}
          {list.items.length === 0 ? (
            <EmptyState
              icon={<LifeBuoy className="size-5" />}
              title={
                all
                  ? "Nenhuma solicitação por aqui"
                  : "Você ainda não enviou solicitações"
              }
              description={
                all
                  ? "Quando alguém pedir ajuda, a solicitação aparece aqui e você é avisado."
                  : "As suas solicitações e as respostas do suporte aparecem aqui."
              }
            />
          ) : (
            <SupportRequestsTable requests={list.items} manage={all} />
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
      </div>
    </>
  );
}
