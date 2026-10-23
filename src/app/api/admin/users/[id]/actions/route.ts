import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { userIdSchema } from "@/server/http/schemas/user.schema";
import { adminService } from "@/server/services/admin.service";

const schema = z.object({
  action: z.enum([
    "activate",
    "deactivate",
    "reset-password",
    "unlock",
    "revoke-sessions",
  ]),
});

// Account actions of the user detail page. Returns the updated account, or
// the temporary access for "reset-password".
export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = userIdSchema.parse((await params).id);
  const { action } = await readBody(request, schema);
  const token = await requireToken();

  switch (action) {
    case "activate":
      return NextResponse.json(await adminService.setActive(token, id, true));
    case "deactivate":
      return NextResponse.json(await adminService.setActive(token, id, false));
    case "reset-password":
      return NextResponse.json(await adminService.resetPassword(token, id));
    case "unlock":
      return NextResponse.json(await adminService.unlock(token, id));
    case "revoke-sessions":
      return NextResponse.json(await adminService.revokeSessions(token, id));
  }
});
