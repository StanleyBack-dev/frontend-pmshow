import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { eventsService } from "@/server/services/events.service";

const cepSchema = z.string().regex(/^\d{8}$/);

// Address of a CEP for the venue form (null: unknown CEP).
export const GET = bffRoute<{ cep: string }>(async (_request, { params }) => {
  const cep = cepSchema.parse((await params).cep);
  return NextResponse.json(
    await eventsService.zipCodeAddress(await requireToken(), cep),
  );
});
