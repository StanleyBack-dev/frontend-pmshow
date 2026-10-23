import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText } from "lucide-react";
import { Card, EmptyState, Pagination } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { AUDIT_ACTION_LABELS } from "@/features/access/model/access-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { adminService } from "@/server/services/admin.service";
import { can } from "@/shared/lib/access";
import { formatDateTime } from "@/shared/lib/format";
import {
  buildHref,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Auditoria" };

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "AUDIT_READ")) return <AccessDenied />;

  const page = pageParam(await searchParams);
  const logs = await authed((token) => adminService.auditLogs(token, page));

  return (
    <Card>
      {logs.items.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="size-5" />}
          title="Nenhuma ação registrada"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-soft uppercase">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">Quando</th>
                <th className="px-4 py-3 font-medium">Quem</th>
                <th className="px-4 py-3 font-medium">Ação</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  IP
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.items.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-border align-top last:border-0"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-muted">
                    {formatDateTime(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-fg">
                    {entry.actorName ?? "Sistema"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-fg">
                      {AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
                    </span>
                    {entry.entity === "user" && entry.entityId && (
                      <Link
                        href={`/admin/usuarios/${entry.entityId}`}
                        className="ml-2 text-xs text-accent hover:underline"
                      >
                        ver usuário
                      </Link>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-soft md:table-cell">
                    {entry.ip ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {logs.totalPages > 1 && (
        <div className="border-t border-border p-4">
          <Pagination
            page={logs.page}
            totalPages={logs.totalPages}
            total={logs.total}
            hrefFor={(target) =>
              buildHref("/admin/auditoria", { page: target })
            }
          />
        </div>
      )}
    </Card>
  );
}
