"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Field,
  Drawer,
  Select,
  TextArea,
} from "@/design-system";
import { repertoireClient } from "@/features/repertoire/api/repertoire.client";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  formatDuration,
  parseDuration,
} from "@/features/repertoire/model/repertoire-labels";
import type {
  Song,
  SongCategory,
  SongInput,
} from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";

type FormState = {
  title: string;
  artist: string;
  arranger: string;
  category: SongCategory;
  musicalKey: string;
  bpm: string;
  duration: string;
  tags: string;
  lyrics: string;
  notes: string;
};

const fromSong = (song?: Song): FormState => ({
  title: song?.title ?? "",
  artist: song?.artist ?? "",
  arranger: song?.arranger ?? "",
  category: song?.category ?? "HINO",
  musicalKey: song?.musicalKey ?? "",
  bpm: song?.bpm ? String(song.bpm) : "",
  duration: song?.durationSeconds ? formatDuration(song.durationSeconds) : "",
  tags: song?.tags.join(", ") ?? "",
  lyrics: song?.lyrics ?? "",
  notes: song?.notes ?? "",
});

function toInput(form: FormState): SongInput | string {
  const durationSeconds = parseDuration(form.duration);
  if (Number.isNaN(durationSeconds)) {
    return "Duração inválida. Use minutos:segundos, ex.: 3:45.";
  }
  const bpm = form.bpm.trim() ? Number(form.bpm) : null;
  if (bpm !== null && !Number.isInteger(bpm)) return "BPM deve ser um número.";
  return {
    title: form.title,
    artist: form.artist || null,
    arranger: form.arranger || null,
    category: form.category,
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

// Create (no `song`) or edit a song.
export function SongFormDrawer({
  open,
  onClose,
  song,
}: {
  open: boolean;
  onClose: () => void;
  song?: Song;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => fromSong(song));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit() {
    const input = toInput(form);
    if (typeof input === "string") return setError(input);
    setPending(true);
    setError(null);
    try {
      if (song) {
        await repertoireClient.updateSong(song.id, input);
        router.refresh();
      } else {
        const created = await repertoireClient.createSong(input);
        router.push(`/repertorio/${created.id}`);
      }
      onClose();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar a música.",
      );
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
            onClick={submit}
            loading={pending}
            disabled={!form.title.trim()}
          >
            Salvar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Alert tone="danger">{error}</Alert>}
        <Field
          label="Título"
          required
          value={form.title}
          onChange={(event) => set("title", event.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Compositor / intérprete"
            value={form.artist}
            onChange={(event) => set("artist", event.target.value)}
          />
          <Field
            label="Arranjo"
            value={form.arranger}
            onChange={(event) => set("arranger", event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Categoria"
            value={form.category}
            onChange={(event) =>
              set("category", event.target.value as SongCategory)
            }
            options={CATEGORIES.map((value) => ({
              value,
              label: CATEGORY_LABELS[value],
            }))}
          />
          <Field
            label="Tonalidade"
            placeholder="Ex.: Bb, F#m"
            value={form.musicalKey}
            onChange={(event) => set("musicalKey", event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Andamento (BPM)"
            inputMode="numeric"
            value={form.bpm}
            onChange={(event) =>
              set("bpm", event.target.value.replace(/\D/g, ""))
            }
          />
          <Field
            label="Duração"
            placeholder="min:seg, ex.: 3:45"
            value={form.duration}
            onChange={(event) => set("duration", event.target.value)}
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
          rows={6}
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
    </Drawer>
  );
}
