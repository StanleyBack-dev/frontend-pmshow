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
    description: "Para gestores: alguém de uma escala pediu para ser trocado.",
  },
  ROSTER_SWAP_DECLINED: {
    label: "Troca não aceita",
    description:
      "Seu pedido de troca não foi aceito e você continua na escala.",
  },
  ABSENCE_REVIEWED: {
    label: "Resposta de indisponibilidade",
    description: "Seu pedido de indisponibilidade foi aprovado ou recusado.",
  },
  ABSENCE_REQUESTED: {
    label: "Indisponibilidade para analisar",
    description:
      "Para os gestores: um integrante pediu uma indisponibilidade e aguarda aprovação.",
  },
  DUTY_SCHEDULED: {
    label: "Expediente lançado",
    description: "Seus dias e horários de expediente da semana ou do mês.",
  },
  DUTY_CANCELLED: {
    label: "Expediente cancelado",
    description: "Um expediente em que você estava foi cancelado.",
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
  SUPPORT_REQUESTED: {
    label: "Nova solicitação de suporte",
    description: "Para o administrador geral: alguém pediu ajuda pelo Suporte.",
  },
  SUPPORT_ANSWERED: {
    label: "Resposta do suporte",
    description: "O suporte respondeu uma solicitação sua.",
  },
  SUPPORT_FINALIZED: {
    label: "Suporte finalizado",
    description: "Uma solicitação sua ao suporte foi finalizada.",
  },
  ENROLLMENT_SUBMITTED: {
    label: "Novo cadastro",
    description:
      "Para o administrador geral: alguém enviou o cadastro pelo link e aguarda aprovação.",
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
