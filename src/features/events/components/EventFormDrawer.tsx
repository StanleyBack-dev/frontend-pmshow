"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  FileText,
  Flag,
  ListMusic,
  MapPin,
  Pencil,
  Plus,
} from "lucide-react";
import {
  Button,
  Drawer,
  Field,
  FormSection,
  Select,
  Spinner,
  TextArea,
} from "@/design-system";
import { eventsClient } from "@/features/events/api/events.client";
import { VenueFormDrawer } from "@/features/events/components/VenueFormDrawer";
import { RosterModal } from "@/features/rosters/components/RosterModal";
import {
  SongListEditor,
  toSongListItems,
  useEventSongList,
  type SongListRow,
} from "@/features/events/components/SongListEditor";
import {
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
  UNIFORMS,
  UNIFORM_LABELS,
} from "@/features/events/model/event-labels";
import type {
  BandEvent,
  EventInput,
  EventType,
  EventUniform,
  Venue,
} from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";
import { fromLocalInput, toLocalInput } from "@/shared/lib/datetime";
import { useToast } from "@/shared/toast/useToast";

// One date and three times: the band's day reads like the order of the
// event (arrive, start, end), without repeating the date three times.
type Form = {
  title: string;
  type: EventType;
  date: string;
  callTime: string;
  startTime: string;
  endTime: string;
  venueId: string;
  uniform: EventUniform | "";
  requester: string;
  documentRef: string;
  notes: string;
};

const datePart = (iso: string | null | undefined) =>
  toLocalInput(iso).slice(0, 10);
const timePart = (iso: string | null | undefined) =>
  toLocalInput(iso).slice(11, 16);

const fromEvent = (event?: BandEvent): Form => ({
  title: event?.title ?? "",
  type: event?.type ?? "SHOW",
  date: datePart(event?.startsAt),
  callTime: timePart(event?.callTime),
  startTime: timePart(event?.startsAt),
  endTime: timePart(event?.endsAt),
  venueId: event?.venueId ?? "",
  uniform: event?.uniform ?? "",
  requester: event?.requester ?? "",
  documentRef: event?.documentRef ?? "",
  notes: event?.notes ?? "",
});

const VENUE_REQUIRED = "Escolha o local ou cadastre um novo no “+”.";
const UNIFORM_REQUIRED = "Escolha o uniforme.";

