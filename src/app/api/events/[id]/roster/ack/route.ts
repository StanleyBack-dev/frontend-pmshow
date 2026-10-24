import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { ackSchema } from "@/server/http/schemas/rosters.schema";
import { rostersService } from "@/server/services/rosters.service";

// The signed-in member answers: ciente, or asks to be replaced.
export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { answer, note } = await readBody(request, ackSchema);
  return NextResponse.json(
    await rostersService.acknowledge(await requireToken(), id, answer, note),
  );
});
