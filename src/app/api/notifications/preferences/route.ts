import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { notificationPreferenceSchema } from "@/server/http/schemas/rosters.schema";
import { notificationsService } from "@/server/services/notifications.service";

export const PUT = bffRoute(async (request) => {
  const { type, emailEnabled } = await readBody(
    request,
    notificationPreferenceSchema,
  );
  return NextResponse.json(
    await notificationsService.setPreference(
      await requireToken(),
      type,
      emailEnabled,
    ),
  );
});
