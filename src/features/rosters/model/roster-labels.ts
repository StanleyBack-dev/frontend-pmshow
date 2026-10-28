import type { Tone } from "@/design-system";
import { SECTIONS } from "@/features/members/model/member-labels";
import type { Section } from "@/shared/contracts/members";
import type {
  AckStatus,
  CandidateBlocker,
  Roster,
} from "@/shared/contracts/rosters";

/** The function of whoever plays (seeded by the migration). */
export const MUSICIAN_FUNCTION = "Músico";

/** Musicians (the "Músico" function, or none on old lines). */
export const isMusicianFunction = (name: string | null | undefined) =>
  !name || name.toLocaleLowerCase("pt-BR") === "músico";

/** "Regente / maestro · Trompete", "Músico · Trompete" or "Músico". */
export const lineRole = (
  functionName: string | null,
  instrumentName: string | null,
) =>
  [functionName ?? MUSICIAN_FUNCTION, instrumentName]
    .filter(Boolean)
    .join(" · ");

export const ACK_STATUS: Record<AckStatus, { label: string; tone: Tone }> = {
  PENDENTE: { label: "Aguardando ciência", tone: "warning" },
  CIENTE: { label: "Ciente", tone: "success" },
  TROCA_SOLICITADA: { label: "Pediu troca", tone: "danger" },
};

export const BLOCKER_LABELS: Record<CandidateBlocker, string> = {
  NO_PROFILE: "Sem cadastro na banda",
  INACTIVE: "Inativo",
  AWAY: "Afastado",
  ABSENT: "Indisponível",
};

const sectionRank = (section: Section | undefined) =>
  section ? SECTIONS.indexOf(section) : SECTIONS.length;

/** Other functions first (by name), then musicians by section and name. */
export function sortedLines(roster: Pick<Roster, "assignments">) {
  return [...roster.assignments].sort(
    (a, b) =>
      Number(isMusicianFunction(a.functionName)) -
        Number(isMusicianFunction(b.functionName)) ||
      (isMusicianFunction(a.functionName) ? "" : a.functionName!).localeCompare(
        isMusicianFunction(b.functionName) ? "" : b.functionName!,
      ) ||
      sectionRank(a.person?.section) - sectionRank(b.person?.section) ||
      (a.person?.warName ?? "").localeCompare(b.person?.warName ?? ""),
  );
}
