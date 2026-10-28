import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { membersService } from "@/server/services/members.service";

// Members whose band profile lists the function (one page of 100 covers the
// band).
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { items } = await membersService.roster(await requireToken(), {
    functionId: id,
    withProfile: true,
    page: 1,
    limit: 100,
  });
  return NextResponse.json(items);
});