/** "2026-11-15" → "2026-11-16". */
function nextDay(date: string): string {
  const day = new Date(`${date}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}

const minutesOf = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/** An end time before the start means the event ends after midnight. */
const endsNextDay = (form: Form) =>
  Boolean(form.endTime && form.startTime) &&
  minutesOf(form.endTime) <= minutesOf(form.startTime);

function scheduleErrors(form: Form) {
  return {
    date: form.date ? undefined : "Informe a data.",
    startTime: form.startTime ? undefined : "Informe o horário de início.",
    callTime:
      form.callTime &&
      form.startTime &&
      minutesOf(form.callTime) > minutesOf(form.startTime)
        ? "A concentração é antes do início."
        : undefined,
  };
}

/** "Concentração 17:30 · início 19:00 · término 21:00 (2h)". */
function scheduleSummary(form: Form): string | null {
  if (!form.startTime) return null;
  const parts = [
    form.callTime && `Concentração ${form.callTime}`,
    `início ${form.startTime}`,
  ];
  if (form.endTime) {
    let minutes = minutesOf(form.endTime) - minutesOf(form.startTime);
    if (minutes <= 0) minutes += 24 * 60;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    const length = hours
      ? `${hours}h${rest ? String(rest).padStart(2, "0") : ""}`
      : `${rest}min`;
    parts.push(
      `término ${form.endTime}${endsNextDay(form) ? " do dia seguinte" : ""} (${length})`,
    );
  }
  const text = parts.filter(Boolean).join(" · ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toInput(form: Form): EventInput | string {
  const errors = scheduleErrors(form);
  const firstError = errors.date ?? errors.startTime ?? errors.callTime;
  if (firstError) return firstError;
  if (!form.venueId) return VENUE_REQUIRED;
  if (!form.uniform) return UNIFORM_REQUIRED;
  const uniform = form.uniform;
  const startsAt = fromLocalInput(`${form.date}T${form.startTime}`);
  if (!startsAt) return "Data ou horário inválido.";
  const endDate = endsNextDay(form) ? nextDay(form.date) : form.date;
  return {
    title: form.title,
    type: form.type,
    callTime: form.callTime
      ? fromLocalInput(`${form.date}T${form.callTime}`)
      : null,
    startsAt,
    endsAt: form.endTime ? fromLocalInput(`${endDate}T${form.endTime}`) : null,
    venueId: form.venueId,
    uniform,
    requester: form.requester || null,
    documentRef: form.documentRef || null,
    notes: form.notes || null,
  };
}

export function EventFormDrawer({
  event,
  venues,
  canBuildRoster = false,
  canPublishRoster = false,
  onClose,
}: {
  event?: BandEvent;
  venues: Venue[];
  /** Shows "Montar escala" (existing events still open). */
  canBuildRoster?: boolean;
  canPublishRoster?: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(() => fromEvent(event));
  const { showError, showSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // The list of songs: loaded for an existing event, saved with it.
  const songList = useEventSongList(event?.id);
  const [songsChanged, setSongsChanged] = useState(false);
  const changeSongs = (rows: SongListRow[]) => {
    songList.setRows(rows);
    setSongsChanged(true);
  };
  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  // Venues created here join the list (and get selected).
  const [allVenues, setAllVenues] = useState(venues);
  const [creatingVenue, setCreatingVenue] = useState(false);
  // An archived venue still shows for the event that already uses it.
  const venueOptions = allVenues.filter(
    (venue) => !venue.archived || venue.id === event?.venueId,
  );
  const errors = scheduleErrors(form);
  const summary = scheduleSummary(form);
  const [rosterOpen, setRosterOpen] = useState(false);
  const rosterOpenable =
    canBuildRoster &&
    event !== undefined &&
    (event.status === "PLANEJADO" || event.status === "CONFIRMADO");
  const closeRoster = useCallback(() => setRosterOpen(false), []);

  async function submit() {
    setSubmitted(true);
    const input = toInput(form);
    if (typeof input === "string") return showError(input);
    setPending(true);
    try {
      // The list of songs goes with the event: one request, one transaction.
      const songs = toSongListItems(songList.rows ?? []);
      if (event) {
        await eventsClient.update(event.id, {
          ...input,
          ...(songsChanged ? { setlist: songs } : {}),
        });
        showSuccess("Evento salvo.");
      } else {
        await eventsClient.create({ ...input, setlist: songs });
        showSuccess("Evento criado.", "Ele já aparece na lista e na agenda.");
      }
      router.refresh();
      onClose();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar o evento.",
      );
    }
    setPending(false);
  }

  return (
    <Drawer
      open
      width="lg"
      onClose={onClose}
      title={event ? "Editar evento" : "Novo evento"}
      subtitle={
        event
          ? undefined
          : "Depois de criar, monte a escala pela coluna Escala da lista."
      }
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={submit}
            loading={pending}
            disabled={form.title.trim().length < 2}
          >
            {event ? "Salvar" : "Criar evento"}
          </Button>
        </>
      }
    >
      {event && (
        <Link
          href={`/eventos/${event.id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          Abrir página do evento <ArrowUpRight className="size-4" />
        </Link>
      )}
      {rosterOpenable && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-accent-border bg-accent-soft p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-accent-fg">
            <ClipboardList className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-fg">Escala da banda</p>
            <p className="text-xs text-muted">
              Escolha quem vai tocar neste evento e a função de cada um.
            </p>
          </div>
          <Button
            size="sm"
            icon={<ClipboardList className="size-4" />}
            onClick={() => setRosterOpen(true)}
          >
            Montar escala
          </Button>
        </div>
      )}
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <FormSection
          icon={<Flag />}
          title="O evento"
          description="Como ele aparece na agenda e para os músicos."
        >
          <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
            <Field
              label="Título"
              placeholder="Ex.: Formatura do CFS 2026"
              required
              data-autofocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
            <Select
              label="Tipo"
              required
              value={form.type}
              onChange={(e) => set("type", e.target.value as EventType)}
              options={EVENT_TYPES.map((value) => ({
                value,
                label: EVENT_TYPE_LABELS[value],
              }))}
            />
          </div>
        </FormSection>

        <FormSection
          icon={<CalendarDays />}
          title="Data e horários"
          description="A concentração é a hora em que a banda chega; o término é opcional."
        >
          <div className="grid gap-4 sm:grid-cols-4">
            <Field
              label="Data"
              type="date"
              required
              className="sm:col-span-4 md:col-span-1"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              error={submitted ? errors.date : undefined}
            />
            <Field
              label="Concentração"
              type="time"
              value={form.callTime}
              onChange={(e) => set("callTime", e.target.value)}
              error={errors.callTime}
            />
            <Field
              label="Início"
              type="time"
              required
              value={form.startTime}
              onChange={(e) => set("startTime", e.target.value)}
              error={submitted ? errors.startTime : undefined}
            />
            <Field
              label="Término"
              type="time"
              value={form.endTime}
              onChange={(e) => set("endTime", e.target.value)}
            />
          </div>
          {summary && (
            <p className="rounded-md bg-surface-muted px-3 py-2 text-xs text-muted">
              {summary}
            </p>
          )}
        </FormSection>

        <FormSection
          icon={<MapPin />}
          title="Local"
          description="Escolha um local cadastrado ou cadastre um novo no “+”."
        >
          <Select
            label="Onde"
            required
            value={form.venueId}
            onChange={(e) => set("venueId", e.target.value)}
            placeholder="Selecione"
            error={submitted && !form.venueId ? VENUE_REQUIRED : undefined}
            options={venueOptions.map((venue) => ({
              value: venue.id,
              label: `${venue.name} · ${venue.city}/${venue.state}`,
            }))}
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
          {(() => {
            const chosen = allVenues.find((v) => v.id === form.venueId);
            return chosen ? (
              <p className="text-xs text-soft">{chosen.fullAddress}</p>
            ) : null;
          })()}
        </FormSection>

        <FormSection
          icon={<ListMusic />}
          title="Lista de músicas"
          description="O que a banda vai tocar, na ordem. Pode ficar para depois."
        >
          {songList.rows ? (
            <SongListEditor rows={songList.rows} onChange={changeSongs} />
          ) : (
            !songList.failed && (
              <div className="grid place-items-center py-4">
                <Spinner size="sm" />
              </div>
            )
          )}
        </FormSection>

        <FormSection
          icon={<FileText />}
          title="Detalhes do pedido"
          description="O uniforme da banda; quem pediu e o documento são opcionais."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Uniforme"
              required
              value={form.uniform}
              onChange={(e) => set("uniform", e.target.value as EventUniform)}
              placeholder="Selecione"
              options={UNIFORMS.map((value) => ({
                value,
                label: UNIFORM_LABELS[value],
              }))}
              error={submitted && !form.uniform ? UNIFORM_REQUIRED : undefined}
            />
            <Field
              label="Solicitante"
              placeholder="Ex.: Comando do CFS"
              value={form.requester}
              onChange={(e) => set("requester", e.target.value)}
            />
          </div>
          <Field
            label="Nº do ofício / documento"
            placeholder="Ex.: Ofício nº 123/2026"
            value={form.documentRef}
            onChange={(e) => set("documentRef", e.target.value)}
          />
          <TextArea
            label="Observações"
            rows={3}
            placeholder="Ex.: entrada pelo portão lateral, repertório pedido…"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </FormSection>
      </form>
      {rosterOpen && event && (
        <RosterModal
          eventId={event.id}
          eventTitle={event.title}
          canPublish={canPublishRoster}
          onClose={closeRoster}
        />
      )}
      {creatingVenue && (
        <VenueFormDrawer
          onClose={() => setCreatingVenue(false)}
          onSaved={(venue) => {
            setAllVenues((current) =>
              [...current, venue].sort((a, b) => a.name.localeCompare(b.name)),
            );
            set("venueId", venue.id);
            setCreatingVenue(false);
          }}
        />
      )}
    </Drawer>
  );
}

export function NewEventButton({ venues }: { venues: Venue[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<Plus className="size-4" />}>
        Novo evento
      </Button>
      {open && (
        <EventFormDrawer venues={venues} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

export function EditEventButton({
  event,
  venues,
  canBuildRoster = false,
  canPublishRoster = false,
}: {
  event: BandEvent;
  venues: Venue[];
  canBuildRoster?: boolean;
  canPublishRoster?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        icon={<Pencil className="size-4" />}
      >
        Editar
      </Button>
      {open && (
        <EventFormDrawer
          event={event}
          venues={venues}
          canBuildRoster={canBuildRoster}
          canPublishRoster={canPublishRoster}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
