import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { reviewAbsenceSchema } from "@/server/http/schemas/rosters.schema";
import { absencesService } from "@/server/services/absences.service";

export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { approve, note } = await readBody(request, reviewAbsenceSchema);
  return NextResponse.json(
    await absencesService.review(await requireToken(), id, approve, note),
  );
});
