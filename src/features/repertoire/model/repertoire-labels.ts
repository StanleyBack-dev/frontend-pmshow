import type { Tone } from "@/design-system";
import type { SongCategory, SongStage } from "@/shared/contracts/repertoire";

export const CATEGORY_LABELS: Record<SongCategory, string> = {
  HINO: "Hino",
  MARCHA: "Marcha",
  DOBRADO: "Dobrado",
  MPB: "MPB",
  SAMBA_PAGODE: "Samba e pagode",
  SERTANEJO: "Sertanejo",
  FORRO: "Forró",
  GOSPEL: "Gospel",
  POP_ROCK: "Pop e rock",
  INSTRUMENTAL: "Instrumental",
  INFANTIL: "Infantil",
  OUTRO: "Outro",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as SongCategory[];

export const STAGE_LABELS: Record<
  SongStage,
  { label: string; short: string; tone: Tone }
> = {
  NOVA: { label: "Nova (para aprender)", short: "Nova", tone: "gold" },
  CONHECIDA: { label: "Já tocamos", short: "Já tocamos", tone: "success" },
};

export const STAGES = Object.keys(STAGE_LABELS) as SongStage[];

/** 245 → "4:05". */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds < 0) return "—";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1
    ? `${mb.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`
    : `${Math.ceil(bytes / 1024)} KB`;
}

/** Same list the API accepts (audio types it can store and play). */
export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/webm",
  "audio/flac",
];

export const MAX_AUDIO_MB = 50;
