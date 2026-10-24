import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { notificationsService } from "@/server/services/notifications.service";

export const POST = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  await notificationsService.markRead(await requireToken(), id);
  return NextResponse.json({ ok: true });
});
