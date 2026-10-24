import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { venueInputSchema } from "@/server/http/schemas/events.schema";
import { idSchema } from "@/server/http/schemas/fields";
import { eventsService } from "@/server/services/events.service";

export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const input = await readBody(request, venueInputSchema);
  return NextResponse.json(
    await eventsService.updateVenue(await requireToken(), id, input),
  );
});
