import { NextResponse } from "next/server";
import { writeEnrollmentToken } from "@/server/auth/session";
import { bffRoute, readBody } from "@/server/http/route-handler";
import { enrollmentCodeSchema } from "@/server/http/schemas/enrollment.schema";
import { enrollmentService } from "@/server/services/enrollment.service";

// Public sign-up, step 1: the cohort code. The form token never reaches
// browser JavaScript: it waits in an httpOnly cookie for the form.
export const POST = bffRoute(async (request) => {
  const { code } = await readBody(request, enrollmentCodeSchema);
  await writeEnrollmentToken(await enrollmentService.verifyCode(code));
  return NextResponse.json({ ok: true });
});
