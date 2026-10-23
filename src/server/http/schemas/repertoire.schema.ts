import "server-only";
import { z } from "zod";
import type { MemberStatus, Rank, Section } from "@/shared/contracts/members";
import type { SongCategory } from "@/shared/contracts/repertoire";

// Shapes only; the API validates every value against its own enums and rules.
const enumLike = <T extends string>() =>
  z
    .string()
    .regex(/^[A-Z_]{2,32}$/)
    .transform((value) => value as T);

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((value) => value?.trim() || null);

const optionalInt = z
  .number()
  .int()
  .nullish()
  .transform((v) => v ?? null);

export const idSchema = z.uuid();

export const songInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  artist: optionalText(160),
  arranger: optionalText(160),
  category: enumLike<SongCategory>(),
  musicalKey: optionalText(8),
  bpm: optionalInt,
  durationSeconds: optionalInt,
  lyrics: optionalText(20000),
  notes: optionalText(1000),
  tags: z.array(z.string().max(30)).max(20).default([]),
});

export const memberProfileInputSchema = z.object({
  warName: z.string().trim().min(2).max(60),
  rank: enumLike<Rank>(),
  registration: optionalText(30),
  phone: optionalText(20),
  section: enumLike<Section>(),
  status: enumLike<MemberStatus>(),
  notes: optionalText(500),
  instruments: z
    .array(z.object({ instrumentId: z.uuid(), primary: z.boolean() }))
    .max(10),
});

export const instrumentInputSchema = z.object({
  name: z.string().trim().min(2).max(60),
  section: enumLike<Section>(),
});

export const audioUploadRequestSchema = z.object({
  songId: z.uuid(),
  title: z.string().trim().min(1).max(160),
  mimeType: z.string().min(3).max(64),
  sizeBytes: z.number().positive(),
});
