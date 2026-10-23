import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import {
  userIdSchema,
  userInputSchema,
} from "@/server/http/schemas/user.schema";
import { adminService } from "@/server/services/admin.service";

export const PATCH = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = userIdSchema.parse((await params).id);
  const input = await readBody(request, userInputSchema.partial());
  return NextResponse.json(
    await adminService.updateUser(await requireToken(), id, input),
  );
});
