import type { Tone } from "@/design-system";
import { SECTION_LABELS } from "@/features/members/model/member-labels";
import type {
  DutyAudienceKind,
  DutySchedule,
  DutyScheduleStatus,
} from "@/shared/contracts/duty-schedules";

export const AUDIENCE_LABELS: Record<DutyAudienceKind, string> = {
  ALL: "Toda a banda",
  SECTIONS: "Naipes",
  MEMBERS: "Músicos escolhidos",
};

export const DUTY_STATUS: Record<
  DutyScheduleStatus,
  { label: string; tone: Tone }
> = {
  ATIVA: { label: "Ativo", tone: "success" },
  CANCELADA: { label: "Cancelado", tone: "danger" },
};

/** "Toda a banda", "Metais, Percussão" or "Músicos escolhidos". */
export const audienceText = (
  schedule: Pick<DutySchedule, "audienceKind" | "sections">,
) =>
  schedule.audienceKind === "SECTIONS"
    ? schedule.sections.map((item) => SECTION_LABELS[item]).join(", ")
    : AUDIENCE_LABELS[schedule.audienceKind];

/** "2026-11-03" → "03/11/2026". */
export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

/** "03/11/2026 a 09/11/2026" (one date when it is a single day). */
export const periodText = (startsOn: string, endsOn: string) =>
  startsOn === endsOn
    ? formatDate(startsOn)
    : `${formatDate(startsOn)} a ${formatDate(endsOn)}`;

// Calendar dates as YYYY-MM-DD strings, computed at noon UTC so no timezone
// shifts the day.
const at = (date: string) => new Date(`${date}T12:00:00Z`);
const iso = (date: Date) => date.toISOString().slice(0, 10);

export const addDays = (date: string, days: number) => {
  const next = at(date);
  next.setUTCDate(next.getUTCDate() + days);
  return iso(next);
};

/** 0 = domingo … 6 = sábado. */
export const weekdayOf = (date: string) => at(date).getUTCDay();

/** Monday to Sunday of the week that holds `date`. */
export function weekDates(date: string): string[] {
  const monday = addDays(date, -((weekdayOf(date) + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

/** Every day of a month ("2026-11"). */
export function monthDates(month: string): string[] {
  const first = `${month}-01`;
  const dates: string[] = [];
  for (let day = first; day.startsWith(month); day = addDays(day, 1)) {
    dates.push(day);
  }
  return dates;
}

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

/** "seg, 03/11". */
export const dayLabel = (date: string) => {
  const [, month, day] = date.split("-");
  return `${WEEKDAYS[weekdayOf(date)]}, ${day}/${month}`;
};
