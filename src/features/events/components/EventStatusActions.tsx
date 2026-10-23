"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, CalendarX, CheckCheck, RotateCcw } from "lucide-react";
import { Alert, Button, Modal, TextArea } from "@/design-system";
import { eventsClient } from "@/features/events/api/events.client";
import type { BandEvent, EventStatus } from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";

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

export function EventStatusActions({ event }: { event: BandEvent }) {
  const router = useRouter();
  const [action, setAction] = useState<Action | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run() {
    if (!action) return;
    setPending(true);
    setError(null);
    try {
      await eventsClient.changeStatus(event.id, action.to, reason || null);
      setAction(null);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

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
          onClick={() => {
            setReason("");
            setError(null);
            setAction(item);
          }}
        >
          {item.label}
        </Button>
      ))}
      <Modal
        open={action !== null}
        onClose={() => setAction(null)}
        title={action?.label ?? ""}
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
          {error && <Alert tone="danger">{error}</Alert>}
          <p>{action?.text}</p>
          {action?.to === "CANCELADO" && (
            <TextArea
              label="Motivo do cancelamento"
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
