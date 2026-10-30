import type { ReactNode } from "react";
import { SegmentedNav } from "@/design-system";

/**
 * Repertório's two views: the songs and the playlists (rehearsal mode).
 * `aside` sits on the right (below on phones), e.g. the songs' shortcuts.
 */
export function RepertoireTabs({
  active,
  aside,
}: {
  active: "songs" | "playlists";
  aside?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <SegmentedNav
        label="Repertório"
        items={[
          { label: "Músicas", href: "/repertorio", active: active === "songs" },
          {
            label: "Playlists",
            href: "/repertorio/playlists",
            active: active === "playlists",
          },
        ]}
      />
      {aside}
    </div>
  );
}
