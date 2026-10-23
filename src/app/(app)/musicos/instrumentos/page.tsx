import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { InstrumentsManager } from "@/features/members/components/InstrumentsManager";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { membersService } from "@/server/services/members.service";
import { can } from "@/shared/lib/access";

export const metadata: Metadata = { title: "Instrumentos" };

export default async function InstrumentsPage() {
  const user = await getSessionUser();
  if (!can(user, "MEMBERS_MANAGE")) return <AccessDenied />;
  const instruments = await authed((token) =>
    membersService.instruments(token, true),
  );

  return (
    <>
      <Link
        href="/musicos"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Músicos
      </Link>
      <PageHeader
        title="Instrumentos e funções"
        description="Lista usada no cadastro dos integrantes e, depois, nas escalas."
      />
      <Card>
        <CardBody>
          <InstrumentsManager instruments={instruments} />
        </CardBody>
      </Card>
    </>
  );
}
