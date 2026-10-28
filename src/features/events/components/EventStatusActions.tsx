"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarX,
  CheckCheck,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { Badge, Button, Modal, TextArea, cn } from "@/design-system";
import { eventsClient } from "@/features/events/api/events.client";
import { EVENT_STATUS } from "@/features/events/model/event-labels";
import type { BandEvent, EventStatus } from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Action = {
  to: EventStatus;
  label: string;
  icon: typeof CalendarCheck;
  danger?: boolean;
  text: string;
};

const ACTIONS: Record<EventStatus, Action[]> = {
  PLANEJADO: [
    {
      to: "CONFIRMADO",
      label: "Confirmar",
      icon: CalendarCheck,
      text: "O evento passa a constar como confirmado na agenda.",
    },
    {
      to: "CANCELADO",
      label: "Cancelar",
      icon: CalendarX,
      danger: true,
      text: "O evento fica marcado como cancelado. Informe o motivo.",
    },
  ],
  CONFIRMADO: [
    {
      to: "REALIZADO",
      label: "Marcar como realizado",
      icon: CheckCheck,
      text: "Depois de realizado, o evento não pode mais ser alterado.",
    },
    {
      to: "CANCELADO",
      label: "Cancelar",
      icon: CalendarX,
      danger: true,
      text: "O evento fica marcado como cancelado. Informe o motivo.",
    },
  ],
  CANCELADO: [
    {
      to: "PLANEJADO",
      label: "Reabrir",
      icon: RotateCcw,
      text: "O evento volta para planejado.",
    },
  ],
  REALIZADO: [],
};

// Changing an event's status: confirm (with the reason, to cancel) and save.
function useStatusChange(event: BandEvent, onChanged?: () => void) {
  const router = useRouter();
  const [action, setAction] = useState<Action | null>(null);
  const [reason, setReason] = useState("");
  const { showError, showSuccess } = useToast();
  const [pending, setPending] = useState(false);

  function start(item: Action) {
    setReason("");
    setAction(item);
  }

  async function run() {
    if (!action) return;
    setPending(true);
    try {
      await eventsClient.changeStatus(event.id, action.to, reason || null);
      showSuccess(`Evento ${EVENT_STATUS[action.to].label.toLowerCase()}.`);
      setAction(null);
      onChanged?.();
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

  const modal = (
    <Modal
      open={action !== null}
      onClose={() => setAction(null)}
      title={action ? `${action.label}: ${event.title}` : ""}
      tone={action?.danger ? "danger" : "neutral"}
      busy={pending}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => setAction(null)}
            disabled={pending}
          >
            Voltar
          </Button>
          <Button
            variant={action?.danger ? "danger" : "primary"}
            onClick={run}
            loading={pending}
            disabled={action?.to === "CANCELADO" && !reason.trim()}
          >
            Confirmar
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p>{action?.text}</p>
        {action?.to === "CANCELADO" && (
          <TextArea
            label="Motivo do cancelamento"
            required
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}
      </div>
    </Modal>
  );

  return { start, modal };
}

// Buttons on the event page (and the read-only drawer).
export function EventStatusActions({
  event,
  onChanged,
}: {
  event: BandEvent;
  /** After the change is saved (e.g. close the drawer). */
  onChanged?: () => void;
}) {
  const { start, modal } = useStatusChange(event, onChanged);
  const available = ACTIONS[event.status];
  if (available.length === 0) return null;

  return (
    <>
      {available.map((item) => (
        <Button
          key={item.to}
          size="sm"
          variant={item.danger ? "danger" : "secondary"}
          icon={<item.icon className="size-4" />}
          onClick={() => start(item)}
        >
          {item.label}
        </Button>
      ))}
      {modal}
    </>
  );
}

const SELECT_TONES: Record<EventStatus, string> = {
  PLANEJADO: "border-info-border bg-info-soft text-info",
  CONFIRMADO: "border-success-border bg-success-soft text-success",
  REALIZADO: "border-border bg-surface-muted text-muted",
  CANCELADO: "border-danger-border bg-danger-soft text-danger",
};

// Status cell of the events table: the current status with the allowed
// changes; choosing one asks for confirmation (and the reason, to cancel).
export function EventStatusSelect({ event }: { event: BandEvent }) {
  const { start, modal } = useStatusChange(event);
  const available = ACTIONS[event.status];
  const current = EVENT_STATUS[event.status];
  if (available.length === 0) {
    return <Badge tone={current.tone}>{current.label}</Badge>;
  }

  return (
    <>
      <span className="relative inline-flex">
        <select
          aria-label={`Situação de ${event.title}`}
          value={event.status}
          onChange={(e) => {
            const item = available.find((a) => a.to === e.target.value);
            if (item) start(item);
          }}
          className={cn(
            "cursor-pointer appearance-none rounded-full border py-0.5 pr-6 pl-2.5 text-[11px] font-semibold tracking-wide uppercase transition-colors focus:ring-2 focus:ring-accent/40 focus:outline-none",
            SELECT_TONES[event.status],
          )}
        >
          <option value={event.status}>{current.label}</option>
          {available.map((item) => (
            <option key={item.to} value={item.to}>
              {EVENT_STATUS[item.to].label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 opacity-70"
        />
      </span>
      {modal}
    </>
  );
}
