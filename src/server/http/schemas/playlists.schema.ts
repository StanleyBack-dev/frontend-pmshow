import "server-only";
import { z } from "zod";
import { optionalText } from "@/server/http/schemas/fields";

const videoSchema = z.object({
  videoId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  title: z.string().trim().min(1).max(200),
  channelTitle: optionalText(120),
});

// Each line is a song of the repertoire or a YouTube video.
const itemSchema = z.union([
  z.object({ songId: z.uuid() }).strict(),
  z.object({ video: videoSchema }).strict(),
]);

export const playlistSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: optionalText(300),
  shared: z.boolean(),
  items: z.array(itemSchema).max(200),
});
