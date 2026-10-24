import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { eventStatusSchema } from "@/server/http/schemas/events.schema";
import { idSchema } from "@/server/http/schemas/fields";
import { eventsService } from "@/server/services/events.service";

export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { status, reason } = await readBody(request, eventStatusSchema);
  return NextResponse.json(
    await eventsService.changeStatus(await requireToken(), id, status, reason),
  );
});
