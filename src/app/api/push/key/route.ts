import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { notificationsService } from "@/server/services/notifications.service";

// VAPID public key for PushManager.subscribe (null = push off on the server).
export const GET = bffRoute(async () => {
  const key = await notificationsService.pushPublicKey(await requireToken());
  return NextResponse.json({ key });
});
