import type { Tone } from "@/design-system";
import type { EventStatus, EventType } from "@/shared/contracts/events";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  SHOW: "Show",
  DESFILE: "Desfile",
  SOLENIDADE: "Solenidade",
  FORMATURA: "Formatura",
  ENSAIO: "Ensaio",
  CULTO_MISSA: "Culto / missa",
  OUTRO: "Outro",
};

export const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

export const EVENT_STATUS: Record<EventStatus, { label: string; tone: Tone }> =
  {
    PLANEJADO: { label: "Planejado", tone: "info" },
    CONFIRMADO: { label: "Confirmado", tone: "success" },
    REALIZADO: { label: "Realizado", tone: "neutral" },
    CANCELADO: { label: "Cancelado", tone: "danger" },
  };
