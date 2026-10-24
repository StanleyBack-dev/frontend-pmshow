import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { registerAbsenceSchema } from "@/server/http/schemas/absences.schema";
import { absencesService } from "@/server/services/absences.service";

// A manager registers an absence for someone (already approved).
export const POST = bffRoute(async (request) => {
  const { userId, ...input } = await readBody(request, registerAbsenceSchema);
  return NextResponse.json(
    await absencesService.register(await requireToken(), userId, input),
  );
});
