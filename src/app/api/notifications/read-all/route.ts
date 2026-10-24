import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { notificationsService } from "@/server/services/notifications.service";

export const POST = bffRoute(async () => {
  const marked = await notificationsService.markAllRead(await requireToken());
  return NextResponse.json({ marked });
});
