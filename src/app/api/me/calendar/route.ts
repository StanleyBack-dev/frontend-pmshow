import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { calendarService } from "@/server/services/calendar.service";

// The signed-in person's agenda link: create a new one (the old one stops
// working) or turn it off.
export const POST = bffRoute(async () =>
  NextResponse.json(await calendarService.renew(await requireToken())),
);

export const DELETE = bffRoute(async () => {
  await calendarService.remove(await requireToken());
  return NextResponse.json({ ok: true });
});
