import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

const schema = z.object({ login: z.string().trim().min(1).max(254) });

export const POST = bffRoute(async (request) => {
  const { login } = await readBody(request, schema);
  await authService.requestRecovery(login);
  return NextResponse.json({ ok: true });
});
