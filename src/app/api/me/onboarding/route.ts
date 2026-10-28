import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

// The guided tour was finished or skipped: it is not shown again.
export const POST = bffRoute(async () => {
  await authService.completeOnboarding(await requireToken());
  return NextResponse.json({ ok: true });
});
