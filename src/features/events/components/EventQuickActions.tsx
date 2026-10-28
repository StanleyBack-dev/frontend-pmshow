"use client";

import { useState } from "react";
import {
  ClipboardList,
  FileDown,
  Headphones,
  ListMusic,
  MapPin,
} from "lucide-react";
import { Button, Spinner, buttonClasses } from "@/design-system";
import { eventsClient } from "@/features/events/api/events.client";
import type { RosterViewer } from "@/features/events/components/EventDetailsPanel";
import {
  RosterViewModal,
  SongListViewModal,
} from "@/features/events/components/EventViewModals";
import { venueMapUrl } from "@/features/events/model/venue-map";
import { usePlaySongs } from "@/features/playlists/components/usePlaySongs";
import type { EventListItem } from "@/shared/contracts/events";
import { useToast } from "@/shared/toast/useToast";

const fileNameOf = (response: Response) =>
  /filename="([^"]+)"/.exec(
    response.headers.get("Content-Disposition") ?? "",
  )?.[1] ?? "musicas.pdf";

// The last line of an event's details, as the project's main (PM green)
// buttons: the list of songs as a PDF, the venue on the map, the list of
// songs and who is on the roster (dialogs). Phones: two per row, sharing the
// width (an odd last one spans).
export function EventQuickActions({
  event,
  fill = false,
  onEditSongs,
  rosterViewer,
}: {
  event: EventListItem;
  fill?: boolean;
  /**
   * Who manages the open event edits the list (the table's songs dialog);
   * everyone else sees it read-only.
   */
  onEditSongs?: () => void;
  /**
   * Who is looking, when they may see rosters: the "Escalados" button
   * (phones only; larger screens have the section in the panel).
   */
  rosterViewer?: RosterViewer;
}) {
  const { showError } = useToast();
  const [pending, setPending] = useState(false);
  const rehearsal = usePlaySongs();
  const [dialog, setDialog] = useState<"songs" | "roster" | null>(null);
  const mapUrl = event.venue ? venueMapUrl(event.venue) : null;
  const hasSongs = event.setlistCount > 0;
  // Managers can start an empty list; others only see one that exists.
  const showList = hasSongs || onEditSongs !== undefined;
  if (!hasSongs && !mapUrl && !showList && !rosterViewer) return null;

  // Fetched here (not a plain link) so the button can show it is working.
  async function downloadSongs() {
    setPending(true);
    try {
      const response = await fetch(`/api/events/${event.id}/setlist/pdf`);
      if (!response.ok) throw new Error(String(response.status));
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = fileNameOf(response);
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      showError("Não foi possível gerar o PDF da lista de músicas.");
    }
    setPending(false);
  }

  return (
    <>
      <div
        className={
          fill
            ? "grid grid-cols-2 gap-2 [&>*]:justify-center [&>*:last-child:nth-child(odd)]:col-span-2"
            : "flex flex-wrap gap-2"
        }
      >
        {hasSongs && (
          <Button
            size="sm"
            icon={<FileDown className="size-4" />}
            loading={pending}
            onClick={() => void downloadSongs()}
          >
            Músicas PDF
          </Button>
        )}
        {hasSongs && (
          // Rehearsal mode: the event's songs, in order, in the player.
          <Button
            size="sm"
            icon={
              rehearsal.pending ? (
                <Spinner size="sm" label="Carregando" />
              ) : (
                <Headphones className="size-4" />
              )
            }
            disabled={rehearsal.pending !== null}
            onClick={() =>
              void rehearsal.play(event.id, async () =>
                (await eventsClient.setlist(event.id)).map(
                  (entry) => entry.song,
                ),
              )
            }
          >
            Ensaiar
          </Button>
        )}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("primary", "sm")}
          >
            <MapPin aria-hidden className="size-4" />
            Abrir no mapa
          </a>
        )}
        {showList && (
          <Button
            size="sm"
            icon={<ListMusic className="size-4" />}
            onClick={onEditSongs ?? (() => setDialog("songs"))}
          >
            Lista de músicas
          </Button>
        )}
        {rosterViewer && (
          <Button
            size="sm"
            icon={<ClipboardList className="size-4" />}
            onClick={() => setDialog("roster")}
          >
            Escalados
          </Button>
        )}
      </div>
      {/* Outside the grid: a dialog would count as one more cell. */}
      {dialog === "songs" && (
        <SongListViewModal
          eventId={event.id}
          eventTitle={event.title}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "roster" && rosterViewer && (
        <RosterViewModal
          eventId={event.id}
          eventTitle={event.title}
          viewer={rosterViewer}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}
