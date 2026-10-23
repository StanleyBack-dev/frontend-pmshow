"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Plus } from "lucide-react";
import { Alert, Button, Field } from "@/design-system";
import { repertoireClient } from "@/features/repertoire/api/repertoire.client";
import { MediaItemActions } from "@/features/repertoire/components/MediaItemActions";
import type { MediaAsset } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";

// Thumbnail first; the YouTube player (privacy-enhanced domain) loads only
// when someone presses play, so pages stay light and nothing is sent to
// YouTube before that.
function LiteYoutube({ video }: { video: MediaAsset }) {
  const [active, setActive] = useState(false);
  const id = video.youtubeVideoId as string;

  if (active) {
    return (
      <iframe
        className="aspect-video w-full rounded-lg"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`Assistir ${video.title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-black"
    >
      <Image
        src={video.thumbnailUrl ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-14 place-items-center rounded-full bg-black/70 text-white transition-transform group-hover:scale-110">
          <Play className="size-6" />
        </span>
      </span>
    </button>
  );
}

export function VideoList({
  videos,
  canManage,
}: {
  videos: MediaAsset[];
  canManage: boolean;
}) {
  if (videos.length === 0) {
    return <p className="text-sm text-muted">Nenhum vídeo ainda.</p>;
  }
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {videos.map((video) => (
        <li key={video.id} className="space-y-2">
          <LiteYoutube video={video} />
          <div className="flex items-start gap-2">
            <p className="flex-1 text-sm font-medium text-fg">{video.title}</p>
            {canManage && <MediaItemActions asset={video} />}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AddVideoForm({ songId }: { songId: string }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await repertoireClient.addVideo(songId, link, null);
      setLink("");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível adicionar o vídeo.",
      );
    }
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="space-y-2" noValidate>
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Field
          label="Link do YouTube"
          placeholder="https://youtu.be/…"
          className="flex-1"
          value={link}
          onChange={(event) => setLink(event.target.value)}
        />
        <Button
          type="submit"
          variant="secondary"
          loading={pending}
          disabled={!link.trim()}
          icon={<Plus className="size-4" />}
        >
          Adicionar vídeo
        </Button>
      </div>
    </form>
  );
}
