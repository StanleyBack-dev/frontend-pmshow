import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { repertoireService } from "@/server/services/repertoire.service";

// Lyrics for the song form: ?artista=…&titulo=… (null = not found).
export const GET = bffRoute(async (request) => {
  const params = request.nextUrl.searchParams;
  const artist = params.get("artista")?.slice(0, 120) ?? "";
  const title = params.get("titulo")?.slice(0, 160) ?? "";
  return NextResponse.json(
    await repertoireService.findLyrics(await requireToken(), artist, title),
  );
});
