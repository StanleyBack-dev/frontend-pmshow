import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { systemLogsService } from "@/server/services/system-logs.service";

const schema = z.object({
  message: z.string().trim().min(1).max(1000),
  // Only the path: query strings may carry personal data.
  url: z.string().trim().min(1).max(300),
  digest: z.string().trim().max(100).nullable(),
});

// A screen of the app failed to load: goes to the system log (and, at most
// once a while, to the ADMIN_MASTER).
export const POST = bffRoute(async (request) => {
  const report = await readBody(request, schema);
  await systemLogsService.reportClientError(await requireToken(), report);
  return NextResponse.json({ ok: true });
});
