import { PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { AdminNav } from "@/features/admin/components/AdminNav";
import { ADMIN_SECTIONS } from "@/features/admin/model/admin-sections";
import { getSessionUser } from "@/server/auth/current-user";
import { ADMIN_AREA_PERMISSIONS, can, canAny } from "@/shared/lib/access";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!canAny(user, ...ADMIN_AREA_PERMISSIONS)) return <AccessDenied />;
  const allowed = ADMIN_SECTIONS.filter((section) =>
    can(user, section.permission),
  ).map((section) => section.href);

  return (
    <>
      <PageHeader
        title="Administração"
        description="Acessos da banda, cadastros pelo link e a saúde do sistema."
      />
      <AdminNav allowed={allowed} />
      {children}
    </>
  );
}
