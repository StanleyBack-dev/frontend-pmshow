import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Alert, Badge, Card, CardBody, CardHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { AudioList } from "@/features/repertoire/components/AudioList";
import { AudioUploader } from "@/features/repertoire/components/AudioUploader";
import {
  ArchiveSongButton,
  EditSongButton,
} from "@/features/repertoire/components/SongButtons";
import {
  AddVideoForm,
  VideoList,
} from "@/features/repertoire/components/VideoList";
import {
  CATEGORY_LABELS,
  formatDuration,
  STAGE_LABELS,
} from "@/features/repertoire/model/repertoire-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { BackendError } from "@/server/http/backend-error";
import { artistsService } from "@/server/services/artists.service";
import { repertoireService } from "@/server/services/repertoire.service";
import { can } from "@/shared/lib/access";

export const metadata: Metadata = { title: "Música" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!can(user, "REPERTOIRE_READ")) return <AccessDenied />;

  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const canManage = can(user, "REPERTOIRE_MANAGE");
  const [song, artists] = await authed(async (token) => {
    try {
      return await Promise.all([
        repertoireService.song(token, id),
        // Options of the edit form (only managers can edit).
        canManage ? artistsService.list(token) : [],
      ]);
    } catch (error) {
      if (error instanceof BackendError && error.code === "SONG_NOT_FOUND") {
        notFound();
      }
      throw error;
    }
  });

  const canUpload = can(user, "MEDIA_UPLOAD") && !song.archivedAt;
  const audios = song.media.filter((item) => item.kind === "AUDIO");
  const videos = song.media.filter((item) => item.kind === "VIDEO");
  const details = [
    ["Cantor / banda", song.artist?.name],
    ["Arranjo", song.arranger],
    ["Tonalidade", song.musicalKey],
    ["Andamento", song.bpm ? `${song.bpm} BPM` : null],
    [
      "Duração",
      song.durationSeconds ? formatDuration(song.durationSeconds) : null,
    ],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <div className="space-y-6">
      <Link
        href="/repertorio"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Repertório
      </Link>

      {song.archivedAt && (
        <Alert tone="warning">
          Esta música está arquivada e não aparece no repertório.
        </Alert>
      )}

      <Card>
        <CardHeader
          title={song.title}
          description={
            <span className="inline-flex flex-wrap items-center gap-1.5">
              <Badge tone="accent">{CATEGORY_LABELS[song.category]}</Badge>
              <Badge tone={STAGE_LABELS[song.stage].tone}>
                {STAGE_LABELS[song.stage].short}
              </Badge>
              {song.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/repertorio?tag=${encodeURIComponent(tag)}`}
                >
                  <Badge tone="neutral">#{tag}</Badge>
                </Link>
              ))}
            </span>
          }
          action={
            canManage ? (
              <span className="flex gap-2">
                {!song.archivedAt && (
                  <EditSongButton song={song} artists={artists} />
                )}
                <ArchiveSongButton song={song} />
              </span>
            ) : undefined
          }
        />
        {(details.length > 0 || song.notes) && (
          <CardBody>
            {details.length > 0 && (
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                {details.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-soft">{label}</dt>
                    <dd className="text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {song.notes && (
              <p className="mt-4 text-sm whitespace-pre-line text-muted">
                {song.notes}
              </p>
            )}
          </CardBody>
        )}
      </Card>

      <Card>
        <CardHeader title="Áudios" />
        <CardBody className="space-y-4">
          <AudioList
            songTitle={song.title}
            lyrics={song.lyrics}
            audios={audios}
            canDownload={can(user, "MEDIA_DOWNLOAD")}
            canManage={canUpload}
          />
          {canUpload && <AudioUploader songId={song.id} />}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Vídeos" />
        <CardBody className="space-y-4">
          <VideoList videos={videos} canManage={canUpload} />
          {canUpload && <AddVideoForm songId={song.id} />}
        </CardBody>
      </Card>

      {song.lyrics && (
        <Card>
          <CardHeader title="Letra" />
          <CardBody>
            <p className="text-sm leading-relaxed whitespace-pre-line text-fg">
              {song.lyrics}
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
