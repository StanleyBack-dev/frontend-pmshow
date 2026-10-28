import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { supportService } from "@/server/services/support.service";

// An administrator closes a support request.
export const POST = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  return NextResponse.json(
    await supportService.finalize(await requireToken(), id),
  );
});
