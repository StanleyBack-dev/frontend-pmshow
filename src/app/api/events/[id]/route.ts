import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { eventInputSchema } from "@/server/http/schemas/events.schema";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { eventsService } from "@/server/services/events.service";

export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const input = await readBody(request, eventInputSchema);
  return NextResponse.json(
    await eventsService.update(await requireToken(), id, input),
  );
});
