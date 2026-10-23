import { redirect } from "next/navigation";
import { AppShell } from "@/features/layout/components/AppShell";
import { getSessionUser } from "@/server/auth/current-user";
import { ADMIN_AREA_PERMISSIONS, canAny } from "@/shared/lib/access";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (user.mustChangePassword) redirect("/primeiro-acesso");

  return (
    <AppShell user={user} showAdmin={canAny(user, ...ADMIN_AREA_PERMISSIONS)}>
      {children}
    </AppShell>
  );
}
