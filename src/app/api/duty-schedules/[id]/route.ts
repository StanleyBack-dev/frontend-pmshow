import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { dutySchedulesService } from "@/server/services/duty-schedules.service";

// The expediente with its days and people (details modal).
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  return NextResponse.json(
    await dutySchedulesService.get(await requireToken(), id),
  );
});
