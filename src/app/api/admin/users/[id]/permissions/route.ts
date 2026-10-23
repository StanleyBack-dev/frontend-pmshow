import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import {
  permissionSchema,
  userIdSchema,
} from "@/server/http/schemas/user.schema";
import { adminService } from "@/server/services/admin.service";

// `permissions: null` restores the group defaults.
const schema = z.object({ permissions: z.array(permissionSchema).nullable() });

export const PUT = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = userIdSchema.parse((await params).id);
  const { permissions } = await readBody(request, schema);
  return NextResponse.json(
    await adminService.setPermissions(await requireToken(), id, permissions),
  );
});
