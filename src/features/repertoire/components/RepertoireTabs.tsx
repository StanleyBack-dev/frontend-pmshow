import { SegmentedNav } from "@/design-system";

/** Repertório's two views: the songs and the playlists (rehearsal mode). */
export function RepertoireTabs({ active }: { active: "songs" | "playlists" }) {
  return (
    <div className="mb-4">
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
    </div>
  );
}
