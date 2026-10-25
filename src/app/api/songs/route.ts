import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { songInputSchema } from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";

/** Song search for pickers (setlist editor): ?q=… → first 15 matches. */
export const GET = bffRoute(async (request) => {
  const search = request.nextUrl.searchParams.get("q")?.slice(0, 100) ?? "";
  const { songs } = await repertoireService.songs(await requireToken(), {
    search,
    archived: false,
    page: 1,
    limit: 15,
  });
  return NextResponse.json(
    songs.items.slice(0, 15).map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist?.name ?? null,
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
