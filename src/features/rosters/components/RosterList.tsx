import { Badge } from "@/design-system";
import {
  RANK_LABELS,
  SECTION_LABELS,
} from "@/features/members/model/member-labels";
import {
  ACK_STATUS,
  ROLE_LABELS,
  sortedLines,
} from "@/features/rosters/model/roster-labels";
import type { Roster } from "@/shared/contracts/rosters";

// Read-only roster: who goes, in which role, and each person's answer.
// Managers also see the justifications for accepted schedule conflicts.
export function RosterList({
  roster,
  viewerId,
  showManagerInfo,
}: {
  roster: Roster;
  viewerId: string;
  showManagerInfo: boolean;
}) {
  const lines = sortedLines(roster);
  const answered = lines.filter((line) => line.ackStatus === "CIENTE").length;

  return (
    <div className="space-y-3">
      {roster.status === "PUBLICADA" && (
        <p className="text-sm text-muted">
          {answered} de {lines.length} ciente{lines.length === 1 ? "" : "s"}.
        </p>
      )}
      {showManagerInfo && roster.uncoveredSections.length > 0 && (
        <p className="text-sm text-warning">
          Sem ninguém escalado:{" "}
          {roster.uncoveredSections.map((s) => SECTION_LABELS[s]).join(", ")}.
        </p>
      )}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {lines.map((line) => {
          const ack = ACK_STATUS[line.ackStatus];
          return (
            <li
              key={line.userId}
              className={
                line.userId === viewerId
                  ? "bg-accent-soft/40 px-3 py-2.5 text-sm"
                  : "px-3 py-2.5 text-sm"
              }
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-fg">
                    {line.person
                      ? `${RANK_LABELS[line.person.rank].short} ${line.person.warName}`
                      : "Conta desativada"}
                  </span>
                  <span className="block text-xs text-soft">
                    {[ROLE_LABELS[line.role], line.instrumentName]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                {roster.status === "PUBLICADA" && (
                  <Badge tone={ack.tone}>{ack.label}</Badge>
                )}
              </div>
              {line.notes && (
                <p className="mt-1 text-xs text-muted">{line.notes}</p>
              )}
              {line.ackStatus === "TROCA_SOLICITADA" && line.ackNote && (
                <p className="mt-1 text-xs text-danger">
                  Motivo da troca: {line.ackNote}
                </p>
              )}
              {showManagerInfo && line.overrideReason && (
                <p className="mt-1 text-xs text-warning">
                  Conflito de horário aceito: {line.overrideReason}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
