import "server-only";
import { z } from "zod";
import type { AbsenceType } from "@/shared/contracts/absences";
import type { NotificationType } from "@/shared/contracts/notifications";
import type { AssignmentRole } from "@/shared/contracts/rosters";

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

const localDate = z.iso.date();

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

export const notificationPreferenceSchema = z.object({
  type: enumLike<NotificationType>(),
  emailEnabled: z.boolean(),
});
