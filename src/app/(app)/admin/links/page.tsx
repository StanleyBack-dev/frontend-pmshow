import type { Metadata } from "next";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { InvitesPanel } from "@/features/enrollment/components/InvitesPanel";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { enrollmentService } from "@/server/services/enrollment.service";
import { can } from "@/shared/lib/access";

export const metadata: Metadata = { title: "Links de cadastro" };

// The cohort codes (links sent by WhatsApp); the answers they bring in are
// reviewed in the "Cadastros" tab.
export default async function EnrollmentLinksPage() {
  const user = await getSessionUser();
  if (!can(user, "USERS_MANAGE")) return <AccessDenied />;

  const invites = await authed((token) => enrollmentService.invites(token));
  return <InvitesPanel invites={invites} />;
}
