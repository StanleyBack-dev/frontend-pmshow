import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { bandFunctionInputSchema } from "@/server/http/schemas/band-functions.schema";
import { bandFunctionsService } from "@/server/services/band-functions.service";

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, bandFunctionInputSchema);
  return NextResponse.json(
    await bandFunctionsService.create(await requireToken(), input),
  );
});
