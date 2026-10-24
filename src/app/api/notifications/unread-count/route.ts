import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { notificationsService } from "@/server/services/notifications.service";

// Polled by the bell in the header.
export const GET = bffRoute(async () => {
  const count = await notificationsService.unreadCount(await requireToken());
  return NextResponse.json({ count });
});
