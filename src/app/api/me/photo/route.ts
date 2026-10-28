import { NextResponse } from "next/server";
import { z } from "zod";
import { bffRoute, readBody, requireToken } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

const schema = z.object({
  /** Base64 of the photo the browser shrank (the API checks the content). */
  photo: z
    .string()
    .max(2_800_000)
    .regex(/^[A-Za-z0-9+/]+={0,2}$/),
});

// The signed-in user's profile photo ("Meu perfil").
export const PUT = bffRoute(async (request) => {
  const { photo } = await readBody(request, schema);
  return NextResponse.json({
    photoUrl: await authService.setPhoto(await requireToken(), photo),
  });
});

export const DELETE = bffRoute(async () => {
  await authService.removePhoto(await requireToken());
  return NextResponse.json({ ok: true });
});
