import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { setlistSchema } from "@/server/http/schemas/events.schema";
import { idSchema } from "@/server/http/schemas/fields";
import { eventsService } from "@/server/services/events.service";

// Replaces the whole setlist with `items`, in that order.
export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { items } = await readBody(request, setlistSchema);
  await eventsService.setSetlist(await requireToken(), id, items);
  return NextResponse.json({ ok: true });
});
