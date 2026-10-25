import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { repertoireService } from "@/server/services/repertoire.service";

// YouTube search for the song form: ?q=…
export const GET = bffRoute(async (request) => {
  const query = request.nextUrl.searchParams.get("q")?.slice(0, 120) ?? "";
  return NextResponse.json(
    await repertoireService.searchYoutube(await requireToken(), query),
  );
});
