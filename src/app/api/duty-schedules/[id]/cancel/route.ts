import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { cancelDutyScheduleSchema } from "@/server/http/schemas/duty-schedules.schema";
import { idSchema } from "@/server/http/schemas/fields";
import { dutySchedulesService } from "@/server/services/duty-schedules.service";

// Cancels the days still ahead and tells each person once.
export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { reason } = await readBody(request, cancelDutyScheduleSchema);
  return NextResponse.json(
    await dutySchedulesService.cancel(await requireToken(), id, reason),
  );
});
