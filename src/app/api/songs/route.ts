import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { enumLike, idSchema } from "@/server/http/schemas/fields";
import { songInputSchema } from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";
import type { SongCategory } from "@/shared/contracts/repertoire";

const pickerQuerySchema = z.object({
  q: z.string().max(100).optional(),
  categoria: enumLike<SongCategory>().optional(),
  artista: idSchema.optional(),
});

/**
 * Song picker of the event's list of songs: ?q= (title / singer),
 * &categoria=, &artista= → up to 100 songs of the repertoire, by title.
 */
export const GET = bffRoute(async (request) => {
  const query = pickerQuerySchema.parse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  const { songs } = await repertoireService.songs(await requireToken(), {
    search: query.q,
    category: query.categoria,
    artistId: query.artista,
    archived: false,
    page: 1,
    limit: 100,
  });
  return NextResponse.json(
    songs.items.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist?.name ?? null,
      category: song.category,
      musicalKey: song.musicalKey,
    })),
  );
});

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, songInputSchema);
  return NextResponse.json(
    await repertoireService.createSong(await requireToken(), input),
  );
});
