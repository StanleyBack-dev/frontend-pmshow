import "server-only";
import { z } from "zod";

// Field shapes shared by the BFF request schemas. Shapes only: the API
// validates every value against its own enums and rules.

export const idSchema = z.uuid();

/** An enum value of the GraphQL schema (checked by the API). */
export const enumLike = <T extends string>() =>
  z
    .string()
    .regex(/^[A-Z][A-Z0-9_]{1,31}$/)
    .transform((value) => value as T);

/** Optional text, trimmed; blank becomes null. */
export const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((value) => value?.trim() || null);
