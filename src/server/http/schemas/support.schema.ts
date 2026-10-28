import "server-only";
import { z } from "zod";
import { enumLike } from "@/server/http/schemas/fields";
import type { SupportCategory } from "@/shared/contracts/support";

export const supportRequestSchema = z.object({
  category: enumLike<SupportCategory>(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
});

export const supportReplySchema = z.object({
  reply: z.string().trim().min(2).max(2000),
});
