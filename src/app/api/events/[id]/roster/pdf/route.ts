import { NextResponse } from "next/server";
import { BackendError } from "@/server/http/backend-error";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { buildRosterPdf } from "@/server/pdf/roster-pdf";
import { eventsService } from "@/server/services/events.service";
import { rostersService } from "@/server/services/rosters.service";
import { localDay } from "@/shared/lib/datetime";

const slug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "evento";

// The roster as a PDF. The API decides who may see it (drafts only for
// managers, published only for the people on it or managers).
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  const token = await requireToken();
  const [event, roster] = await Promise.all([
    eventsService.get(token, id),
    rostersService.get(token, id),
  ]);
  if (!roster) {
    throw new BackendError(
      404,
      "ROSTER_NOT_FOUND",
      "Escala não encontrada ou sem acesso.",
    );
  }

  const bytes = await buildRosterPdf(event, roster, new Date());
  const fileName = `escala-${slug(event.title)}-${localDay(event.startsAt)}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
});
