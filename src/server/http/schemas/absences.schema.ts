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
});

export const registerAbsenceSchema = absenceInputSchema.extend({
  userId: z.uuid(),
});

export const reviewAbsenceSchema = z.object({
  approve: z.boolean(),
  note: optionalText(500),
});
