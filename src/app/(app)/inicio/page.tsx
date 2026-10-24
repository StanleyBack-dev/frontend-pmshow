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
import { ROLE_LABELS } from "@/features/rosters/model/roster-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { eventsService } from "@/server/services/events.service";
import { rostersService } from "@/server/services/rosters.service";
import { can } from "@/shared/lib/access";
import { formatShortDay, formatTime } from "@/shared/lib/datetime";

export const metadata: Metadata = { title: "Início" };

export default async function HomePage() {
  const user = await getSessionUser();
  const canSeeAgenda = can(user, "EVENTS_READ");
  const canSeeRosters = can(user, "ROSTERS_READ_OWN");
  const [upcoming, assignments] = await authed((token) =>
    Promise.all([
      canSeeAgenda ? eventsService.upcoming(token, 5) : Promise.resolve([]),
      canSeeRosters ? rostersService.mine(token) : Promise.resolve([]),
    ]),
  );
  // Waiting for the member's answer, on events still to happen.
  const pendingAck = assignments.filter(
    (item) =>
      item.ackStatus === "PENDENTE" &&
      (item.event?.status === "PLANEJADO" ||
        item.event?.status === "CONFIRMADO"),
  );

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
          {canSeeRosters && (
            <Card className="p-5">
              <ClipboardList className="size-5 text-brand-gold" aria-hidden />
              <h2 className="mt-3 font-semibold text-fg">Minhas escalas</h2>
              {pendingAck.length > 0 ? (
                <>
                  <p className="mt-1 text-sm text-muted">
                    Confirme a ciência{" "}
                    {pendingAck.length === 1
                      ? "desta escala"
                      : `destas ${pendingAck.length} escalas`}
                    :
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {pendingAck.slice(0, 4).map((item) => (
                      <li key={item.eventId}>
                        <Link
                          href={`/agenda/${item.eventId}`}
                          className="font-medium text-fg hover:text-accent"
                        >
                          {item.event?.title}
                        </Link>
                        {item.event && (
                          <span className="block text-xs text-soft">
                            {formatShortDay(item.event.startsAt)},{" "}
                            {formatTime(item.event.startsAt)} ·{" "}
                            {ROLE_LABELS[item.role]}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-1 text-sm text-muted">
                  {assignments.length > 0
                    ? "Tudo confirmado. Veja os próximos eventos em que você está."
                    : "Quando você for escalado, o aviso chega aqui e por e-mail."}
                </p>
              )}
              <Link
                href="/escalas"
                className={`mt-3 ${buttonClasses("ghost", "sm")}`}
              >
                Ver minhas escalas
              </Link>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
