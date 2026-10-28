import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { localDateSchema } from "@/server/http/schemas/repertoire.schema";
import { membersService } from "@/server/services/members.service";

const schema = z.object({
  birthDate: localDateSchema.nullable(),
  joinedOn: localDateSchema.nullable(),
});

// The signed-in member's birthday and band start date ("Meu perfil").
export const PUT = bffRoute(async (request) => {
  const dates = await readBody(request, schema);
  return NextResponse.json(
    await membersService.saveMyDates(await requireToken(), dates),
  );
});
