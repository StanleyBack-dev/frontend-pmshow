import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { repertoireService } from "@/server/services/repertoire.service";

// Plain link target (<a href>): redirects to a signed URL that makes the
// browser save the file. Needs MEDIA_DOWNLOAD (checked by the API).
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  const url = await repertoireService.downloadUrl(await requireToken(), id);
  return NextResponse.redirect(url, {
    status: 302,
    headers: { "cache-control": "no-store" },
  });
});
