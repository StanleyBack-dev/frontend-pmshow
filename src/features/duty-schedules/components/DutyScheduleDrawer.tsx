"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardPlus,
  Clock,
  FileText,
  MapPin,
  Plus,
  Search,
  Users,
} from "lucide-react";
import {
  Button,
  Drawer,
  Field,
  FormSection,
  Select,
  TextArea,
  cn,
  inputClasses,
} from "@/design-system";
import { dutySchedulesClient } from "@/features/duty-schedules/api/duty-schedules.client";
import {
  AUDIENCE_LABELS,
  addDays,
  dayLabel,
  monthDates,
  periodText,
  weekDates,
  weekdayOf,
} from "@/features/duty-schedules/model/duty-labels";
import { VenueFormDrawer } from "@/features/events/components/VenueFormDrawer";
import { UNIFORMS, UNIFORM_LABELS } from "@/features/events/model/event-labels";
import {
  RANK_LABELS,
  SECTIONS,
  SECTION_LABELS,
} from "@/features/members/model/member-labels";
import type { DutyAudienceKind } from "@/shared/contracts/duty-schedules";
import type { EventUniform, Venue } from "@/shared/contracts/events";
import type { RosterEntry, Section } from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";
import { fromLocalInput, localDay } from "@/shared/lib/datetime";
import { useToast } from "@/shared/toast/useToast";

type Span = "week" | "month";
type DayRow = { work: boolean; start: string; end: string };

const DEFAULT_START = "08:00";
const DEFAULT_END = "17:00";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Weekdays are working days by default; weekends are off. */
const defaultRow = (date: string): DayRow => ({
  work: weekdayOf(date) !== 0 && weekdayOf(date) !== 6,
  start: DEFAULT_START,
  end: DEFAULT_END,
});

const minutes = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};

