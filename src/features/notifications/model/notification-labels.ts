import type { NotificationType } from "@/shared/contracts/notifications";

/** What each kind of notice is about (preferences page). */
export const NOTIFICATION_TYPE_LABELS: Record<
  NotificationType,
  { label: string; description: string }
> = {
  ROSTER_PUBLISHED: {
    label: "Escalado em um evento",
    description: "Quando você entra numa escala publicada.",
  },
  ROSTER_UPDATED: {
    label: "Mudança na sua função",
    description: "Quando sua função ou instrumento na escala muda.",
  },
  ROSTER_REMOVED: {
    label: "Saída da escala",
    description: "Quando você é retirado de uma escala.",
  },
  EVENT_RESCHEDULED: {
    label: "Evento remarcado",
    description: "Horário ou local de um evento em que você está escalado.",
  },
  EVENT_CANCELLED: {
    label: "Evento cancelado",
    description: "Um evento em que você estava escalado foi cancelado.",
  },
  ROSTER_SWAP_REQUESTED: {
    label: "Pedido de troca",
    description:
      "Para gestores: alguém da escala que você publicou pediu troca.",
  },
  ABSENCE_REVIEWED: {
    label: "Resposta de indisponibilidade",
    description: "Seu pedido de indisponibilidade foi aprovado ou recusado.",
  },
  EVENT_REMINDER: {
    label: "Lembrete de evento",
    description:
      "Na véspera e na manhã de um evento em que você está escalado.",
  },
  BROADCAST: {
    label: "Comunicados",
    description: "Avisos gerais enviados pelos gestores da banda.",
  },
};

/** "há 5 min", "ontem", "12/11". */
export function formatWhen(iso: string, now: Date): string {
  const diff = (now.getTime() - new Date(iso).getTime()) / 60_000;
  if (diff < 1) return "agora";
  if (diff < 60) return `há ${Math.floor(diff)} min`;
  if (diff < 24 * 60) return `há ${Math.floor(diff / 60)} h`;
  if (diff < 48 * 60) return "ontem";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(iso));
}
