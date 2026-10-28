import type { Metadata } from "next";
import { Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { CalendarFeedPanel } from "@/features/settings/components/CalendarFeedPanel";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { calendarService } from "@/server/services/calendar.service";
import { can } from "@/shared/lib/access";

export const metadata: Metadata = { title: "Agenda no celular" };

export default async function CalendarSettingsPage() {
  const user = await getSessionUser();
  if (!can(user, "ROSTERS_READ_OWN")) return <AccessDenied />;
  const links = await authed((token) => calendarService.mine(token));

  return (
    <>
      <PageHeader
        title="Agenda no celular"
        description="Suas escalas e expedientes direto no Google Agenda ou no calendário do iPhone, sempre atualizados."
      />
      <Card className="max-w-2xl">
        <CardHeader title="Seu link de agenda" />
        <CardBody>
          <CalendarFeedPanel initial={links} />
        </CardBody>
      </Card>
    </>
  );
}
