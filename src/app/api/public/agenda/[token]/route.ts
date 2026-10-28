import { NextResponse } from "next/server";
import { bffRoute } from "@/server/http/route-handler";
import { calendarService } from "@/server/services/calendar.service";

// A person's agenda (iCal), read by Google Calendar or the iPhone with no
// session: the random token in the address is the key. "<token>.ics".
export const GET = bffRoute<{ token: string }>(async (_request, { params }) => {
  const token = (await params).token.replace(/\.ics$/, "");
  const ics = /^[A-Za-z0-9_-]{20,64}$/.test(token)
    ? await calendarService.ics(token)
    : null;
  if (!ics) {
    return new NextResponse("Link de agenda inválido ou desativado.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="pmshow.ics"',
      // Calendar apps poll it; never keep an old copy in between.
      "Cache-Control": "private, no-store",
    },
  });
});
