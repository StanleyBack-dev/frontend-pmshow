import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { dutyScheduleInputSchema } from "@/server/http/schemas/duty-schedules.schema";
import { dutySchedulesService } from "@/server/services/duty-schedules.service";

// Launches an expediente (one event per day, roster published, one notice
// per person).
export const POST = bffRoute(async (request) => {
  const input = await readBody(request, dutyScheduleInputSchema);
  return NextResponse.json(
    await dutySchedulesService.create(await requireToken(), input),
  );
});
