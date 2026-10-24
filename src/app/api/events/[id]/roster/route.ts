import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { rosterSchema } from "@/server/http/schemas/rosters.schema";
import { rostersService } from "@/server/services/rosters.service";

// Replaces the roster's whole list (draft or published).
export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { assignments } = await readBody(request, rosterSchema);
  return NextResponse.json(
    await rostersService.save(await requireToken(), id, assignments),
  );
});
