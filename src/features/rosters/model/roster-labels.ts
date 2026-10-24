import type { Tone } from "@/design-system";
import type {
  AckStatus,
  AssignmentRole,
  CandidateBlocker,
} from "@/shared/contracts/rosters";

export const ROLE_LABELS: Record<AssignmentRole, string> = {
  MUSICO: "Músico",
  REGENTE: "Regente",
  CHEFE_EQUIPE: "Chefe da equipe",
  MOTORISTA: "Motorista",
  SOM: "Som",
  APOIO: "Apoio",
};

export const ROLES = Object.keys(ROLE_LABELS) as AssignmentRole[];

/** Order lines are listed in: leadership first. */
export const ROLE_ORDER: Record<AssignmentRole, number> = {
  REGENTE: 0,
  CHEFE_EQUIPE: 1,
  MUSICO: 2,
  SOM: 3,
  MOTORISTA: 4,
  APOIO: 5,
};

export const ACK_STATUS: Record<AckStatus, { label: string; tone: Tone }> = {
  PENDENTE: { label: "Aguardando ciência", tone: "warning" },
  CIENTE: { label: "Ciente", tone: "success" },
  TROCA_SOLICITADA: { label: "Pediu troca", tone: "danger" },
};

export const BLOCKER_LABELS: Record<CandidateBlocker, string> = {
  NO_PROFILE: "Sem cadastro na banda",
  INACTIVE: "Inativo",
  AWAY: "Afastado",
  ABSENT: "Indisponível",
};
