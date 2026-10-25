"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Check, Plus, Search, X } from "lucide-react";
import {
  Alert,
  Button,
  Field,
  Drawer,
  Modal,
  Select,
  Spinner,
  TextArea,
} from "@/design-system";
import { artistsClient } from "@/features/artists/api/artists.client";
import { repertoireClient } from "@/features/repertoire/api/repertoire.client";
import { ArtistQuickCreateModal } from "@/features/artists/components/ArtistQuickCreateModal";
import { YoutubeSearchModal } from "@/features/repertoire/components/YoutubeSearchModal";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  formatDuration,
  STAGE_LABELS,
  STAGES,
} from "@/features/repertoire/model/repertoire-labels";
import { musicalKeyOptions } from "@/features/repertoire/model/musical-keys";
import {
  artistKey,
  guessFromVideo,
  youtubeWatchUrl,
} from "@/features/repertoire/model/video-guess";
import type {
  Artist,
  Song,
  SongCategory,
  SongInput,
  SongStage,
  YoutubeVideoResult,
} from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";
import {
  bpmError,
  completeDuration,
  durationError,
  durationToSeconds,
  maskBpm,
  maskDuration,
} from "@/shared/lib/masks";

type FormState = {
  title: string;
  artistId: string;
  /** Singer / band suggested by a video, created only when saving. */
  newArtistName: string;
  arranger: string;
  /** "" until chosen: the category is required. */
  category: SongCategory | "";
  stage: SongStage;
  musicalKey: string;
  bpm: string;
  duration: string;
  tags: string;
  lyrics: string;
  notes: string;
};

const fromSong = (song?: Song): FormState => ({
  title: song?.title ?? "",
  artistId: song?.artistId ?? "",
  newArtistName: "",
  arranger: song?.arranger ?? "",
  category: song?.category ?? "",
  stage: song?.stage ?? "CONHECIDA",
  musicalKey: song?.musicalKey ?? "",
  bpm: song?.bpm ? String(song.bpm) : "",
  duration: song?.durationSeconds ? formatDuration(song.durationSeconds) : "",
  tags: song?.tags.join(", ") ?? "",
  lyrics: song?.lyrics ?? "",
  notes: song?.notes ?? "",
});

