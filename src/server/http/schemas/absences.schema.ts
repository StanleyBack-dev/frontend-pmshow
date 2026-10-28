import "server-only";
import { z } from "zod";
import { enumLike, optionalText } from "@/server/http/schemas/fields";
import type { AbsenceType } from "@/shared/contracts/absences";

const localDate = z.iso.date();

export const absenceInputSchema = z.object({
  type: enumLike<AbsenceType>(),
  startsOn: localDate,
  endsOn: localDate,
  reason: optionalText(500),
  attachments: z
    .array(
      z.object({
        storageKey: z.string().min(1).max(300),
        fileName: z.string().trim().min(1).max(200),
      }),
    )
    .max(3)
    .optional(),
});

/** Name, type and size of the files to attach (checked by the API). */
export const attachmentUploadsSchema = z.object({
  files: z
    .array(
      z.object({
        fileName: z.string().trim().min(1).max(200),
        mimeType: z.string().min(1).max(60),
        sizeBytes: z.number().int().positive(),
      }),
    )
    .min(1)
    .max(3),
});

export const registerAbsenceSchema = absenceInputSchema.extend({
  userId: z.uuid(),
});

export const reviewAbsenceSchema = z.object({
  approve: z.boolean(),
  note: optionalText(500),
});
