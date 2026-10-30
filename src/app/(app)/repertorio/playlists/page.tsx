import type { Metadata } from "next";
import { PageHeader, SegmentedNav } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { PlaylistsBoard } from "@/features/playlists/components/PlaylistsBoard";
import { RepertoireTabs } from "@/features/repertoire/components/RepertoireTabs";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { playlistsService } from "@/server/services/playlists.service";
import { can } from "@/shared/lib/access";
import { firstParam, type RawSearchParams } from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Playlists" };

// Rehearsal mode: lists of songs played in order, with repeat and speed in
// the player. Each person's own and the ones shared with the band.
export default async function PlaylistsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "REPERTOIRE_READ")) return <AccessDenied />;
  // "Minhas" by default; "?aba=banda": the ones shared with everyone.
  const band = firstParam(await searchParams, "aba") === "banda";
  const all = await authed((token) => playlistsService.list(token));
  const mine = all.filter((playlist) => playlist.ownerId === user.id);
  const shared = all.filter((playlist) => playlist.shared);

  return (
    <>
      <PageHeader
        title="Repertório"
        description="Playlists para ensaiar: as músicas tocam em sequência, com repetição e controle de velocidade."
      />
      <RepertoireTabs active="playlists" />
      <div className="mb-4">
        <SegmentedNav
          label="Playlists"
          items={[
            {
              label: "Minhas",
              href: "/repertorio/playlists",
              active: !band,
              count: mine.length,
            },
            {
              label: "Da banda",
              href: "/repertorio/playlists?aba=banda",
              active: band,
              count: shared.length,
            },
          ]}
        />
      </div>
      <PlaylistsBoard
        playlists={band ? shared : mine}
        viewerId={user.id}
        tab={band ? "band" : "mine"}
        canSearchYoutube={can(user, "REPERTOIRE_MANAGE")}
      />
    </>
  );
}
