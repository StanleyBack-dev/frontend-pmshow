import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";

// A fresh signed URL each time the player starts a track, so pages never
// carry URLs that may have expired while open.
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  const url = await repertoireService.playbackUrl(await requireToken(), id);
  return NextResponse.json(
    { url },
    { headers: { "cache-control": "no-store" } },
  );
});
