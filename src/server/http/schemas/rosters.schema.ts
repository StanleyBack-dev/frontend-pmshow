import "server-only";
import { z } from "zod";
import { optionalText } from "@/server/http/schemas/fields";

export const rosterSchema = z.object({
  assignments: z
    .array(
      z.object({
        userId: z.uuid(),
        functionId: z
          .uuid()
          .nullish()
          .transform((value) => value ?? null),
        instrumentId: z
          .uuid()
          .nullish()
          .transform((value) => value ?? null),
        notes: optionalText(200),
        overrideReason: optionalText(300),
      }),
    )
    .max(200),
});

export const keepOnRosterSchema = z.object({
  userId: z.uuid(),
  note: optionalText(300),
});

export const ackSchema = z.object({
  answer: z.enum(["CIENTE", "TROCA_SOLICITADA"]),
  note: optionalText(300),
});
