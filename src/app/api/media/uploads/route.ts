import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { audioUploadRequestSchema } from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";

// Step 1 of an audio upload: returns a signed form. The browser then sends
// the file straight to storage (never through this server), and confirms.
export const POST = bffRoute(async (request) => {
  const input = await readBody(request, audioUploadRequestSchema);
  return NextResponse.json(
    await repertoireService.requestAudioUpload(await requireToken(), input),
  );
});
