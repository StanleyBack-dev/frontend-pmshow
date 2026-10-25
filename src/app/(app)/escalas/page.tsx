import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Badge, Card, EmptyState, PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { EVENT_STATUS } from "@/features/events/model/event-labels";
import { AckActions } from "@/features/rosters/components/AckActions";
import {
  ACK_STATUS,
  ROLE_LABELS,
} from "@/features/rosters/model/roster-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { rostersService } from "@/server/services/rosters.service";
import { can } from "@/shared/lib/access";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

export const metadata: Metadata = { title: "Minhas escalas" };

export default async function MyRostersPage() {
  const user = await getSessionUser();
  if (!can(user, "ROSTERS_READ_OWN")) return <AccessDenied />;
  const assignments = await authed((token) => rostersService.mine(token));

  return (
    <>
      <PageHeader
        title="Minhas escalas"
        description="Eventos em que você está escalado. Confirme a ciência de cada um."
      />
      {assignments.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClipboardList className="size-5" />}
            title="Nenhuma escala por enquanto"
            description="Quando um gestor publicar uma escala com você, ela aparece aqui e chega por e-mail."
          />
        </Card>
      ) : (
        <ul className="space-y-3">
          {assignments.map((item) => {
            const event = item.event;
            if (!event) return null;
            const ack = ACK_STATUS[item.ackStatus];
            const open =
              event.status === "PLANEJADO" || event.status === "CONFIRMADO";
            return (
              <li key={item.eventId}>
                <Card className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/eventos/${event.id}`}
                        className="font-semibold text-fg hover:text-accent"
                      >
                        {event.title}
                      </Link>
                      <p className="text-sm text-muted first-letter:uppercase">
                        {formatLongDay(event.startsAt)} ·{" "}
                        {event.callTime
                          ? `concentração ${formatTime(event.callTime)}, início ${formatTime(event.startsAt)}`
                          : formatTime(event.startsAt)}
                      </p>
                      <p className="text-sm text-muted">
                        {[
                          ROLE_LABELS[item.role],
                          item.instrumentName,
                          event.venue?.name,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {open ? (
                      <Badge tone={ack.tone}>{ack.label}</Badge>
                    ) : (
                      <Badge tone={EVENT_STATUS[event.status].tone}>
                        {EVENT_STATUS[event.status].label}
                      </Badge>
                    )}
                  </div>
                  {open && (
                    <AckActions eventId={event.id} status={item.ackStatus} />
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
