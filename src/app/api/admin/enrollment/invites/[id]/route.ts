import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { enrollmentService } from "@/server/services/enrollment.service";

// Revokes the cohort code: forms opened with it stop being accepted.
export const DELETE = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  return NextResponse.json(
    await enrollmentService.revokeInvite(await requireToken(), id),
  );
});
