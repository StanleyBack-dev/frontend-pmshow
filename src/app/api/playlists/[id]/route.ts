import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { playlistSchema } from "@/server/http/schemas/playlists.schema";
import { playlistsService } from "@/server/services/playlists.service";

// The playlist with its songs and media (to play or edit it).
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  return NextResponse.json(
    await playlistsService.get(await requireToken(), id),
  );
});

// Only its owner changes or deletes it (the API checks).
export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const input = await readBody(request, playlistSchema);
  return NextResponse.json(
    await playlistsService.update(await requireToken(), id, input),
  );
});

export const DELETE = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  await playlistsService.remove(await requireToken(), id);
  return NextResponse.json({ ok: true });
});
