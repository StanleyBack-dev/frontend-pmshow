import { NextResponse } from "next/server";
import { z } from "zod";
import { writeSession } from "@/server/auth/session";
import { bffRoute, readBody } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

const schema = z.object({
  login: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(128),
});

export const POST = bffRoute(async (request) => {
  const input = await readBody(request, schema);
  const { tokens, user } = await authService.login(input.login, input.password);
  await writeSession(tokens);
  return NextResponse.json({ mustChangePassword: user.mustChangePassword });
});
