import { NextResponse } from "next/server";
import { z } from "zod";
import { takeResetToken } from "@/server/auth/session";
import { BackendError } from "@/server/http/backend-error";
import { bffRoute, readBody } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

const schema = z.object({ newPassword: z.string().min(1).max(128) });

export const POST = bffRoute(async (request) => {
  const { newPassword } = await readBody(request, schema);
  const resetToken = await takeResetToken();
  if (!resetToken) {
    throw new BackendError(
      400,
      "AUTH_RECOVERY_INVALID_RESET",
      "O prazo para redefinir a senha expirou. Comece novamente.",
    );
  }
  await authService.resetPassword(resetToken, newPassword);
  return NextResponse.json({ ok: true });
});
