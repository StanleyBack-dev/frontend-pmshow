"use client";

import { ClipboardList, ListMusic } from "lucide-react";
import { Button, Modal, Spinner } from "@/design-system";
import {
  RosterSection,
  type RosterViewer,
} from "@/features/events/components/EventDetailsPanel";
import { useEventSongList } from "@/features/events/components/SongListEditor";

// Read-only dialogs of the events table: what is in the list of songs and
// who is on the roster, without editing anything.

export function SongListViewModal({
  eventId,
  eventTitle,
  onClose,
}: {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}) {
  const { rows, failed } = useEventSongList(eventId);

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      icon={<ListMusic className="size-5" />}
      title={`Lista de músicas · ${eventTitle}`}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {rows ? (
        rows.length > 0 ? (
          <ol className="divide-y divide-border rounded-md border border-border">
            {rows.map((row, index) => (
              <li
                key={`${row.songId}-${index}`}
                className="flex items-center gap-3 px-3 py-2 text-sm"
              >
                <span className="w-5 shrink-0 text-right text-xs text-soft tabular-nums">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 break-words text-fg">
                  {row.title}
                </span>
                {row.detail && (
                  <span className="shrink-0 text-xs text-soft">
                    {row.detail}
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-soft">Nenhuma música definida ainda.</p>
        )
      ) : failed ? (
        <p className="text-sm text-danger">
          Não foi possível carregar a lista de músicas.
        </p>
      ) : (
        <p className="flex items-center gap-2 text-[13px] text-soft">
          <Spinner size="sm" /> Carregando a lista…
        </p>
      )}
    </Modal>
  );
}

export function RosterViewModal({
  eventId,
  eventTitle,
  viewer,
  onClose,
}: {
  eventId: string;
  eventTitle: string;
  viewer: RosterViewer;
  onClose: () => void;
}) {
  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      icon={<ClipboardList className="size-5" />}
      title={`Escalados · ${eventTitle}`}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      <RosterSection
        eventId={eventId}
        eventTitle={eventTitle}
        viewer={viewer}
      />
    </Modal>
  );
}
