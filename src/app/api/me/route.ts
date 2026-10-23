import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
});

export const PATCH = bffRoute(async (request) => {
  const input = await readBody(request, schema);
  return NextResponse.json(
    await authService.updateProfile(await requireToken(), input),
  );
});
