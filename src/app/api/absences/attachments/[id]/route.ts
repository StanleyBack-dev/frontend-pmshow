import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { absencesService } from "@/server/services/absences.service";

// Opens an attachment (?baixar=1 saves it): a redirect to a short-lived link,
// handed out only to its owner or a manager. ?formato=json returns the link
// instead, so the page can show a loading state while it is made.
export const GET = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const query = new URL(request.url).searchParams;
  const download = query.get("baixar") === "1";
  const url = await absencesService.attachmentUrl(
    await requireToken(),
    id,
    download,
  );
  return query.get("formato") === "json"
    ? NextResponse.json({ url })
    : NextResponse.redirect(url);
});
