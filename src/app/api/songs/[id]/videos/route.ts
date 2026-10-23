import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";

const schema = z.object({
  link: z.string().trim().min(5).max(300),
  title: z
    .string()
    .max(160)
    .nullish()
    .transform((value) => value?.trim() || null),
});

export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const songId = idSchema.parse((await params).id);
  const { link, title } = await readBody(request, schema);
  return NextResponse.json(
    await repertoireService.addVideo(await requireToken(), {
      songId,
      link,
      title,
    }),
  );
});
