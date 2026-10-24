import type { Tone } from "@/design-system";
import type { AbsenceStatus, AbsenceType } from "@/shared/contracts/absences";

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  FERIAS: "Férias",
  LICENCA: "Licença",
  DISPENSA_MEDICA: "Dispensa médica",
  MISSAO: "Missão",
  CURSO: "Curso",
  OUTRO: "Outro motivo",
};

export const ABSENCE_TYPES = Object.keys(ABSENCE_TYPE_LABELS) as AbsenceType[];

export const ABSENCE_STATUS: Record<
  AbsenceStatus,
  { label: string; tone: Tone }
> = {
  PENDENTE: { label: "Aguardando análise", tone: "warning" },
  APROVADA: { label: "Aprovada", tone: "success" },
  RECUSADA: { label: "Recusada", tone: "danger" },
  CANCELADA: { label: "Cancelada", tone: "neutral" },
};

/** "2026-11-10" → "10/11/2026". */
export const formatDate = (localDate: string) =>
  localDate.split("-").reverse().join("/");

export function formatPeriod(startsOn: string, endsOn: string): string {
  return startsOn === endsOn
    ? formatDate(startsOn)
    : `${formatDate(startsOn)} a ${formatDate(endsOn)}`;
}
