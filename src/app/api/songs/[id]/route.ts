import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import {
  idSchema,
  songInputSchema,
} from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";

export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const input = await readBody(request, songInputSchema);
  return NextResponse.json(
    await repertoireService.updateSong(await requireToken(), id, input),
  );
});
