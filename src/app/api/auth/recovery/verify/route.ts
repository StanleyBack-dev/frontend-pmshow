import { NextResponse } from "next/server";
import { z } from "zod";
import { writeResetToken } from "@/server/auth/session";
import { bffRoute, readBody } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

const schema = z.object({
  login: z.string().trim().min(1).max(254),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/),
});

// The reset token never reaches browser JavaScript: it waits in an httpOnly
// cookie for the last step.
export const POST = bffRoute(async (request) => {
  const { login, code } = await readBody(request, schema);
  await writeResetToken(await authService.verifyRecoveryCode(login, code));
  return NextResponse.json({ ok: true });
});
