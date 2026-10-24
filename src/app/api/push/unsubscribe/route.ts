import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { pushEndpointSchema } from "@/server/http/schemas/notifications.schema";
import { notificationsService } from "@/server/services/notifications.service";

export const POST = bffRoute(async (request) => {
  const { endpoint } = await readBody(request, pushEndpointSchema);
  await notificationsService.unsubscribePush(await requireToken(), endpoint);
  return NextResponse.json({ ok: true });
});
