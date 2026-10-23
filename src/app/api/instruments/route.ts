import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { instrumentInputSchema } from "@/server/http/schemas/repertoire.schema";
import { membersService } from "@/server/services/members.service";

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, instrumentInputSchema);
  return NextResponse.json(
    await membersService.createInstrument(await requireToken(), input),
  );
});
