import "server-only";
import { z } from "zod";
import { enumLike, optionalText } from "@/server/http/schemas/fields";
import type { AssignmentRole } from "@/shared/contracts/rosters";

export const rosterSchema = z.object({
  assignments: z
    .array(
      z.object({
        userId: z.uuid(),
        role: enumLike<AssignmentRole>(),
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

export const ackSchema = z.object({
  answer: z.enum(["CIENTE", "TROCA_SOLICITADA"]),
  note: optionalText(300),
});
