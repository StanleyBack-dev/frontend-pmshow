import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { bandFunctionPatchSchema } from "@/server/http/schemas/band-functions.schema";
import { idSchema } from "@/server/http/schemas/fields";
import { bandFunctionsService } from "@/server/services/band-functions.service";

// Rename, or archive/restore.
export const PATCH = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const input = await readBody(request, bandFunctionPatchSchema);
  return NextResponse.json(
    await bandFunctionsService.update(await requireToken(), id, input),
  );
});
