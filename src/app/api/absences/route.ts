import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { absenceInputSchema } from "@/server/http/schemas/rosters.schema";
import { absencesService } from "@/server/services/absences.service";

// The signed-in member asks for an absence (pending review).
export const POST = bffRoute(async (request) => {
  const input = await readBody(request, absenceInputSchema);
  return NextResponse.json(
    await absencesService.request(await requireToken(), input),
  );
});
