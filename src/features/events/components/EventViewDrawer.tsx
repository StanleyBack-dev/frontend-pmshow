"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Flag,
  ListMusic,
  MapPin,
} from "lucide-react";
import {
  Badge,
  Button,
  Drawer,
  FormSection,
  Spinner,
  buttonClasses,
} from "@/design-system";
import { useEventSongList } from "@/features/events/components/SongListEditor";
import {
  EVENT_STATUS,
  EVENT_TYPE_LABELS,
  UNIFORM_LABELS,
} from "@/features/events/model/event-labels";
import type { BandEvent } from "@/shared/contracts/events";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

// The event's data, read only: for who can see events but not change them.
export function EventViewDrawer({
  event,
  onClose,
  actions,
}: {
  event: BandEvent;
  onClose: () => void;
  /** Extra footer buttons (e.g. status changes for who manages). */
  actions?: ReactNode;
}) {
  const songList = useEventSongList(event.id);
  const venue = event.venue;

  return (
    <Drawer
      open
      width="lg"
      onClose={onClose}
      title={event.title}
      subtitle={
        event.status === "CANCELADO"
          ? "Evento cancelado: as informações ficam bloqueadas até reabrir."
          : event.status === "REALIZADO"
            ? "Evento realizado: não pode mais ser alterado."
            : "Somente visualização."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          {actions}
          <Link href={`/eventos/${event.id}`} className={buttonClasses()}>
            Abrir página do evento
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <FormSection icon={<Flag />} title="O evento">
          <Items
            items={[
              ["Título", event.title],
              ["Tipo", EVENT_TYPE_LABELS[event.type]],
              [
                "Situação",
                <Badge key="status" tone={EVENT_STATUS[event.status].tone}>
                  {EVENT_STATUS[event.status].label}
                </Badge>,
              ],
              ...(event.cancellationReason
                ? [
                    ["Motivo do cancelamento", event.cancellationReason] as [
                      string,
                      ReactNode,
                    ],
                  ]
                : []),
            ]}
          />
        </FormSection>

        <FormSection icon={<CalendarDays />} title="Data e horários">
          <Items
            items={[
              [
                "Data",
                <span key="day" className="first-letter:uppercase">
                  {formatLongDay(event.startsAt)}
                </span>,
              ],
              ["Concentração", event.callTime && formatTime(event.callTime)],
              ["Início", formatTime(event.startsAt)],
              ["Término", event.endsAt && formatTime(event.endsAt)],
            ]}
          />
        </FormSection>

        <FormSection icon={<MapPin />} title="Local">
          <Items
            items={[
              ["Onde", venue?.name ?? "A definir"],
              ["Endereço", venue?.fullAddress],
              [
                "Mapa",
                venue?.mapsUrl && (
                  <a
                    key="maps"
                    href={venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    Abrir no mapa <ExternalLink className="size-3.5" />
                  </a>
                ),
              ],
              ["Observações do local", venue?.notes],
            ]}
          />
        </FormSection>

        <FormSection icon={<ListMusic />} title="Lista de músicas">
          {songList.rows ? (
            songList.rows.length > 0 ? (
              <ol className="divide-y divide-border rounded-md border border-border">
                {songList.rows.map((row, index) => (
                  <li
                    key={`${row.songId}-${index}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm"
                  >
                    <span className="w-5 shrink-0 text-right text-xs text-soft tabular-nums">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-fg">{row.title}</span>
                    {row.detail && (
                      <span className="shrink-0 text-xs text-soft">
                        {row.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-soft">
                Nenhuma música definida ainda.
              </p>
            )
          ) : (
            !songList.failed && (
              <div className="grid place-items-center py-4">
                <Spinner size="sm" />
              </div>
            )
          )}
        </FormSection>

        <FormSection icon={<FileText />} title="Detalhes do pedido">
          <Items
            items={[
              ["Uniforme", event.uniform && UNIFORM_LABELS[event.uniform]],
              ["Solicitante", event.requester],
              ["Nº do ofício / documento", event.documentRef],
              [
                "Observações",
                event.notes && (
                  <span key="notes" className="whitespace-pre-line">
                    {event.notes}
                  </span>
                ),
              ],
            ]}
          />
        </FormSection>
      </div>
    </Drawer>
  );
}

// Label over value, one per line; empty values show a dash.
function Items({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-border rounded-md border border-border">
      {items.map(([label, value]) => (
        <div key={label} className="px-3 py-2">
          <dt className="text-[11px] font-semibold tracking-[0.05em] text-soft uppercase">
            {label}
          </dt>
          <dd className="min-w-0 text-sm break-words text-fg">
            {value || "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
