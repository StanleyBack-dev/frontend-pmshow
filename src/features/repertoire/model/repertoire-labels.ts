import type { SongCategory } from "@/shared/contracts/repertoire";

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

/** 245 → "4:05". */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds < 0) return "—";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

/** "4:05" or "245" → 245; null when empty or not a duration. */
export function parseDuration(value: string): number | null {
  const text = value.trim();
  if (!text) return null;
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(text);
  if (match) return Number(match[1]) * 60 + Number(match[2]);
  return /^\d{1,4}$/.test(text) ? Number(text) : Number.NaN;
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
