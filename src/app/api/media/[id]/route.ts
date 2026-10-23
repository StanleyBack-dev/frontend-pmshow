import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";

const renameSchema = z.object({ title: z.string().trim().min(1).max(160) });

export const PATCH = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { title } = await readBody(request, renameSchema);
  return NextResponse.json(
    await repertoireService.renameMedia(await requireToken(), id, title),
  );
});

export const DELETE = bffRoute<{ id: string }>(async (_request, { params }) => {
  const id = idSchema.parse((await params).id);
  await repertoireService.removeMedia(await requireToken(), id);
  return NextResponse.json({ ok: true });
});
