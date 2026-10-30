"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Badge,
  DataTable,
  LinkPendingSwap,
  type DataTableColumn,
} from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { LyricsButton } from "@/features/repertoire/components/LyricsViewer";
import { EditSongIconButton } from "@/features/repertoire/components/SongButtons";
import { SongPlayButton } from "@/features/repertoire/components/SongPlayButton";
import {
  CATEGORY_LABELS,
  formatDuration,
  STAGE_LABELS,
} from "@/features/repertoire/model/repertoire-labels";
import type { Artist, SongListItem } from "@/shared/contracts/repertoire";

// The repertoire list (amoremio table): edit, lyrics (full screen) and play
// are explicit buttons at the start of the row; the title opens the song page
// (audio, video, lyrics), and so does the "Abrir" button next to it. On
// phones the chevron shows the remaining columns.
export function SongsTable({
  songs,
  artists,
  canEdit,
}: {
  songs: SongListItem[];
  artists: Artist[];
  canEdit: boolean;
  /** Shows the audit column (desktop) / section (phones). */
}) {
  const audit = auditColumn((song: SongListItem) => ({
    entity: "song" as const,
    id: song.id,
    label: song.title,
    createdAt: song.createdAt,
  }));
  const columns: DataTableColumn<SongListItem>[] = [
    ...(canEdit
      ? [
          {
            key: "edit",
            label: "",
            className: "w-12 pr-0",
            mobile: "control" as const,
            render: (song: SongListItem) => (
              <EditSongIconButton song={song} artists={artists} />
            ),
          },
        ]
      : []),
    {
      key: "lyrics",
      label: "",
      className: "w-10 px-0",
      mobile: "control",
      render: (song) => (
        <LyricsButton title={song.title} lyrics={song.lyrics} />
      ),
    },
    {
      key: "play",
      label: "",
      className: "w-12 pr-0",
      mobile: "control",
      render: (song) => <SongPlayButton song={song} />,
    },
    {
      key: "title",
      label: "Música",
      mobile: "title",
      render: (song) => (
        <Link
          href={`/repertorio/${song.id}`}
          className="font-medium text-fg hover:text-accent hover:underline"
        >
          {song.title}
        </Link>
      ),
    },
    {
      // The song page (audios, videos, lyrics) behind a visible button, not
      // only the title.
      key: "open",
      label: "",
      className: "w-24 px-0",
      mobile: "control",
      render: (song) => (
        <Link
          href={`/repertorio/${song.id}`}
          aria-label={`Abrir ${song.title}: áudios, vídeos e letra`}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-accent-border bg-accent-soft pr-1.5 pl-2.5 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-fg"
        >
          Abrir
          <LinkPendingSwap>
            <ChevronRight aria-hidden className="size-3.5" />
          </LinkPendingSwap>
        </Link>
      ),
    },
    {
      key: "artist",
      label: "Cantor / banda",
      mobile: "subtitle",
      render: (song) => song.artist?.name ?? "—",
    },
    // Phones: the card header cuts long names, so the details repeat them
    // whole, each on its own line.
    {
      key: "title-detail",
      label: "Música",
      mobile: "detail",
      desktop: "hidden",
      render: (song) => song.title,
    },
    {
      key: "artist-detail",
      label: "Cantor / banda",
      mobile: "detail",
      desktop: "hidden",
      render: (song) => song.artist?.name ?? "—",
    },
    {
      key: "category",
      label: "Categoria",
      render: (song) => (
        <Badge tone="neutral">{CATEGORY_LABELS[song.category]}</Badge>
      ),
    },
    {
      key: "stage",
      label: "Situação",
      render: (song) => (
        <Badge tone={STAGE_LABELS[song.stage].tone}>
          {STAGE_LABELS[song.stage].short}
        </Badge>
      ),
    },
    {
      key: "key",
      label: "Tom",
      className: "w-16",
      render: (song) => song.musicalKey ?? "—",
    },
    {
      key: "duration",
      label: "Duração",
      className: "w-20 text-right tabular-nums",
      render: (song) => formatDuration(song.durationSeconds),
    },
  ];

  return (
    <DataTable
      rows={songs}
      columns={[...columns, audit.column]}
      getId={(song) => song.id}
      renderExpanded={audit.renderExpanded}
    />
  );
}
