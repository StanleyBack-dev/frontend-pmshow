import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { enrollmentDataSchema } from "@/server/http/schemas/enrollment.schema";
import { idSchema } from "@/server/http/schemas/fields";
import { userGroupSchema } from "@/server/http/schemas/user.schema";
import { enrollmentService } from "@/server/services/enrollment.service";

const schema = z.discriminatedUnion("action", [
  // Approve with the data as the manager corrected it and the chosen group.
  z.object({
    action: z.literal("approve"),
    data: enrollmentDataSchema,
    group: userGroupSchema,
  }),
  z.object({
    action: z.literal("reject"),
    reason: z.string().trim().min(3).max(500),
  }),
]);

// Review of a sign-up: approving returns the new account's temporary access.
export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const body = await readBody(request, schema);
  const token = await requireToken();
  return NextResponse.json(
    body.action === "approve"
      ? await enrollmentService.approve(token, id, body.data, body.group)
      : await enrollmentService.reject(token, id, body.reason),
  );
});
