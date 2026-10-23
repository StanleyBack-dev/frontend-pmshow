import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, ListMusic } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  buttonClasses,
} from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { EventList } from "@/features/events/components/EventList";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { eventsService } from "@/server/services/events.service";
import { can } from "@/shared/lib/access";

export const metadata: Metadata = { title: "Início" };

export default async function HomePage() {
  const user = await getSessionUser();
  const canSeeAgenda = can(user, "EVENTS_READ");
  const upcoming = canSeeAgenda
    ? await authed((token) => eventsService.upcoming(token, 5))
    : [];

  return (
    <>
      <PageHeader
        title={`Olá, ${user.name.split(" ")[0]}!`}
        description={`Você entrou como ${GROUP_LABELS[user.group]}.`}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {canSeeAgenda && (
          <Card>
            <CardHeader
              title="Próximos eventos"
              action={
                <Link href="/agenda" className={buttonClasses("ghost", "sm")}>
                  Ver agenda
                </Link>
              }
            />
            <CardBody>
              {upcoming.length > 0 ? (
                <EventList events={upcoming} />
              ) : (
                <p className="text-sm text-muted">
                  Nenhum evento planejado por enquanto.
                </p>
              )}
            </CardBody>
          </Card>
        )}
        <div className="space-y-4">
          {can(user, "REPERTOIRE_READ") && (
            <Link href="/repertorio" className="block">
              <Card className="p-5 transition-colors hover:bg-surface-muted">
                <ListMusic className="size-5 text-brand-gold" aria-hidden />
                <h2 className="mt-3 font-semibold text-fg">Repertório</h2>
                <p className="mt-1 text-sm text-muted">
                  Ouça os áudios e assista aos vídeos das músicas.
                </p>
              </Card>
            </Link>
          )}
          <Card className="p-5">
            <ClipboardList className="size-5 text-brand-gold" aria-hidden />
            <h2 className="mt-3 font-semibold text-fg">Escalas</h2>
            <p className="mt-1 text-sm text-muted">
              Quem está escalado em cada evento, com aviso por e-mail.
            </p>
            <p className="mt-3 text-xs font-medium text-soft">Em breve</p>
          </Card>
        </div>
      </div>
    </>
  );
}
