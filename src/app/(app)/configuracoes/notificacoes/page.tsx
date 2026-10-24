import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { NotificationPreferences } from "@/features/notifications/components/NotificationPreferences";
import { authed } from "@/server/auth/current-user";
import { notificationsService } from "@/server/services/notifications.service";

export const metadata: Metadata = { title: "Avisos por e-mail" };

export default async function EmailPreferencesPage() {
  const preferences = await authed((token) =>
    notificationsService.preferences(token),
  );

  return (
    <>
      <Link
        href="/configuracoes"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Configurações
      </Link>
      <PageHeader
        title="Avisos por e-mail"
        description="No app, todos os avisos aparecem no sino. Escolha quais também chegam por e-mail."
      />
      <Card>
        <CardHeader title="Receber por e-mail" />
        <CardBody>
          <NotificationPreferences initial={preferences} />
        </CardBody>
      </Card>
    </>
  );
}
