import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { membersService } from "@/server/services/members.service";

// Members whose band profile lists the instrument (the band is small: one
// page of 100 covers it).
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { items } = await membersService.roster(await requireToken(), {
    instrumentId: id,
    withProfile: true,
    page: 1,
    limit: 100,
  });
  return NextResponse.json(items);
});
