import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { instrumentInputSchema } from "@/server/http/schemas/repertoire.schema";
import { membersService } from "@/server/services/members.service";

// Rename, move to another section, or archive/restore.
const schema = instrumentInputSchema
  .partial()
  .extend({ archived: z.boolean().optional() });

export const PATCH = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const input = await readBody(request, schema);
  return NextResponse.json(
    await membersService.updateInstrument(await requireToken(), id, input),
  );
});
