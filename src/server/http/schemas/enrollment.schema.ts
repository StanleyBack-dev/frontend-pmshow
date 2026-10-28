import "server-only";
import { z } from "zod";
import { enumLike, idSchema } from "@/server/http/schemas/fields";
import type { Rank } from "@/shared/contracts/members";

export const enrollmentCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/),
});

export const enrollmentDataSchema = z.object({
  fullName: z.string().trim().min(1).max(160),
  email: z.string().trim().min(1).max(254),
  phone: z.string().trim().min(1).max(20),
  military: z.boolean(),
  militaryId: z
    .string()
    .trim()
    .max(10)
    .nullish()
    .transform((value) => value || null),
  rank: enumLike<Rank>()
    .nullish()
    .transform((value) => value ?? null),
  warName: z.string().trim().min(1).max(60),
  instruments: z
    .array(z.object({ instrumentId: idSchema, primary: z.boolean() }))
    .max(10),
});

export const submitEnrollmentSchema = z.object({
  data: enrollmentDataSchema,
  consent: z.boolean(),
  /** Base64 of the photo the browser shrank (the API checks the content). */
  photo: z
    .string()
    .max(2_800_000)
    .regex(/^[A-Za-z0-9+/]+={0,2}$/)
    .nullish()
    .transform((value) => value ?? null),
});

export const enrollmentInviteSchema = z.object({
  label: z.string().trim().min(2).max(80),
  validDays: z.number().int().min(1).max(30),
});
