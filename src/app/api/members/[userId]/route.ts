import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import {
  idSchema,
  memberProfileInputSchema,
} from "@/server/http/schemas/repertoire.schema";
import { membersService } from "@/server/services/members.service";

export const PUT = bffRoute<{ userId: string }>(async (request, { params }) => {
  const userId = idSchema.parse((await params).userId);
  const input = await readBody(request, memberProfileInputSchema);
  return NextResponse.json(
    await membersService.saveProfile(await requireToken(), userId, input),
  );
});
