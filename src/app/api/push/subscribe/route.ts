import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { pushSubscriptionSchema } from "@/server/http/schemas/notifications.schema";
import { notificationsService } from "@/server/services/notifications.service";

// Body: the browser's PushSubscription.toJSON().
export const POST = bffRoute(async (request) => {
  const { endpoint, keys } = await readBody(request, pushSubscriptionSchema);
  await notificationsService.subscribePush(await requireToken(), {
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
  });
  return NextResponse.json({ ok: true });
});
