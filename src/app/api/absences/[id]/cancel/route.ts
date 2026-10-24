import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { absencesService } from "@/server/services/absences.service";

export const POST = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  return NextResponse.json(
    await absencesService.cancel(await requireToken(), id),
  );
});
