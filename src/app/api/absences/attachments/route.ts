import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { attachmentUploadsSchema } from "@/server/http/schemas/absences.schema";
import { absencesService } from "@/server/services/absences.service";

// Signed forms for the files of an absence request: the browser then sends
// each file straight to storage (never through this server).
export const POST = bffRoute(async (request) => {
  const { files } = await readBody(request, attachmentUploadsSchema);
  return NextResponse.json(
    await absencesService.requestAttachmentUploads(await requireToken(), files),
  );
});
