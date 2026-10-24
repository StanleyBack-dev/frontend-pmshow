import "server-only";
import { z } from "zod";
import { enumLike } from "@/server/http/schemas/fields";
import type { BroadcastAudience } from "@/shared/contracts/broadcasts";
import type { Section } from "@/shared/contracts/members";

export const broadcastSchema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(3).max(2000),
  audience: enumLike<BroadcastAudience>(),
  section: enumLike<Section>()
    .nullish()
    .transform((value) => value ?? null),
  eventId: z
    .uuid()
    .nullish()
    .transform((value) => value ?? null),
  sendEmail: z.boolean(),
});
