import "server-only";
import { z } from "zod";
import { optionalText } from "@/server/http/schemas/fields";

export const playlistSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: optionalText(300),
  shared: z.boolean(),
  songIds: z.array(z.uuid()).max(200),
});
