import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { rostersService } from "@/server/services/rosters.service";

// Only the roster, to read (who goes and their answers): the events table's
// details and the "Escalados" dialog. The API decides what each one sees.
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  return NextResponse.json({
    roster: await rostersService.get(await requireToken(), id),
  });
});
