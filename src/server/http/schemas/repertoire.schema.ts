import "server-only";
import { z } from "zod";
import { enumLike, optionalText } from "@/server/http/schemas/fields";
import type { MemberStatus, Rank, Section } from "@/shared/contracts/members";
import type { SongCategory, SongStage } from "@/shared/contracts/repertoire";

const optionalInt = z
  .number()
  .int()
  .nullish()
  .transform((v) => v ?? null);

export const songInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  artistId: z
    .uuid()
    .nullish()
    .transform((value) => value ?? null),
  stage: enumLike<SongStage>(),
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
  functionIds: z.array(z.uuid()).max(10).default([]),
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

export const artistInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  archived: z.boolean().optional(),
});
