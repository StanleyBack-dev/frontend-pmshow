import { Badge } from "@/design-system";
import { AbsenceActions } from "@/features/availability/components/AbsenceActions";
import {
  ABSENCE_STATUS,
  ABSENCE_TYPE_LABELS,
  formatPeriod,
} from "@/features/availability/model/absence-labels";
import type { Absence } from "@/shared/contracts/absences";

// Mirrors the API's cancel rule so the button only shows when it works.
function cancellable(
  absence: Absence,
  viewer: { id: string; isManager: boolean; today: string },
): boolean {
  if (absence.status !== "PENDENTE" && absence.status !== "APROVADA") {
    return false;
  }
  if (viewer.isManager) return true;
  return (
    absence.userId === viewer.id &&
    (absence.status === "PENDENTE" || absence.endsOn >= viewer.today)
  );
}

export function AbsenceList({
  absences,
  viewer,
  showPerson,
  empty,
}: {
  absences: Absence[];
  viewer: { id: string; isManager: boolean; today: string };
  showPerson: boolean;
  empty: string;
}) {
  if (absences.length === 0) {
    return <p className="text-sm text-muted">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {absences.map((absence) => {
        const status = ABSENCE_STATUS[absence.status];
        return (
          <li key={absence.id} className="space-y-2 px-3 py-3 text-sm">
            <div className="flex flex-wrap items-start gap-2">
              <div className="min-w-0 flex-1">
                {showPerson && (
                  <p className="font-medium text-fg">
                    {absence.warName ?? absence.userName}
                  </p>
                )}
                <p
                  className={showPerson ? "text-muted" : "font-medium text-fg"}
                >
                  {ABSENCE_TYPE_LABELS[absence.type]} ·{" "}
                  {formatPeriod(absence.startsOn, absence.endsOn)}
                </p>
                {absence.reason && (
                  <p className="text-xs text-soft">{absence.reason}</p>
                )}
                {absence.reviewNote && (
                  <p className="text-xs text-muted">
                    Gestor: {absence.reviewNote}
                  </p>
                )}
              </div>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <AbsenceActions
              absence={absence}
              canReview={viewer.isManager && absence.userId !== viewer.id}
              canCancel={cancellable(absence, viewer)}
            />
          </li>
        );
      })}
    </ul>
  );
}
