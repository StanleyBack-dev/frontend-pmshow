import "server-only";
import { z } from "zod";
import type { Permission, UserGroup } from "@/shared/contracts/api";

const GROUPS = [
  "USER",
  "ADMIN",
  "ADMIN_MASTER",
] as const satisfies readonly UserGroup[];

export const userIdSchema = z.uuid();

export const userInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  username: z.string().trim().min(3).max(32),
  group: z.enum(GROUPS),
});

// The API checks the value against its own enum; here it only has to look
// like one.
export const permissionSchema = z
  .string()
  .regex(/^[A-Z_]{3,64}$/)
  .transform((value) => value as Permission);
