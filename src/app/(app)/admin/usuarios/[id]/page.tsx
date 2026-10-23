import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { EditUserForm } from "@/features/admin/components/EditUserForm";
import { PermissionsEditor } from "@/features/admin/components/PermissionsEditor";
import { UserAccountActions } from "@/features/admin/components/UserAccountActions";
import { UserStatusBadges } from "@/features/admin/components/UserStatusBadges";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { BackendError } from "@/server/http/backend-error";
import { adminService } from "@/server/services/admin.service";
import { assignableGroups, can } from "@/shared/lib/access";
import { formatDateTime } from "@/shared/lib/format";

export const metadata: Metadata = { title: "Usuário" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getSessionUser();
  if (!can(viewer, "USERS_MANAGE")) return <AccessDenied />;

  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const showPermissions = can(viewer, "PERMISSIONS_MANAGE");
  const [user, matrix] = await authed(async (token) => {
    try {
      return await Promise.all([
        adminService.getUser(token, id),
        showPermissions ? adminService.getPermissions(token, id) : null,
      ]);
    } catch (error) {
      if (error instanceof BackendError && error.code === "USER_NOT_FOUND") {
        notFound();
      }
      throw error;
    }
  });

  const isSelf = user.id === viewer.id;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/usuarios"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Usuários
      </Link>

      <Card>
        <CardHeader
          title={user.name}
          description={`${user.username} · ${GROUP_LABELS[user.group]}`}
          action={<UserStatusBadges user={user} />}
        />
        <CardBody>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-soft">Criado em</dt>
              <dd className="text-fg">{formatDateTime(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-soft">Último acesso</dt>
              <dd className="text-fg">
                {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Nunca"}
              </dd>
            </div>
            {user.deactivatedAt && (
              <div>
                <dt className="text-soft">Desativado em</dt>
                <dd className="text-fg">
                  {formatDateTime(user.deactivatedAt)}
                </dd>
              </div>
            )}
          </dl>
          {!isSelf && (
            <div className="mt-5 border-t border-border pt-5">
              <UserAccountActions user={user} />
            </div>
          )}
        </CardBody>
      </Card>

      {isSelf ? (
        <Card>
          <CardBody>
            <p className="text-sm text-muted">
              Este é o seu usuário. Para alterar seus dados ou sua senha, use{" "}
              <Link href="/perfil" className="text-accent underline">
                Meu perfil
              </Link>
              .
            </p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Dados de acesso" />
          <CardBody>
            <EditUserForm
              user={user}
              assignableGroups={assignableGroups(viewer.group)}
            />
          </CardBody>
        </Card>
      )}

      {matrix && (
        <Card>
          <CardHeader
            title="Permissões"
            description="Partem do padrão do grupo; marque ou desmarque para abrir uma exceção só para este usuário."
          />
          <CardBody>
            <PermissionsEditor
              userId={user.id}
              matrix={matrix}
              editable={!isSelf}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
