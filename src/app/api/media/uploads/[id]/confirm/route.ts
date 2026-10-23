import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/repertoire.schema";
import { repertoireService } from "@/server/services/repertoire.service";

const schema = z.object({
  durationSeconds: z
    .number()
    .positive()
    .max(24 * 60 * 60)
    .nullish()
    .transform((value) => (value ? Math.round(value) : null)),
});

// Step 2: the API checks the file is in storage and publishes it.
export const POST = bffRoute<{ id: string }>(async (request, { params }) => {
  const id = idSchema.parse((await params).id);
  const { durationSeconds } = await readBody(request, schema);
  return NextResponse.json(
    await repertoireService.confirmAudioUpload(
      await requireToken(),
      id,
      durationSeconds,
    ),
  );
});
