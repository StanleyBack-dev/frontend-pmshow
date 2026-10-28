import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Alert, PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { RosterEditor } from "@/features/rosters/components/RosterEditor";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { BackendError } from "@/server/http/backend-error";
import { eventsService } from "@/server/services/events.service";
import { bandFunctionsService } from "@/server/services/band-functions.service";
import { rostersService } from "@/server/services/rosters.service";
import { can } from "@/shared/lib/access";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

export const metadata: Metadata = { title: "Montar escala" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function RosterEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!can(user, "ROSTERS_MANAGE", "EVENTS_READ")) return <AccessDenied />;

  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [event, roster, candidates, functions] = await authed(async (token) => {
    try {
      return await Promise.all([
        eventsService.get(token, id),
        rostersService.get(token, id),
        rostersService.candidates(token, id),
        bandFunctionsService.list(token, true),
      ]);
    } catch (error) {
      if (error instanceof BackendError && error.code === "EVENT_NOT_FOUND") {
        notFound();
      }
      throw error;
    }
  });

  const open = event.status === "PLANEJADO" || event.status === "CONFIRMADO";

  return (
    <div className="space-y-6">
      <Link
        href="/eventos"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Eventos
      </Link>
      <PageHeader
        title={roster ? "Editar escala" : "Montar escala"}
        description={`${event.title} · ${formatLongDay(event.startsAt)}, ${formatTime(event.startsAt)}`}
      />
      {open ? (
        <RosterEditor
          eventId={event.id}
          candidates={candidates}
          functions={functions}
          roster={roster}
          canPublish={can(user, "ROSTERS_PUBLISH")}
        />
      ) : (
        <Alert tone="warning" title="Escala fechada">
          Eventos cancelados ou realizados não têm a escala alterada.
        </Alert>
      )}
    </div>
  );
}
