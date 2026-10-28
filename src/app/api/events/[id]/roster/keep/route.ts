import { NextResponse } from "next/server";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { keepOnRosterSchema } from "@/server/http/schemas/rosters.schema";
import { rostersService } from "@/server/services/rosters.service";

// A manager doesn't accept a swap request: the person stays on the roster.
export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { userId, note } = await readBody(request, keepOnRosterSchema);
  await rostersService.keepOnRoster(await requireToken(), id, userId, note);
  return NextResponse.json({ ok: true });
});
