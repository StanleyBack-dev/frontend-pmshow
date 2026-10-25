import "server-only";
import { z } from "zod";
import { enumLike, optionalText } from "@/server/http/schemas/fields";
import type {
  EventStatus,
  EventType,
  EventUniform,
} from "@/shared/contracts/events";

/** ISO instant with offset, as built by shared/lib/datetime. */
const instant = z.iso.datetime({ offset: true });

export const eventInputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  type: enumLike<EventType>(),
  callTime: instant.nullish().transform((value) => value ?? null),
  startsAt: instant,
  endsAt: instant.nullish().transform((value) => value ?? null),
  venueId: z.uuid(),
  uniform: enumLike<EventUniform>(),
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
  zipCode: optionalText(9),
  street: optionalText(160),
  number: optionalText(10),
  complement: optionalText(80),
  district: optionalText(80),
  city: optionalText(80),
  state: optionalText(2),
  mapsUrl: optionalText(500),
  notes: optionalText(500),
  archived: z.boolean().optional(),
});
