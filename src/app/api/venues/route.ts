import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { venueInputSchema } from "@/server/http/schemas/events.schema";
import { eventsService } from "@/server/services/events.service";

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, venueInputSchema);
  return NextResponse.json(
    await eventsService.createVenue(await requireToken(), input),
  );
});
