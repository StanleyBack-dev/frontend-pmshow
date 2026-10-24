"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import {
  Alert,
  Button,
  Field,
  Drawer,
  Select,
  TextArea,
} from "@/design-system";
import { eventsClient } from "@/features/events/api/events.client";
import {
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
} from "@/features/events/model/event-labels";
import type {
  BandEvent,
  EventInput,
  EventType,
  Venue,
} from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";
import { fromLocalInput, toLocalInput } from "@/shared/lib/datetime";

type Form = {
  title: string;
  type: EventType;
  callTime: string;
  startsAt: string;
  endsAt: string;
  venueId: string;
  uniform: string;
  requester: string;
  documentRef: string;
  notes: string;
};

const fromEvent = (event?: BandEvent): Form => ({
  title: event?.title ?? "",
  type: event?.type ?? "SHOW",
  callTime: toLocalInput(event?.callTime),
  startsAt: toLocalInput(event?.startsAt),
  endsAt: toLocalInput(event?.endsAt),
  venueId: event?.venueId ?? "",
  uniform: event?.uniform ?? "",
  requester: event?.requester ?? "",
  documentRef: event?.documentRef ?? "",
  notes: event?.notes ?? "",
});

function toInput(form: Form): EventInput | string {
  const startsAt = fromLocalInput(form.startsAt);
  if (!startsAt) return "Informe a data e a hora de início.";
  return {
    title: form.title,
    type: form.type,
    callTime: fromLocalInput(form.callTime),
    startsAt,
    endsAt: fromLocalInput(form.endsAt),
    venueId: form.venueId || null,
    uniform: form.uniform || null,
    requester: form.requester || null,
    documentRef: form.documentRef || null,
    notes: form.notes || null,
  };
}

function EventFormDrawer({
  event,
  venues,
  onClose,
}: {
  event?: BandEvent;
  venues: Venue[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(() => fromEvent(event));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  // An archived venue still shows for the event that already uses it.
  const venueOptions = venues.filter(
    (venue) => !venue.archived || venue.id === event?.venueId,
  );

  async function submit() {
    const input = toInput(form);
    if (typeof input === "string") return setError(input);
    setPending(true);
    setError(null);
    try {
      if (event) {
        await eventsClient.update(event.id, input);
        router.refresh();
      } else {
        const created = await eventsClient.create(input);
        router.push(`/agenda/${created.id}`);
      }
      onClose();
    } catch (cause) {
      setError(
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
      onClose={onClose}
      title={event ? "Editar evento" : "Novo evento"}
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={submit}
            loading={pending}
            disabled={form.title.trim().length < 2 || !form.startsAt}
          >
            Salvar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Alert tone="danger">{error}</Alert>}
        <Field
          label="Título"
          placeholder="Ex.: Formatura do CFS 2026"
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Tipo"
            value={form.type}
            onChange={(e) => set("type", e.target.value as EventType)}
            options={EVENT_TYPES.map((value) => ({
              value,
              label: EVENT_TYPE_LABELS[value],
            }))}
          />
          <Select
            label="Local"
            value={form.venueId}
            onChange={(e) => set("venueId", e.target.value)}
            placeholder="A definir"
            options={venueOptions.map((venue) => ({
              value: venue.id,
              label: venue.name,
            }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Concentração"
            type="datetime-local"
            value={form.callTime}
            onChange={(e) => set("callTime", e.target.value)}
          />
          <Field
            label="Início"
            type="datetime-local"
            required
            value={form.startsAt}
            onChange={(e) => set("startsAt", e.target.value)}
          />
          <Field
            label="Término"
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => set("endsAt", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Uniforme / traje"
            placeholder="Ex.: 1º uniforme"
            value={form.uniform}
            onChange={(e) => set("uniform", e.target.value)}
          />
          <Field
            label="Solicitante"
            value={form.requester}
            onChange={(e) => set("requester", e.target.value)}
          />
        </div>
        <Field
          label="Nº do ofício / documento"
          value={form.documentRef}
          onChange={(e) => set("documentRef", e.target.value)}
        />
        <TextArea
          label="Observações"
          rows={3}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>
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
}: {
  event: BandEvent;
  venues: Venue[];
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
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
