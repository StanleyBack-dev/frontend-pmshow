import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

const schema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(1).max(128),
});

// Also used by the first access (the "current" password is the temporary one).
export const POST = bffRoute(async (request) => {
  const input = await readBody(request, schema);
  await authService.changePassword(await requireToken(), input);
  return NextResponse.json({ ok: true });
});
