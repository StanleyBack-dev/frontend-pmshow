import { redirect } from "next/navigation";
import { ADMIN_SECTIONS } from "@/features/admin/model/admin-sections";
import { getSessionUser } from "@/server/auth/current-user";
import { can } from "@/shared/lib/access";

// The first area the user can open.
export default async function AdminIndexPage() {
  const user = await getSessionUser();
  const first = ADMIN_SECTIONS.find((section) => can(user, section.permission));
  redirect(first?.href ?? "/inicio");
}
