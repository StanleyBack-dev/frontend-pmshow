import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { songInputSchema } from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, songInputSchema);
  return NextResponse.json(
    await repertoireService.createSong(await requireToken(), input),
  );
});
