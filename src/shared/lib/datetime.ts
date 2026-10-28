// Dates are entered and shown in Goiás time. Brazil has had no daylight
// saving time since 2019, so the offset is a fixed -03:00; it lives only here
// should that ever change.
export const TIME_ZONE = "America/Sao_Paulo";
const OFFSET = "-03:00";
const OFFSET_MS = -3 * 60 * 60 * 1000;

/** "2026-11-15T19:00" (datetime-local input) → ISO instant with offset. */
export function fromLocalInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  return `${value}:00${OFFSET}`;
}

/** ISO instant → "2026-11-15T19:00" for a datetime-local input. */
export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(new Date(iso).getTime() + OFFSET_MS)
    .toISOString()
    .slice(0, 16);
}

/** Calendar day (YYYY-MM-DD) of an instant, in Goiás time. */
export function localDay(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Date(date.getTime() + OFFSET_MS).toISOString().slice(0, 10);
}

/** "2026-11" → the month's [from, to) instants, for the API filter. */
export function monthRange(month: string): { from: string; to: string } {
  const [year, monthIndex] = month.split("-").map(Number);
  const next = monthIndex === 12 ? [year + 1, 1] : [year, monthIndex + 1];
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    from: `${year}-${pad(monthIndex)}-01T00:00:00${OFFSET}`,
    to: `${next[0]}-${pad(next[1])}-01T00:00:00${OFFSET}`,
  };
}

/** "2026-11-15" → the day's [from, to) instants, for the API filter. */
export function dayRange(day: string): { from: string; to: string } {
  const start = new Date(`${day}T00:00:00${OFFSET}`);
  const next = new Date(start.getTime() + 86_400_000);
  return { from: start.toISOString(), to: next.toISOString() };
}

export function isDay(value: string | undefined): value is string {
  return Boolean(
    value &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00${OFFSET}`).getTime()),
  );
}

/** Current month as "YYYY-MM", in Goiás time. */
export function currentMonth(now: Date): string {
  return localDay(now).slice(0, 7);
}

export function isMonth(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value));
}

/** "2026-11" shifted by `delta` months. */
export function shiftMonth(month: string, delta: number): string {
  const [year, monthIndex] = month.split("-").map(Number);
  const total = year * 12 + (monthIndex - 1) + delta;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});
const dayFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
});
const fullDayFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const numericDateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const shortDayFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
});
const monthFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  month: "long",
  year: "numeric",
});

export const formatTime = (iso: string) => timeFormat.format(new Date(iso));
/** "sábado, 15 de novembro". */
export const formatLongDay = (iso: string) => dayFormat.format(new Date(iso));
/** "sábado, 15 de novembro de 2026" (documents). */
export const formatFullDay = (iso: string) =>
  fullDayFormat.format(new Date(iso));
/** "15/11/2026, 19:00". */
export const formatDateTime = (iso: string) =>
  numericDateTimeFormat.format(new Date(iso));
/** "sáb., 15 de nov.". */
export const formatShortDay = (iso: string) =>
  shortDayFormat.format(new Date(iso));
/** { weekday: "sáb", day: "15", month: "nov" }: a calendar-style date chip. */
export function dateParts(iso: string) {
  const parts = Object.fromEntries(
    shortDayFormat
      .formatToParts(new Date(iso))
      .map((part) => [part.type, part.value.replace(".", "")]),
  );
  return {
    weekday: parts.weekday ?? "",
    day: parts.day ?? "",
    month: parts.month ?? "",
  };
}
/** "2026-11" → "novembro de 2026". */
export const formatMonth = (month: string) =>
  monthFormat.format(new Date(`${month}-01T12:00:00Z`));
