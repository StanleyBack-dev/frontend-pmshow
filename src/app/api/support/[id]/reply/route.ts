import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { supportReplySchema } from "@/server/http/schemas/support.schema";
import { supportService } from "@/server/services/support.service";

// An administrator answers a support request.
export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { reply } = await readBody(request, supportReplySchema);
  return NextResponse.json(
    await supportService.reply(await requireToken(), id, reply),
  );
});
