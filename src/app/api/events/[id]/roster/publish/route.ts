import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { rostersService } from "@/server/services/rosters.service";

export const POST = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  return NextResponse.json(
    await rostersService.publish(await requireToken(), id),
  );
});