// Launches an expediente (Gestor, Administrador geral): a week or a month of
// working days, each with entrada and saída, for the whole band, some
// sections or chosen musicians. Each day becomes an "Expediente" event with
// its roster published; every person is told once (no acknowledgement).
export function DutyScheduleDrawer({
  venues,
  members,
  onClose,
  onSaved,
}: {
  venues: Venue[];
  /** The band (active profiles), to pick musicians. */
  members: RosterEntry[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const today = localDay(new Date());
  const { showError, showSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const [span, setSpan] = useState<Span>("week");
  const [weekOf, setWeekOf] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [rows, setRows] = useState<Record<string, DayRow>>({});
  const [sameHours, setSameHours] = useState(true);
  const [venueId, setVenueId] = useState("");
  // Venues created here join the list (and get selected).
  const [allVenues, setAllVenues] = useState(venues);
  const [creatingVenue, setCreatingVenue] = useState(false);
  const [uniform, setUniform] = useState<EventUniform | "">("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [audience, setAudience] = useState<DutyAudienceKind>("ALL");
  const [sections, setSections] = useState<Section[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const active = useMemo(
    () =>
      members
        .filter((entry) => entry.profile?.status === "ATIVO")
        .sort((a, b) =>
          (a.profile?.warName ?? a.name).localeCompare(
            b.profile?.warName ?? b.name,
          ),
        ),
    [members],
  );
  const dates = span === "week" ? weekDates(weekOf) : monthDates(month);
  const rowOf = (date: string) => rows[date] ?? defaultRow(date);
  const past = (date: string) => date < today;
  const working = dates.filter((date) => !past(date) && rowOf(date).work);
  const first = working[0];
  /** The hours a day really gets (the first day's, when they are shared). */
  const hoursOf = (date: string) =>
    sameHours && first ? rowOf(first) : rowOf(date);
  const setRow = (date: string, patch: Partial<DayRow>) =>
    setRows((current) => ({
      ...current,
      [date]: { ...(current[date] ?? defaultRow(date)), ...patch },
    }));

  const people =
    audience === "ALL"
      ? active.length
      : audience === "SECTIONS"
        ? active.filter(
            (entry) =>
              entry.profile && sections.includes(entry.profile.section),
          ).length
        : userIds.length;
  const term = normalize(query.trim());
  const visible = active.filter(
    (entry) =>
      !term ||
      normalize(`${entry.profile?.warName ?? ""} ${entry.name}`).includes(term),
  );

  function problem(): string | null {
    if (working.length === 0) return "Marque ao menos um dia de trabalho.";
    if (working.some((date) => !hoursOf(date).start || !hoursOf(date).end)) {
      return "Informe a entrada e a saída de todos os dias.";
    }
    if (!venueId) return "Escolha o local.";
    if (!uniform) return "Escolha o uniforme.";
    if (people === 0) {
      return audience === "SECTIONS"
        ? "Escolha ao menos um naipe com integrantes ativos."
        : audience === "MEMBERS"
          ? "Escolha ao menos um músico."
          : "Nenhum integrante ativo na banda.";
    }
    return null;
  }

  async function submit() {
    const error = problem();
    if (error || !uniform) return showError(error ?? "Escolha o uniforme.");
    setPending(true);
    try {
      const days = working.map((date) => {
        const { start, end } = hoursOf(date);
        // A saída before the entrada means the day ends after midnight.
        const endDate =
          minutes(end) <= minutes(start) ? addDays(date, 1) : date;
        return {
          startsAt: fromLocalInput(`${date}T${start}`)!,
          endsAt: fromLocalInput(`${endDate}T${end}`)!,
        };
      });
      const created = await dutySchedulesClient.create({
        title: title.trim() || null,
        venueId,
        uniform,
        notes: notes.trim() || null,
        days,
        audience: {
          kind: audience,
          sections: audience === "SECTIONS" ? sections : [],
          userIds: audience === "MEMBERS" ? userIds : [],
        },
      });
      showSuccess(
        "Expediente lançado.",
        `${created.dayCount} dia${created.dayCount === 1 ? "" : "s"} · ${created.memberCount} pessoa${created.memberCount === 1 ? "" : "s"} avisada${created.memberCount === 1 ? "" : "s"} no app e por e-mail.`,
      );
      onSaved();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível lançar o expediente.",
      );
      setPending(false);
    }
  }

  return (
    <Drawer
      open
      width="lg"
      onClose={onClose}
      title="Novo expediente"
      subtitle="Dias de trabalho da semana ou do mês. Os músicos são avisados no app e por e-mail; não precisam confirmar."
      busy={pending}
      footer={
        <>
          <p className="mr-auto hidden text-xs text-muted sm:block">
            {working.length} dia{working.length === 1 ? "" : "s"} · {people}{" "}
            pessoa{people === 1 ? "" : "s"}
          </p>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={submit}
            loading={pending}
            icon={<ClipboardPlus className="size-4" />}
          >
            Lançar expediente
          </Button>
        </>
      }
    >
      <form
        className="space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <FormSection
          icon={<CalendarDays />}
          title="Período"
          description="Uma semana (segunda a domingo) ou um mês inteiro."
        >
          <div className="flex flex-wrap items-end gap-3">
            <div
              className="inline-flex rounded-md border border-border-strong bg-surface p-1"
              role="radiogroup"
              aria-label="Período"
            >
              {(
                [
                  ["week", "Semanal"],
                  ["month", "Mensal"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={span === value}
                  onClick={() => setSpan(value)}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-colors",
                    span === value
                      ? "bg-chrome text-chrome-fg"
                      : "text-muted hover:bg-surface-muted hover:text-fg",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {span === "week" ? (
              <Field
                label="Semana do dia"
                type="date"
                min={today}
                value={weekOf}
                onChange={(e) => e.target.value && setWeekOf(e.target.value)}
                className="w-44"
              />
            ) : (
              <Field
                label="Mês"
                type="month"
                min={today.slice(0, 7)}
                value={month}
                onChange={(e) => e.target.value && setMonth(e.target.value)}
                className="w-44"
              />
            )}
          </div>
          <p className="text-xs text-soft">
            {periodText(dates[0]!, dates[dates.length - 1]!)}
          </p>
        </FormSection>

        <FormSection
          icon={<Clock />}
          title="Dias e horários"
          description="Desmarque os dias de folga. Dias que já passaram ficam de fora."
        >
          <label className="flex items-start gap-2 text-[13px] text-fg">
            <input
              type="checkbox"
              checked={sameHours}
              onChange={(e) => setSameHours(e.target.checked)}
              className="mt-0.5 size-4 accent-[var(--brand-gold)]"
            />
            <span>
              Mesmo horário em todos os dias
              <span className="block text-xs text-soft">
                Usa a entrada e a saída do primeiro dia marcado. Desmarque para
                definir dia a dia.
              </span>
            </span>
          </label>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {dates.map((date) => {
              const row = rowOf(date);
              const gone = past(date);
              const on = !gone && row.work;
              const locked = sameHours && first !== undefined && date !== first;
              const hours = hoursOf(date);
              return (
                <li
                  key={date}
                  className={cn(
                    "flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2",
                    !on && "bg-surface-muted/60",
                  )}
                >
                  <label className="flex w-32 shrink-0 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={gone}
                      onChange={(e) => setRow(date, { work: e.target.checked })}
                      className="size-4 accent-[var(--brand-gold)]"
                      aria-label={`Trabalho em ${dayLabel(date)}`}
                    />
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        on ? "text-fg" : "text-soft",
                      )}
                    >
                      {dayLabel(date)}
                    </span>
                  </label>
                  {on ? (
                    <div className="flex items-center gap-2">
                      <TimeInput
                        label={`Entrada em ${dayLabel(date)}`}
                        value={hours.start}
                        disabled={locked}
                        onChange={(value) => setRow(date, { start: value })}
                      />
                      <span className="text-xs text-soft">às</span>
                      <TimeInput
                        label={`Saída em ${dayLabel(date)}`}
                        value={hours.end}
                        disabled={locked}
                        onChange={(value) => setRow(date, { end: value })}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-soft">
                      {gone ? "Já passou" : "Folga"}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </FormSection>

        <FormSection
          icon={<MapPin />}
          title="Local e uniforme"
          description="Valem para todos os dias; ajuste um dia específico depois, no evento."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Local"
              required
              placeholder="Selecione"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              options={allVenues
                .filter((venue) => !venue.archived)
                .map((venue) => ({ value: venue.id, label: venue.name }))}
              addon={
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setCreatingVenue(true)}
                  icon={<Plus className="size-4" />}
                  aria-label="Cadastrar local"
                  title="Cadastrar local"
                />
              }
            />
            <Select
              label="Uniforme"
              required
              placeholder="Selecione"
              value={uniform}
              onChange={(e) => setUniform(e.target.value as EventUniform)}
              options={UNIFORMS.map((value) => ({
                value,
                label: UNIFORM_LABELS[value],
              }))}
            />
          </div>
        </FormSection>

        <FormSection
          icon={<Users />}
          title="Para quem"
          description="Só integrantes ativos. Quem estiver com indisponibilidade aprovada num dia fica de fora daquele dia."
        >
          <div className="flex flex-wrap gap-1.5" role="radiogroup">
            {(Object.keys(AUDIENCE_LABELS) as DutyAudienceKind[]).map(
              (kind) => (
                <Chip
                  key={kind}
                  active={audience === kind}
                  onClick={() => setAudience(kind)}
                  role="radio"
                >
                  {AUDIENCE_LABELS[kind]}
                </Chip>
              ),
            )}
          </div>
          {audience === "SECTIONS" && (
            <div className="flex flex-wrap gap-1.5" aria-label="Naipes">
              {SECTIONS.map((section) => (
                <Chip
                  key={section}
                  active={sections.includes(section)}
                  onClick={() =>
                    setSections((current) =>
                      current.includes(section)
                        ? current.filter((item) => item !== section)
                        : [...current, section],
                    )
                  }
                >
                  {SECTION_LABELS[section]}
                </Chip>
              ))}
            </div>
          )}
          {audience === "MEMBERS" && (
            <div className="space-y-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-soft" />
                <input
                  type="search"
                  aria-label="Buscar músico"
                  placeholder="Buscar nome ou nome de guerra"
                  className={cn(inputClasses, "pl-9")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <ul className="max-h-64 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {visible.map((entry) => {
                  const checked = userIds.includes(entry.userId);
                  return (
                    <li key={entry.userId}>
                      <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-surface-muted">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setUserIds((current) =>
                              checked
                                ? current.filter((id) => id !== entry.userId)
                                : [...current, entry.userId],
                            )
                          }
                          className="size-4 accent-[var(--brand-gold)]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-fg">
                            {entry.profile?.warName ?? entry.name}
                          </span>
                          <span className="block truncate text-xs text-soft">
                            {entry.profile
                              ? `${RANK_LABELS[entry.profile.rank].label} · ${SECTION_LABELS[entry.profile.section]}`
                              : entry.name}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
                {visible.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-soft">
                    Ninguém encontrado.
                  </li>
                )}
              </ul>
              <p className="text-xs text-muted">
                {userIds.length} músico{userIds.length === 1 ? "" : "s"}{" "}
                escolhido{userIds.length === 1 ? "" : "s"}.
              </p>
            </div>
          )}
        </FormSection>

        <FormSection
          icon={<FileText />}
          title="Detalhes"
          description="Opcionais. O nome aparece na agenda e no aviso."
        >
          <Field
            label="Nome"
            placeholder="Expediente"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            label="Observações"
            rows={3}
            maxLength={1000}
            placeholder="Ex.: ensaio geral na sexta, levar estante…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FormSection>
      </form>
      {creatingVenue && (
        <VenueFormDrawer
          onClose={() => setCreatingVenue(false)}
          onSaved={(venue) => {
            setAllVenues((current) =>
              [...current, venue].sort((a, b) => a.name.localeCompare(b.name)),
            );
            setVenueId(venue.id);
            setCreatingVenue(false);
          }}
        />
      )}
    </Drawer>
  );
}

function TimeInput({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="time"
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputClasses, "h-9 w-28 disabled:opacity-60")}
    />
  );
}

function Chip({
  active,
  onClick,
  role,
  children,
}: {
  active: boolean;
  onClick: () => void;
  role?: "radio";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role={role}
      aria-checked={role ? active : undefined}
      aria-pressed={role ? undefined : active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border text-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function NewDutyScheduleButton({
  venues,
  members,
}: {
  venues: Venue[];
  members: RosterEntry[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        icon={<ClipboardPlus className="size-4" />}
      >
        Novo expediente
      </Button>
      {open && (
        <DutyScheduleDrawer
          venues={venues}
          members={members}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.push("/expedientes?aba=lancados");
            router.refresh();
          }}
        />
      )}
    </>
  );
}
