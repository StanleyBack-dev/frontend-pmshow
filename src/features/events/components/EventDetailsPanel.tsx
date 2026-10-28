"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CalendarDays, ClipboardList, FileText, MapPin } from "lucide-react";
import { Button, Spinner } from "@/design-system";
import { UNIFORM_LABELS } from "@/features/events/model/event-labels";
import { rostersClient } from "@/features/rosters/api/rosters.client";
import { RosterList } from "@/features/rosters/components/RosterList";
import { RosterPdfActions } from "@/features/rosters/components/RosterPdfActions";
import type { BandEvent } from "@/shared/contracts/events";
import type { Roster } from "@/shared/contracts/rosters";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

// Everything about an event at a glance, in the row the chevron opens on
// larger screens (no need to open the drawer): times, venue and the
// request details, side by side; below, who is on the roster.
export function EventDetailsPanel({
  event,
  rosterViewer,
  actions,
}: {
  event: BandEvent;
  /** Who is looking (omitted: no roster section). */
  rosterViewer?: RosterViewer;
  /** The last line (PDF of the songs, map). */
  actions?: ReactNode;
}) {
  const venue = event.venue;

  return (
    <div className="mt-2 grid gap-3 lg:grid-cols-3">
      <Section icon={<CalendarDays />} title="Data e horários">
        <Item label="Data">
          <span className="first-letter:uppercase">
            {formatLongDay(event.startsAt)}
          </span>
        </Item>
        <Item label="Concentração">
          {event.callTime && formatTime(event.callTime)}
        </Item>
        <Item label="Início">{formatTime(event.startsAt)}</Item>
        <Item label="Término">{event.endsAt && formatTime(event.endsAt)}</Item>
      </Section>

      <Section icon={<MapPin />} title="Local">
        <Item label="Onde">{venue?.name ?? "A definir"}</Item>
        <Item label="Endereço">{venue?.fullAddress}</Item>
        <Item label="Observações do local">
          {venue?.notes && (
            <span className="whitespace-pre-line">{venue.notes}</span>
          )}
        </Item>
      </Section>

      <Section icon={<FileText />} title="Detalhes do pedido">
        <Item label="Uniforme">
          {event.uniform && UNIFORM_LABELS[event.uniform]}
        </Item>
        <Item label="Solicitante">{event.requester}</Item>
        <Item label="Nº do ofício / documento">{event.documentRef}</Item>
        <Item label="Observações">
          {event.notes && (
            <span className="whitespace-pre-line">{event.notes}</span>
          )}
        </Item>
        {event.cancellationReason && (
          <Item label="Motivo do cancelamento">
            <span className="text-danger">{event.cancellationReason}</span>
          </Item>
        )}
      </Section>

      {actions && <div className="empty:hidden lg:col-span-3">{actions}</div>}

      {rosterViewer && (
        <div className="lg:col-span-3">
          <Section icon={<ClipboardList />} title="Escalados">
            <div className="p-3">
              <RosterSection
                eventId={event.id}
                eventTitle={event.title}
                viewer={rosterViewer}
              />
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

export type RosterViewer = { id: string; showManagerInfo: boolean };

// Loaded when shown (the list of events doesn't bring rosters): the
// details panel and the "Escalados" dialog.
/** " (falta: X)" when the API says which permission was missing. */
function missingOf(details: unknown): string {
  const missing =
    details && typeof details === "object" && "missing" in details
      ? (details as { missing: unknown }).missing
      : null;
  return Array.isArray(missing) && missing.length > 0
    ? ` (falta: ${missing.join(", ")})`
    : "";
}

export function RosterSection({
  eventId,
  eventTitle,
  viewer,
}: {
  eventId: string;
  eventTitle: string;
  viewer: RosterViewer;
}) {
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "failed"; message: string }
    | { kind: "done"; roster: Roster | null }
  >({ kind: "loading" });
  // Bumped by "Tentar de novo" to load again.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    rostersClient.view(eventId).then(
      (roster) => {
        if (active) setState({ kind: "done", roster });
      },
      (cause: unknown) => {
        if (!active) return;
        // The API's reason, so a failure says what happened.
        setState({
          kind: "failed",
          message:
            cause instanceof ApiClientError
              ? `${cause.message}${missingOf(cause.details)}`
              : "Não foi possível carregar a escala.",
        });
      },
    );
    return () => {
      active = false;
    };
  }, [eventId, attempt]);

  if (state.kind === "loading") {
    return (
      <p className="flex items-center gap-2 text-[13px] text-soft">
        <Spinner size="sm" /> Carregando a escala…
      </p>
    );
  }
  if (state.kind === "failed") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[13px] text-danger">
          Não foi possível carregar a escala: {state.message}
        </p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState({ kind: "loading" });
            setAttempt((value) => value + 1);
          }}
        >
          Tentar de novo
        </Button>
      </div>
    );
  }
  if (!state.roster || state.roster.assignments.length === 0) {
    return <p className="text-[13px] text-soft">Ninguém escalado ainda.</p>;
  }
  return (
    <div className="space-y-2">
      {/* Same as the event page: share on WhatsApp or download the PDF. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className={
            state.roster.status === "RASCUNHO"
              ? "text-[13px] text-warning"
              : "text-[13px] text-soft"
          }
        >
          {state.roster.status === "RASCUNHO"
            ? "Rascunho: a escala ainda não foi publicada."
            : "Escala publicada."}
        </p>
        <span className="flex flex-wrap gap-2">
          <RosterPdfActions eventId={eventId} eventTitle={eventTitle} />
        </span>
      </div>
      <RosterList
        roster={state.roster}
        viewerId={viewer.id}
        showManagerInfo={viewer.showManagerInfo}
      />
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <h3 className="flex items-center gap-2 border-b border-border bg-surface-muted px-3 py-2 text-[12px] font-semibold text-fg [&>svg]:size-3.5 [&>svg]:text-accent">
        {icon}
        {title}
      </h3>
      <dl className="divide-y divide-border">{children}</dl>
    </section>
  );
}

// Label over value; empty values show a dash.
function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="px-3 py-2">
      <dt className="text-[10px] font-medium tracking-wide text-soft uppercase">
        {label}
      </dt>
      <dd className="min-w-0 text-[13px] break-words text-fg">
        {children || "—"}
      </dd>
    </div>
  );
}
