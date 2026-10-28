import type { Metadata } from "next";
import { Badge, Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { RecordAuditButton } from "@/features/audit/components/RecordAudit";
import { BroadcastForm } from "@/features/broadcasts/components/BroadcastForm";
import { AUDIENCE_LABELS } from "@/features/broadcasts/model/broadcast-labels";
import { SECTION_LABELS } from "@/features/members/model/member-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { broadcastsService } from "@/server/services/broadcasts.service";
import { eventsService } from "@/server/services/events.service";
import { can } from "@/shared/lib/access";
import { formatShortDay, formatTime } from "@/shared/lib/datetime";

export const metadata: Metadata = { title: "Comunicados" };

export default async function BroadcastsPage() {
  const user = await getSessionUser();
  if (!can(user, "NOTIFICATIONS_BROADCAST")) return <AccessDenied />;

  const [history, upcoming] = await authed((token) =>
    Promise.all([
      broadcastsService.list(token),
      can(user, "EVENTS_READ")
        ? eventsService.upcoming(token, 20)
        : Promise.resolve([]),
    ]),
  );
  const events = upcoming.map((event) => ({
    id: event.id,
    label: `${event.title} (${formatShortDay(event.startsAt)})`,
  }));
  const eventTitle = new Map(upcoming.map((event) => [event.id, event.title]));

  return (
    <>
      <PageHeader
        title="Comunicados"
        description="Avisos para a banda inteira, um naipe ou os escalados de um evento. Chegam no app, nos aparelhos com notificação e, se quiser, por e-mail."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader title="Novo comunicado" />
          <CardBody>
            <BroadcastForm events={events} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Enviados" description="Os 50 mais recentes." />
          <CardBody>
            {history.length === 0 ? (
              <p className="text-sm text-muted">
                Nenhum comunicado enviado ainda.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {history.map((item) => (
                  <li key={item.id} className="space-y-1 py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex-1 font-medium text-fg">
                        {item.title}
                      </span>
                      <Badge tone="accent">
                        {item.audience === "NAIPE" && item.section
                          ? SECTION_LABELS[item.section]
                          : item.audience === "ESCALA_EVENTO"
                            ? (eventTitle.get(item.eventId ?? "") ??
                              AUDIENCE_LABELS.ESCALA_EVENTO)
                            : AUDIENCE_LABELS[item.audience]}
                      </Badge>
                      <RecordAuditButton
                        entity="broadcast"
                        id={item.id}
                        label={item.title}
                        createdAt={item.createdAt}
                      />
                    </div>
                    <p className="line-clamp-3 whitespace-pre-line text-muted">
                      {item.body}
                    </p>
                    <p className="text-xs text-soft">
                      {formatShortDay(item.createdAt)},{" "}
                      {formatTime(item.createdAt)} · {item.recipients}{" "}
                      {item.recipients === 1 ? "pessoa" : "pessoas"}
                      {item.sendEmail ? " · com e-mail" : ""}
                      {item.authorName ? ` · ${item.authorName}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
