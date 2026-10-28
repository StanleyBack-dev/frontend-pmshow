import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { playlistSchema } from "@/server/http/schemas/playlists.schema";
import { playlistsService } from "@/server/services/playlists.service";

// Creates a playlist of the signed-in user.
export const POST = bffRoute(async (request) => {
  const input = await readBody(request, playlistSchema);
  return NextResponse.json(
    await playlistsService.create(await requireToken(), input),
  );
});
