import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { repertoireService } from "@/server/services/repertoire.service";

const schema = z.object({ archived: z.boolean() });

export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { archived } = await readBody(request, schema);
  return NextResponse.json(
    await repertoireService.setArchived(await requireToken(), id, archived),
  );
});
