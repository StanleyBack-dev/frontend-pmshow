import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { broadcastSchema } from "@/server/http/schemas/broadcasts.schema";
import { broadcastsService } from "@/server/services/broadcasts.service";

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, broadcastSchema);
  return NextResponse.json(
    await broadcastsService.send(await requireToken(), input),
  );
});
