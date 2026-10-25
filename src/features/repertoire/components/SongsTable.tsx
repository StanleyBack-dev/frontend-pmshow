"use client";

import Link from "next/link";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
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
// are explicit buttons at the start of the row; the title opens the song page (audio, video,
// lyrics). On phones the chevron shows the remaining columns.
export function SongsTable({
  songs,
  artists,
  canEdit,
  canAudit,
}: {
  songs: SongListItem[];
  artists: Artist[];
  canEdit: boolean;
  /** Shows the audit column (desktop) / section (phones). */
  canAudit: boolean;
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
      key: "artist",
      label: "Cantor / banda",
      mobile: "subtitle",
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
      columns={canAudit ? [...columns, audit.column] : columns}
      getId={(song) => song.id}
      renderExpanded={canAudit ? audit.renderExpanded : undefined}
    />
  );
}
