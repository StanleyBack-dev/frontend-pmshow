import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { VenuesManager } from "@/features/events/components/VenuesManager";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { eventsService } from "@/server/services/events.service";
import { can } from "@/shared/lib/access";

export const metadata: Metadata = { title: "Locais" };

export default async function VenuesPage() {
  const user = await getSessionUser();
  if (!can(user, "EVENTS_MANAGE")) return <AccessDenied />;
  const venues = await authed((token) => eventsService.venues(token, true));

  return (
    <>
      <Link
        href="/agenda"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Agenda
      </Link>
      <PageHeader
        title="Locais"
        description="Lugares onde a banda se apresenta, reaproveitados nos eventos."
      />
      <Card>
        <CardBody>
          <VenuesManager venues={venues} />
        </CardBody>
      </Card>
    </>
  );
}
