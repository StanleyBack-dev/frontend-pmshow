import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Briefcase,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  ListMusic,
} from "lucide-react";
import { Badge, Card, PageHeader } from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { BandDashboardPanel } from "@/features/dashboard/components/BandDashboardPanel";
import { BirthdaysCard } from "@/features/members/components/BirthdaysCard";
import { UpcomingEvents } from "@/features/events/components/UpcomingEvents";
import { lineRole } from "@/features/rosters/model/roster-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { dashboardService } from "@/server/services/dashboard.service";
import { eventsService } from "@/server/services/events.service";
import { membersService } from "@/server/services/members.service";
import { rostersService } from "@/server/services/rosters.service";
import { can } from "@/shared/lib/access";
import { formatShortDay, formatTime } from "@/shared/lib/datetime";

export const metadata: Metadata = { title: "Início" };

const linkClasses =
  "inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-accent hover:underline";

// Card title row: icon chip, title and an optional link on the right.
function SectionHeader({
  icon,
  title,
  action,
}: {
  icon: ReactNode;
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent-soft text-accent [&>svg]:size-4">
        {icon}
      </span>
      <h2 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-fg">
        {title}
      </h2>
      {action}
    </div>
  );
}

export default async function HomePage() {
  const user = await getSessionUser();
  const canSeeAgenda = can(user, "EVENTS_READ");
  const canSeeRosters = can(user, "ROSTERS_READ_OWN");
  const isManager = can(user, "ROSTERS_READ_ALL");
  const [upcoming, assignments, dashboard, birthdays] = await authed((token) =>
    Promise.all([
      canSeeAgenda ? eventsService.upcoming(token, 5) : Promise.resolve([]),
      canSeeRosters ? rostersService.mine(token) : Promise.resolve([]),
      isManager ? dashboardService.get(token) : Promise.resolve(null),
      // A failure here never takes the home page down.
      membersService.birthdays(token).catch(() => []),
    ]),
  );
  // Today in Goiás, for the month's birthdays.
  const [todayMonth, todayDay] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("-")
    .map(Number);
  // My working days still ahead (or under way), apart from the events.
  const now = new Date().toISOString();
  const myDuties = assignments
    .flatMap((item) => (item.event ? [item.event] : []))
    .filter(
      (event) =>
        event.type === "EXPEDIENTE" &&
        (event.status === "PLANEJADO" || event.status === "CONFIRMADO") &&
        (event.endsAt ?? event.startsAt) >= now,
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  // Waiting for the member's answer, on events still to happen.
  const pendingAck = assignments.filter(
    (item) =>
      item.ackStatus === "PENDENTE" &&
      (item.event?.status === "PLANEJADO" ||
        item.event?.status === "CONFIRMADO"),
  );

  return (
    <>
      <PageHeader
        title={`Olá, ${user.name.split(" ")[0]}!`}
        description={`Você entrou como ${GROUP_LABELS[user.group]}.`}
      />
      {dashboard && (
        <div className="mb-5 sm:mb-6">
          <BandDashboardPanel dashboard={dashboard} />
        </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {(canSeeAgenda || canSeeRosters) && (
          <div className="min-w-0 space-y-4 sm:space-y-6">
            {canSeeAgenda && (
              <Card className="overflow-hidden">
                <SectionHeader
                  icon={<CalendarDays />}
                  title="Próximos eventos"
                  action={
                    <Link href="/agenda" className={linkClasses}>
                      Agenda <ChevronRight className="size-4" />
                    </Link>
                  }
                />
                {upcoming.length > 0 ? (
                  <UpcomingEvents events={upcoming} />
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-muted sm:px-5">
                    Nenhum evento planejado por enquanto.
                  </p>
                )}
              </Card>
            )}
            {canSeeRosters && (
              <Card className="overflow-hidden">
                <SectionHeader
                  icon={<Briefcase />}
                  title="Meus expedientes"
                  action={
                    <Link href="/expedientes" className={linkClasses}>
                      Expedientes <ChevronRight className="size-4" />
                    </Link>
                  }
                />
                {myDuties.length > 0 ? (
                  <UpcomingEvents events={myDuties.slice(0, 5)} />
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-muted sm:px-5">
                    Você não está em nenhum expediente nos próximos dias.
                  </p>
                )}
              </Card>
            )}
          </div>
        )}
        <div className="min-w-0 space-y-4">
          {canSeeRosters && (
            <Card className="overflow-hidden">
              <SectionHeader
                icon={<ClipboardList />}
                title="Minhas escalas"
                action={
                  pendingAck.length > 0 ? (
                    <Badge tone="warning">
                      {pendingAck.length} pendente
                      {pendingAck.length === 1 ? "" : "s"}
                    </Badge>
                  ) : undefined
                }
              />
              {pendingAck.length > 0 ? (
                <>
                  <p className="px-4 pt-3 text-[13px] text-muted sm:px-5">
                    Confirme a ciência{" "}
                    {pendingAck.length === 1
                      ? "desta escala"
                      : `destas ${pendingAck.length} escalas`}
                    :
                  </p>
                  <ul className="divide-y divide-border">
                    {pendingAck.slice(0, 4).map((item) => (
                      <li key={item.eventId}>
                        <Link
                          href={`/eventos/${item.eventId}`}
                          className="flex items-center gap-2 px-4 py-2.5 transition-colors hover:bg-surface-muted sm:px-5"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-fg">
                              {item.event?.title}
                            </span>
                            {item.event && (
                              <span className="block truncate text-xs text-soft">
                                {formatShortDay(item.event.startsAt)},{" "}
                                {formatTime(item.event.startsAt)} ·{" "}
                                {lineRole(
                                  item.functionName,
                                  item.instrumentName,
                                )}
                              </span>
                            )}
                          </span>
                          <ChevronRight
                            aria-hidden
                            className="size-4 shrink-0 text-soft"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="px-4 pt-3 text-[13px] text-muted sm:px-5">
                  {assignments.length > 0
                    ? "Tudo confirmado. Veja os próximos eventos em que você está."
                    : "Quando você for escalado, o aviso chega aqui e por e-mail."}
                </p>
              )}
              <div className="px-4 py-3 sm:px-5">
                <Link href="/escalas" className={linkClasses}>
                  Ver minhas escalas <ChevronRight className="size-4" />
                </Link>
              </div>
            </Card>
          )}
          <BirthdaysCard
            birthdays={birthdays}
            today={{ day: todayDay!, month: todayMonth! }}
          />
          {can(user, "REPERTOIRE_READ") && (
            <Link href="/repertorio" className="block">
              <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-surface-muted sm:p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-gold-soft text-brand-gold-ink">
                  <ListMusic className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-fg">
                    Repertório
                  </span>
                  <span className="block text-[13px] text-muted">
                    Ouça os áudios e assista aos vídeos das músicas.
                  </span>
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-soft"
                />
              </Card>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
