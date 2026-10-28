import { Badge } from "@/design-system";
import { RANK_LABELS, isCivil } from "@/features/members/model/member-labels";
import type { Rank } from "@/shared/graphql/schema-enums";

// Full rank as a badge; civilians in another color, to tell them apart.
export function RankBadge({ rank }: { rank: Rank }) {
  return (
    <Badge tone={isCivil(rank) ? "info" : "accent"}>
      {RANK_LABELS[rank].label}
    </Badge>
  );
}
