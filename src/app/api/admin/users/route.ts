import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { userInputSchema } from "@/server/http/schemas/user.schema";
import { adminService } from "@/server/services/admin.service";

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, userInputSchema);
  return NextResponse.json(
    await adminService.createUser(await requireToken(), input),
  );
});
