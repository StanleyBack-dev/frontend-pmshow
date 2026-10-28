import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { supportRequestSchema } from "@/server/http/schemas/support.schema";
import { supportService } from "@/server/services/support.service";

// Sends a support request (the API checks the daily limit).
export const POST = bffRoute(async (request) => {
  const input = await readBody(request, supportRequestSchema);
  return NextResponse.json(
    await supportService.send(await requireToken(), input),
  );
});
