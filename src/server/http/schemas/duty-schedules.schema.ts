import "server-only";
import { z } from "zod";
import { enumLike, optionalText } from "@/server/http/schemas/fields";
import type {
  DutyAudienceKind,
  DutyScheduleInput,
} from "@/shared/contracts/duty-schedules";
import type { EventUniform, Section } from "@/shared/graphql/schema-enums";

export const dutyScheduleInputSchema = z.object({
  title: optionalText(120),
  venueId: z.uuid(),
  uniform: enumLike<EventUniform>(),
  notes: optionalText(1000),
  days: z
    .array(
      z.object({
        startsAt: z.iso.datetime({ offset: true }),
        endsAt: z.iso.datetime({ offset: true }),
      }),
    )
    .min(1)
    .max(31),
  audience: z.object({
    kind: enumLike<DutyAudienceKind>(),
    sections: z.array(enumLike<Section>()).max(10).default([]),
    userIds: z.array(z.uuid()).max(300).default([]),
  }),
}) satisfies z.ZodType<DutyScheduleInput, unknown>;

export const cancelDutyScheduleSchema = z.object({
  reason: z.string().trim().min(1).max(300),
});
