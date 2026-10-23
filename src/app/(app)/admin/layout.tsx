import { PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { AdminTabs } from "@/features/admin/components/AdminTabs";
import { getSessionUser } from "@/server/auth/current-user";
import { ADMIN_AREA_PERMISSIONS, can, canAny } from "@/shared/lib/access";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!canAny(user, ...ADMIN_AREA_PERMISSIONS)) return <AccessDenied />;

  return (
    <>
      <PageHeader
        title="Administração"
        description="Acesso dos integrantes, permissões e histórico de ações."
      />
      <div className="mb-6">
        <AdminTabs showAudit={can(user, "AUDIT_READ")} />
      </div>
      {children}
    </>
  );
}
