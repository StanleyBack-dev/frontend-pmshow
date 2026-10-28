import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { slug } from "@/server/pdf/pdf-kit";
import { buildSetlistPdf } from "@/server/pdf/setlist-pdf";
import { eventsService } from "@/server/services/events.service";
import { localDay } from "@/shared/lib/datetime";

// The event's list of songs as a PDF (whoever can see the event).
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  const event = await eventsService.get(await requireToken(), id);
  const bytes = await buildSetlistPdf(event, new Date());
  const fileName = `musicas-${slug(event.title)}-${localDay(event.startsAt)}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
});
