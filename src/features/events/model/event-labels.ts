import type { Tone } from "@/design-system";
import type {
  EventStatus,
  EventType,
  EventUniform,
} from "@/shared/contracts/events";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  SHOW: "Show",
  DESFILE: "Desfile",
  SOLENIDADE: "Solenidade",
  BAILE: "Baile",
  FORMATURA: "Formatura",
  ENSAIO: "Ensaio",
  CULTO_MISSA: "Culto / missa",
  EXPEDIENTE: "Expediente",
  OUTRO: "Outro",
};

export const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

// PMGO uniforms (RUPMGO); paisano is plain clothes, without uniform.
export const UNIFORM_LABELS: Record<EventUniform, string> = {
  OPERACIONAL_4A: "4º A – operacional (gandola)",
  OPERACIONAL_4B: "4º B – operacional",
  OPERACIONAL_4C: "4º C – operacional",
  TUNICA: "Túnica",
  SOCIAL: "Social",
  PAISANO: "Paisano (traje civil)",
};

export const UNIFORMS = Object.keys(UNIFORM_LABELS) as EventUniform[];

export const EVENT_PERIODS = {
  proximos: { label: "Próximos", period: "UPCOMING" },
  passados: { label: "Passados", period: "PAST" },
} as const;

export const EVENT_STATUS: Record<EventStatus, { label: string; tone: Tone }> =
  {
    PLANEJADO: { label: "Planejado", tone: "info" },
    CONFIRMADO: { label: "Confirmado", tone: "success" },
    REALIZADO: { label: "Realizado", tone: "neutral" },
    CANCELADO: { label: "Cancelado", tone: "danger" },
  };

export const EVENT_STATUSES = Object.keys(EVENT_STATUS) as EventStatus[];

/** Brazilian states (UF) for the venue address. */
export const BR_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;
