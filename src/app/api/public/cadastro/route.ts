import { NextResponse } from "next/server";
import {
  clearEnrollmentToken,
  readEnrollmentToken,
} from "@/server/auth/session";
import { bffRoute, readBody } from "@/server/http/route-handler";
import { submitEnrollmentSchema } from "@/server/http/schemas/enrollment.schema";
import {
  enrollmentFormExpired,
  enrollmentService,
} from "@/server/services/enrollment.service";

// Public sign-up, step 2: the form. It waits for a manager's approval.
export const POST = bffRoute(async (request) => {
  const { data, consent, photo } = await readBody(
    request,
    submitEnrollmentSchema,
  );
  const token = await readEnrollmentToken();
  if (!token) throw enrollmentFormExpired();
  await enrollmentService.submit(token, data, consent, photo);
  await clearEnrollmentToken();
  return NextResponse.json({ ok: true });
});
