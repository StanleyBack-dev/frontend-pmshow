import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CalendarOff,
  ClipboardCheck,
  Users,
} from "lucide-react";
import { StatCard } from "@/design-system";
import type { BandDashboard } from "@/shared/contracts/dashboard";

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

// Manager's overview on the home page: what needs attention now.
export function BandDashboardPanel({
  dashboard,
}: {
  dashboard: BandDashboard;
}) {
  const cards = [
    {
      href: "/musicos",
      label: "Integrantes ativos",
      value: dashboard.activeMembers,
      hint: `${plural(dashboard.awayMembers, "afastado", "afastados")} · ${plural(dashboard.absentToday, "indisponível hoje", "indisponíveis hoje")}`,
      icon: <Users className="size-5" />,
      tone: "accent" as const,
    },
    {
      href: "/eventos",
      label: "Eventos em 30 dias",
      value: dashboard.upcomingEvents,
      hint:
        dashboard.eventsWithoutRoster > 0
          ? `${dashboard.eventsWithoutRoster} sem escala publicada`
          : "Todos com escala publicada",
      icon: <CalendarDays className="size-5" />,
      tone:
        dashboard.eventsWithoutRoster > 0
          ? ("warning" as const)
          : ("success" as const),
    },
    {
      // Swap requests first: the list where they are solved.
      href: dashboard.swapRequests > 0 ? "/escalas?aba=trocas" : "/eventos",
      label: "Ciências pendentes",
      value: dashboard.pendingAcks,
      hint:
        dashboard.swapRequests > 0
          ? plural(
              dashboard.swapRequests,
              "pedido de troca",
              "pedidos de troca",
            )
          : "Nenhum pedido de troca",
      icon: <ClipboardCheck className="size-5" />,
      tone:
        dashboard.swapRequests > 0 ? ("danger" as const) : ("info" as const),
    },
    {
      href: "/indisponibilidades",
      label: "Indisponibilidades a analisar",
      value: dashboard.pendingAbsences,
      hint:
        dashboard.pendingAbsences > 0
          ? "Aguardando sua resposta"
          : "Nada pendente",
      icon: <CalendarOff className="size-5" />,
      tone:
        dashboard.pendingAbsences > 0
          ? ("warning" as const)
          : ("neutral" as const),
    },
  ];

  return (
    <section aria-label="Painel da banda" className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map(({ href, ...card }) => (
          <Link
            key={card.label}
            href={href}
            className="block h-full rounded-xl transition-opacity hover:opacity-90"
          >
            <StatCard {...card} />
          </Link>
        ))}
      </div>
      {dashboard.failedNotifications > 0 && (
        <p className="flex items-start gap-2 text-sm text-danger">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {plural(
            dashboard.failedNotifications,
            "notificação não pôde ser enviada",
            "notificações não puderam ser enviadas",
          )}{" "}
          depois de várias tentativas. Verifique a configuração de e-mail.
        </p>
      )}
    </section>
  );
}
