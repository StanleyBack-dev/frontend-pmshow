import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { adminService } from "@/server/services/admin.service";
import { AUDITED_ENTITIES } from "@/shared/contracts/api";

const querySchema = z.object({
  entidade: z.enum(AUDITED_ENTITIES),
  id: idSchema,
});

// Audit trail of one record (info button of the tables): ?entidade=&id=
export const GET = bffRoute(async (request) => {
  const { entidade, id } = querySchema.parse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  return NextResponse.json(
    await adminService.recordAudit(await requireToken(), entidade, id),
  );
});
