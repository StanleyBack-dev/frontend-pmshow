import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { artistInputSchema } from "@/server/http/schemas/repertoire.schema";
import { artistsService } from "@/server/services/artists.service";

export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const input = await readBody(request, artistInputSchema);
  return NextResponse.json(
    await artistsService.update(await requireToken(), id, input),
  );
});
