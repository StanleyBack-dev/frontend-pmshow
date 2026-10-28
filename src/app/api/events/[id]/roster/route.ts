import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { rosterSchema } from "@/server/http/schemas/rosters.schema";
import { bandFunctionsService } from "@/server/services/band-functions.service";
import { rostersService } from "@/server/services/rosters.service";

// The roster and who can be on it (the roster modal of the event drawer;
// managers). Only reading it: ./view.
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  const token = await requireToken();
  const [roster, candidates, functions] = await Promise.all([
    rostersService.get(token, id),
    rostersService.candidates(token, id),
    bandFunctionsService.list(token, true),
  ]);
  return NextResponse.json({ roster, candidates, functions });
});

// Replaces the roster's whole list (draft or published).
export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { assignments } = await readBody(request, rosterSchema);
  return NextResponse.json(
    await rostersService.save(await requireToken(), id, assignments),
  );
});
