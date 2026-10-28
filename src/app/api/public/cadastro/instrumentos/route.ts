import { NextResponse } from "next/server";
import { readEnrollmentToken } from "@/server/auth/session";
import { bffRoute } from "@/server/http/route-handler";
import {
  enrollmentFormExpired,
  enrollmentService,
} from "@/server/services/enrollment.service";

// Instruments offered on the form (only after a valid code).
export const GET = bffRoute(async () => {
  const token = await readEnrollmentToken();
  if (!token) throw enrollmentFormExpired();
  return NextResponse.json(await enrollmentService.instruments(token));
});