function toInput(form: FormState): SongInput | string {
  const invalid = durationError(form.duration) ?? bpmError(form.bpm);
  if (invalid) return "Corrija os campos destacados.";
  if (!form.category) return "Escolha a categoria da música.";
  const durationSeconds = durationToSeconds(form.duration);
  const bpm = form.bpm ? Number(form.bpm) : null;
  return {
    title: form.title,
    artistId: form.artistId || null,
    arranger: form.arranger || null,
    category: form.category as SongCategory,
    stage: form.stage,
    musicalKey: form.musicalKey || null,
    bpm,
    durationSeconds,
    lyrics: form.lyrics || null,
    notes: form.notes || null,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

const NEW_ARTIST = "__new__";

const errorMessage = (cause: unknown, fallback: string) =>
  cause instanceof ApiClientError ? cause.message : fallback;

// Lyrics found for the chosen video, waiting for the user when the form
// already had lyrics (never overwritten silently).
type LyricsOffer = { lyrics: string; artist: string; title: string };

// Create (no `song`) or edit a song. The magnifier searches YouTube: the
// chosen video fills title, singer / band and lyrics, but nothing is stored
// until saving. Saving with a singer / band asks to confirm both names (a
// video title may list them in either order) and can swap them; only then
// a new singer / band is registered and the song saved.
export function SongFormDrawer({
  open,
  onClose,
  song,
  artists: initialArtists,
}: {
  open: boolean;
  onClose: () => void;
  song?: Song;
  artists: Artist[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => fromSong(song));
  const [artists, setArtists] = useState(initialArtists);
  const [video, setVideo] = useState<YoutubeVideoResult | null>(null);
  const [lookup, setLookup] = useState<"idle" | "busy">("idle");
  const [lookupNote, setLookupNote] = useState<string | null>(null);
  const [lyricsOffer, setLyricsOffer] = useState<LyricsOffer | null>(null);
  const [dialog, setDialog] = useState<"artist" | "youtube" | "confirm" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  // Field errors show once the field was left (or on save).
  const [touched, setTouched] = useState({
    duration: false,
    bpm: false,
    artist: false,
  });
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const selectedArtist = artists.find((item) => item.id === form.artistId);

  const artistName = selectedArtist?.name ?? form.newArtistName;

  function addArtist(artist: Artist) {
    setArtists((current) =>
      [...current, artist].sort((a, b) => a.name.localeCompare(b.name)),
    );
    setForm((current) => ({
      ...current,
      artistId: artist.id,
      newArtistName: "",
    }));
  }

  /** The registered artist with this name, or the name kept as pending. */
  function chooseArtistNamed(name: string) {
    const clean = name.trim().replace(/\s+/g, " ");
    const existing = artists.find(
      (item) => artistKey(item.name) === artistKey(clean),
    );
    setForm((current) => ({
      ...current,
      artistId: existing?.id ?? "",
      newArtistName: existing ? "" : clean,
    }));
  }

  async function pickVideo(picked: YoutubeVideoResult) {
    setDialog(null);
    setVideo(picked);
    if (picked.durationSeconds) {
      set("duration", formatDuration(picked.durationSeconds));
    }
    setLyricsOffer(null);
    setLookupNote(null);

    const guess = guessFromVideo(picked, form.title);
    const keepArtist = Boolean(form.artistId || form.newArtistName);
    const lookupArtist = artistName || guess.artist;
    const title = form.title.trim() || guess.title;
    if (!form.title.trim()) set("title", title);
    if (!keepArtist && guess.artist) chooseArtistNamed(guess.artist);

    setLookup("busy");
    try {
      const found = lookupArtist
        ? await repertoireClient.findLyrics(lookupArtist, title)
        : null;
      if (found) {
        // The catalog's names are the most reliable suggestion.
        set("title", found.title);
        if (!keepArtist) chooseArtistNamed(found.artist);
        if (!form.lyrics.trim()) set("lyrics", found.lyrics);
        else setLyricsOffer(found);
      } else {
        setLookupNote("Letra não encontrada: preencha manualmente se quiser.");
      }
    } catch (cause) {
      setLookupNote(errorMessage(cause, "Não foi possível buscar a letra."));
    }
    setLookup("idle");
  }

  /** Typing a singer / band name in the confirmation (resolved on save). */
  function typeArtistName(name: string) {
    setForm((current) => ({ ...current, artistId: "", newArtistName: name }));
  }

  /** Swaps title and singer / band (the video listed them the other way). */
  function swapTitleAndArtist() {
    const nextTitle = artistName;
    const nextArtist = form.title;
    set("title", nextTitle);
    if (nextArtist.trim()) chooseArtistNamed(nextArtist);
  }

  function requestSave() {
    const input = toInput(form);
    if (typeof input === "string" || !artistName.trim()) {
      setTouched({ duration: true, bpm: true, artist: true });
      return setError(
        typeof input === "string" ? input : "Informe o cantor / banda.",
      );
    }
    setError(null);
    // Names that came from a video, a new artist or a new song: confirm.
    const confirm = !song || Boolean(video) || Boolean(form.newArtistName);
    if (confirm) setDialog("confirm");
    else void submit();
  }

  async function submit() {
    const input = toInput(form);
    if (typeof input === "string") return setError(input);
    setPending(true);
    setError(null);
    try {
      const typedArtist = form.newArtistName.trim().replace(/\s+/g, " ");
      if (typedArtist) {
        const existing = artists.find(
          (item) => artistKey(item.name) === artistKey(typedArtist),
        );
        const artist = existing ?? (await artistsClient.create(typedArtist));
        if (!existing) addArtist(artist);
        input.artistId = artist.id;
      }
      const saved = song
        ? await repertoireClient.updateSong(song.id, input)
        : await repertoireClient.createSong(input);
      if (video) {
        await repertoireClient.addVideo(
          saved.id,
          youtubeWatchUrl(video.videoId),
          video.title.slice(0, 120),
        );
      }
      if (song) router.refresh();
      else router.push(`/repertorio/${saved.id}`);
      onClose();
    } catch (cause) {
      setDialog(null);
      setError(errorMessage(cause, "Não foi possível salvar a música."));
    }
    setPending(false);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={song ? "Editar música" : "Nova música"}
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={requestSave}
            loading={pending}
            disabled={!form.title.trim() || lookup === "busy"}
          >
            Salvar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Alert tone="danger">{error}</Alert>}
        <div className="flex items-end gap-2">
          <Field
            label="Título"
            required
            className="min-w-0 flex-1"
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
          />
          <Button
            variant="secondary"
            className="shrink-0"
            onClick={() => setDialog("youtube")}
            icon={<Search className="size-4" />}
            aria-label="Buscar vídeo no YouTube"
            title="Buscar vídeo, cantor e letra no YouTube"
          >
            <span className="hidden sm:inline">YouTube</span>
          </Button>
        </div>

        {video && (
          <div className="flex items-center gap-3 rounded-md border border-accent-border bg-accent-soft p-2">
            <Image
              src={video.thumbnailUrl}
              alt=""
              width={96}
              height={54}
              className="h-[54px] w-24 shrink-0 rounded object-cover"
            />
            <div className="min-w-0 flex-1 text-xs">
              <p className="line-clamp-2 font-medium text-fg">{video.title}</p>
              <p className="text-soft">
                {lookup === "busy" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Spinner size="sm" /> Buscando cantor e letra…
                  </span>
                ) : (
                  "O vídeo será vinculado ao salvar."
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setVideo(null);
                setLyricsOffer(null);
                setLookupNote(null);
              }}
              aria-label="Remover vídeo escolhido"
              className="grid size-7 shrink-0 place-items-center rounded-md text-soft hover:bg-surface hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        {lookupNote && <Alert tone="info">{lookupNote}</Alert>}
        {lyricsOffer && (
          <Alert tone="info">
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span>
                Encontramos a letra de “{lyricsOffer.title}”. Substituir a letra
                atual?
              </span>
              <span className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setLyricsOffer(null)}
                >
                  Manter
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    set("lyrics", lyricsOffer.lyrics);
                    setLyricsOffer(null);
                  }}
                >
                  Substituir
                </Button>
              </span>
            </span>
          </Alert>
        )}

        <Select
          label="Cantor / banda"
          required
          error={
            touched.artist && !artistName.trim()
              ? "Toda música precisa de um cantor / banda."
              : undefined
          }
          value={form.newArtistName ? NEW_ARTIST : form.artistId}
          onChange={(event) => {
            if (event.target.value === NEW_ARTIST) return;
            setForm((current) => ({
              ...current,
              artistId: event.target.value,
              newArtistName: "",
            }));
          }}
          placeholder="Não informado"
          addon={
            <Button
              variant="secondary"
              onClick={() => setDialog("artist")}
              size="icon"
              icon={<Plus className="size-4" />}
              aria-label="Cadastrar cantor / banda"
              title="Cadastrar cantor / banda"
            />
          }
          options={[
            ...(form.newArtistName
              ? [
                  {
                    value: NEW_ARTIST,
                    label: `${form.newArtistName} (novo, será cadastrado ao salvar)`,
                  },
                ]
              : []),
            ...artists.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          ]}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Situação"
            value={form.stage}
            onChange={(event) => set("stage", event.target.value as SongStage)}
            options={STAGES.map((value) => ({
              value,
              label: STAGE_LABELS[value].label,
            }))}
          />
          <Select
            label="Categoria"
            required
            placeholder="Selecione"
            error={
              touched.artist && !form.category
                ? "Escolha a categoria da música."
                : undefined
            }
            value={form.category}
            onChange={(event) =>
              set("category", event.target.value as SongCategory)
            }
            options={CATEGORIES.map((value) => ({
              value,
              label: CATEGORY_LABELS[value],
            }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Arranjo"
            value={form.arranger}
            onChange={(event) => set("arranger", event.target.value)}
          />
          <Select
            label="Tonalidade"
            value={form.musicalKey}
            onChange={(event) => set("musicalKey", event.target.value)}
            placeholder="Não informada"
            options={musicalKeyOptions(song?.musicalKey)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Andamento (BPM)"
            inputMode="numeric"
            placeholder="20 a 300"
            value={form.bpm}
            onChange={(event) => set("bpm", maskBpm(event.target.value))}
            onBlur={() => setTouched((t) => ({ ...t, bpm: true }))}
            error={(touched.bpm && bpmError(form.bpm)) || undefined}
          />
          {/* Filled by the chosen YouTube video (and by the first video or
              audio on save when empty), and still editable. */}
          <Field
            label="Duração"
            inputMode="numeric"
            placeholder="min:seg, ex.: 3:45"
            title="Preenchida pelo vídeo do YouTube ou pelo áudio enviado; pode ser alterada"
            value={form.duration}
            onChange={(event) =>
              set("duration", maskDuration(event.target.value))
            }
            onBlur={() => {
              set("duration", completeDuration(form.duration));
              setTouched((t) => ({ ...t, duration: true }));
            }}
            error={
              (touched.duration && durationError(form.duration)) || undefined
            }
          />
        </div>
        <TextArea
          label="Tags"
          rows={1}
          hint="Separadas por vírgula, ex.: desfile, formatura."
          value={form.tags}
          onChange={(event) => set("tags", event.target.value)}
        />
        <TextArea
          label="Letra"
          rows={8}
          value={form.lyrics}
          onChange={(event) => set("lyrics", event.target.value)}
        />
        <TextArea
          label="Observações"
          rows={2}
          value={form.notes}
          onChange={(event) => set("notes", event.target.value)}
        />
      </div>

      {/* Remounted on each open, so they start fresh. */}
      {dialog === "artist" && (
        <ArtistQuickCreateModal
          open
          onClose={() => setDialog(null)}
          onCreated={(artist) => {
            addArtist(artist);
            setDialog(null);
          }}
        />
      )}
      {dialog === "confirm" && (
        <Modal
          open
          onClose={() => setDialog(null)}
          title="Confirme os nomes"
          busy={pending}
          footer={
            // Swap on the left, confirm on the right (closing is the X).
            <div className="flex w-full items-center justify-between gap-2">
              <Button
                variant="secondary"
                onClick={swapTitleAndArtist}
                disabled={pending}
                icon={<ArrowLeftRight className="size-4" />}
              >
                Inverter
              </Button>
              <Button
                onClick={() => void submit()}
                loading={pending}
                disabled={!form.title.trim() || !artistName.trim()}
                icon={<Check className="size-4" />}
              >
                Confirmar
              </Button>
            </div>
          }
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (form.title.trim() && artistName.trim()) void submit();
            }}
          >
            <p>
              Confira o título e o cantor / banda. Se vieram trocados do vídeo,
              use “Inverter”; você também pode corrigir o texto aqui.
            </p>
            <Field
              label="Título"
              required
              data-autofocus
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
              error={form.title.trim() ? undefined : "Informe o título."}
            />
            <div>
              <Field
                label="Cantor / banda"
                required
                value={artistName}
                onChange={(event) => typeArtistName(event.target.value)}
                error={
                  artistName.trim()
                    ? undefined
                    : "Toda música precisa de um cantor / banda."
                }
              />
              <p className="mt-1.5 text-xs text-soft">
                {!artistName.trim()
                  ? null
                  : artists.some(
                        (item) =>
                          artistKey(item.name) === artistKey(artistName),
                      )
                    ? "Já cadastrado: a música será vinculada a ele."
                    : "Novo: será cadastrado ao confirmar."}
              </p>
            </div>
          </form>
        </Modal>
      )}
      {dialog === "youtube" && (
        <YoutubeSearchModal
          open
          initialQuery={[form.title, artistName].filter(Boolean).join(" ")}
          onClose={() => setDialog(null)}
          onPick={(picked) => void pickVideo(picked)}
        />
      )}
    </Drawer>
  );
}
