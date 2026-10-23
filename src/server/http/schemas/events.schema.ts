import "server-only";
import { z } from "zod";
import type { EventStatus, EventType } from "@/shared/contracts/events";

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

/** ISO instant with offset, as built by shared/lib/datetime. */
const instant = z.iso.datetime({ offset: true });

export const eventInputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  type: enumLike<EventType>(),
  callTime: instant.nullish().transform((value) => value ?? null),
  startsAt: instant,
  endsAt: instant.nullish().transform((value) => value ?? null),
  venueId: z
    .uuid()
    .nullish()
    .transform((value) => value ?? null),
  uniform: optionalText(160),
  requester: optionalText(160),
  documentRef: optionalText(80),
  notes: optionalText(2000),
});

export const eventStatusSchema = z.object({
  status: enumLike<EventStatus>(),
  reason: optionalText(500),
});

export const setlistSchema = z.object({
  items: z
    .array(z.object({ songId: z.uuid(), notes: optionalText(200) }))
    .max(100),
});

export const venueInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  address: optionalText(255),
  city: optionalText(80),
  mapsUrl: optionalText(500),
  notes: optionalText(500),
  archived: z.boolean().optional(),
});
