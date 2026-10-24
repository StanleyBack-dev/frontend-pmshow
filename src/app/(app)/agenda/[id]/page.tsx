import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList, ExternalLink, FileDown } from "lucide-react";
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
  buttonClasses,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { EditEventButton } from "@/features/events/components/EventFormModal";
import { EventStatusActions } from "@/features/events/components/EventStatusActions";
import { Setlist } from "@/features/events/components/Setlist";
import {
  EVENT_STATUS,
  EVENT_TYPE_LABELS,
} from "@/features/events/model/event-labels";
import { AckActions } from "@/features/rosters/components/AckActions";
import { RosterList } from "@/features/rosters/components/RosterList";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { BackendError } from "@/server/http/backend-error";
import { eventsService } from "@/server/services/events.service";
import { rostersService } from "@/server/services/rosters.service";
import { can } from "@/shared/lib/access";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

export const metadata: Metadata = { title: "Evento" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!can(user, "EVENTS_READ")) return <AccessDenied />;
  const canManage = can(user, "EVENTS_MANAGE");
  const canSeeRoster = can(user, "ROSTERS_READ_OWN");
  const canBuildRoster = can(user, "ROSTERS_MANAGE");

  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [event, venues, roster] = await authed(async (token) => {
    try {
      return await Promise.all([
        eventsService.get(token, id),
        canManage ? eventsService.venues(token, true) : Promise.resolve([]),
        canSeeRoster ? rostersService.get(token, id) : Promise.resolve(null),
      ]);
    } catch (error) {
      if (error instanceof BackendError && error.code === "EVENT_NOT_FOUND") {
        notFound();
      }
      throw error;
    }
  });

  const editable = canManage && event.status !== "REALIZADO";
  const open = event.status === "PLANEJADO" || event.status === "CONFIRMADO";
  const myLine = roster?.assignments.find((line) => line.userId === user.id);
  const canAnswer = roster?.status === "PUBLICADA" && myLine && open;
  const status = EVENT_STATUS[event.status];
  const schedule: [string, string][] = [
    ["Data", formatLongDay(event.startsAt)],
    ...(event.callTime
      ? ([["Concentração", formatTime(event.callTime)]] as [string, string][])
      : []),
    [
      "Horário",
      event.endsAt
        ? `${formatTime(event.startsAt)} às ${formatTime(event.endsAt)}`
        : formatTime(event.startsAt),
    ],
  ];
  const details: [string, string | null][] = [
    ["Uniforme / traje", event.uniform],
    ["Solicitante", event.requester],
    ["Ofício / documento", event.documentRef],
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/agenda"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Agenda
      </Link>

      {event.status === "CANCELADO" && (
        <Alert tone="danger" title="Evento cancelado">
          {event.cancellationReason}
        </Alert>
      )}

      <Card>
        <CardHeader
          title={event.title}
          description={
            <span className="inline-flex flex-wrap items-center gap-1.5">
              <Badge tone="accent">{EVENT_TYPE_LABELS[event.type]}</Badge>
              <Badge tone={status.tone}>{status.label}</Badge>
            </span>
          }
          action={
            canManage ? (
              <span className="flex flex-wrap justify-end gap-2">
                {editable && <EditEventButton event={event} venues={venues} />}
                <EventStatusActions event={event} />
              </span>
            ) : undefined
          }
        />
        <CardBody className="space-y-5">
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            {schedule.map(([label, value]) => (
              <div key={label}>
                <dt className="text-soft">{label}</dt>
                <dd className="font-medium text-fg first-letter:uppercase">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="text-sm">
            <p className="text-soft">Local</p>
            {event.venue ? (
              <div className="text-fg">
                <p className="font-medium">{event.venue.name}</p>
                <p className="text-muted">
                  {[event.venue.address, event.venue.city]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {event.venue.mapsUrl && (
                  <a
                    href={event.venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    Abrir no mapa <ExternalLink className="size-3.5" />
                  </a>
                )}
                {event.venue.notes && (
                  <p className="mt-1 text-xs text-soft">{event.venue.notes}</p>
                )}
              </div>
            ) : (
              <p className="text-muted">A definir</p>
            )}
          </div>

          {details.some(([, value]) => value) && (
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              {details
                .filter((entry): entry is [string, string] => Boolean(entry[1]))
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-soft">{label}</dt>
                    <dd className="text-fg">{value}</dd>
                  </div>
                ))}
            </dl>
          )}

          {event.notes && (
            <p className="text-sm whitespace-pre-line text-muted">
              {event.notes}
            </p>
          )}
        </CardBody>
      </Card>

      {canSeeRoster && (roster || (canBuildRoster && open)) && (
        <Card>
          <CardHeader
            title="Escala"
            description={
              roster?.status === "RASCUNHO"
                ? "Rascunho: só gestores veem até a publicação."
                : roster
                  ? "Publicada. Os escalados foram avisados."
                  : "Ninguém escalado ainda."
            }
            action={
              roster || (canBuildRoster && open) ? (
                <span className="flex flex-wrap justify-end gap-2">
                  {roster && (
                    // A file download, not a page: plain anchor on purpose.
                    <a
                      href={`/api/events/${event.id}/roster/pdf`}
                      download
                      className={buttonClasses("ghost", "sm")}
                    >
                      <FileDown className="size-4" />
                      PDF
                    </a>
                  )}
                  {canBuildRoster && open && (
                    <Link
                      href={`/agenda/${event.id}/escala`}
                      className={buttonClasses("secondary", "sm")}
                    >
                      <ClipboardList className="size-4" />
                      {roster ? "Editar escala" : "Montar escala"}
                    </Link>
                  )}
                </span>
              ) : undefined
            }
          />
          {roster && (
            <CardBody className="space-y-4">
              {canAnswer && (
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-2 text-sm text-fg">
                    Você está nesta escala. Confirme que está ciente ou peça
                    troca.
                  </p>
                  <AckActions eventId={event.id} status={myLine.ackStatus} />
                </div>
              )}
              <RosterList
                roster={roster}
                viewerId={user.id}
                showManagerInfo={can(user, "ROSTERS_READ_ALL")}
              />
            </CardBody>
          )}
        </Card>
      )}

      <Card>
        <CardHeader title="Setlist" />
        <CardBody>
          <Setlist
            eventId={event.id}
            eventTitle={event.title}
            setlist={event.setlist}
            canEdit={editable}
          />
        </CardBody>
      </Card>
    </div>
  );
}
