import "server-only";
import { z } from "zod";

export const bandFunctionInputSchema = z.object({
  name: z.string().trim().min(2).max(60),
});

export const bandFunctionPatchSchema = bandFunctionInputSchema
  .partial()
  .extend({ archived: z.boolean().optional() });
