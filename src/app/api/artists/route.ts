import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { artistInputSchema } from "@/server/http/schemas/repertoire.schema";
import { artistsService } from "@/server/services/artists.service";

// Active singers / bands (filters and pickers).
export const GET = bffRoute(async () =>
  NextResponse.json(await artistsService.list(await requireToken())),
);

export const POST = bffRoute(async (request) => {
  const { name } = await readBody(request, artistInputSchema);
  return NextResponse.json(
    await artistsService.create(await requireToken(), name),
  );
});
