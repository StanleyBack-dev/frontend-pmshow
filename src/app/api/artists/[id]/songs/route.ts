import { NextResponse } from "next/server";
import { bffRoute, requireToken } from "@/server/http/route-handler";
import { idSchema } from "@/server/http/schemas/fields";
import { repertoireService } from "@/server/services/repertoire.service";
import type { SongListItem } from "@/shared/contracts/repertoire";

// Songs of one artist still in the repertoire (drawer of /cantores).
export const GET = bffRoute<{ id: string }>(async (_request, { params }) => {
  const artistId = idSchema.parse((await params).id);
  const { songs } = await repertoireService.songs(await requireToken(), {
    artistId,
    archived: false,
    page: 1,
    limit: 100,
  });
  return NextResponse.json<SongListItem[]>(songs.items);
});
