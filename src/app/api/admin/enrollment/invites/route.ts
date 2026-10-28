import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { enrollmentInviteSchema } from "@/server/http/schemas/enrollment.schema";
import { enrollmentService } from "@/server/services/enrollment.service";

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, enrollmentInviteSchema);
  return NextResponse.json(
    await enrollmentService.createInvite(await requireToken(), input),
  );
});
