import type { Metadata } from "next";
import { Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { AbsenceList } from "@/features/availability/components/AbsenceList";
import { NewAbsenceButton } from "@/features/availability/components/NewAbsenceButton";
import { RANK_LABELS } from "@/features/members/model/member-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { requestTime } from "@/server/request-time";
import { absencesService } from "@/server/services/absences.service";
import { membersService } from "@/server/services/members.service";
import { can } from "@/shared/lib/access";
import { localDay } from "@/shared/lib/datetime";

export const metadata: Metadata = { title: "Indisponibilidades" };

export default async function AbsencesPage() {
  const user = await getSessionUser();
  if (!can(user, "ABSENCES_REQUEST")) return <AccessDenied />;
  const isManager = can(user, "ABSENCES_MANAGE");
  const today = localDay(await requestTime());

  const [mine, pending, current, band] = await authed((token) =>
    Promise.all([
      absencesService.mine(token),
      isManager
        ? absencesService.list(token, { statuses: ["PENDENTE"] })
        : Promise.resolve([]),
      isManager
        ? absencesService.list(token, { statuses: ["APROVADA"], from: today })
        : Promise.resolve([]),
      isManager && can(user, "MEMBERS_READ")
        ? membersService.bandMembers(token)
        : Promise.resolve([]),
    ]),
  );
  const viewer = { id: user.id, isManager, today };
  const members = band.map((entry) => ({
    userId: entry.userId,
    label: entry.profile
      ? `${RANK_LABELS[entry.profile.rank].short} ${entry.profile.warName}`
      : entry.name,
  }));

  return (
    <>
      <PageHeader
        title="Indisponibilidades"
        description="Férias, licenças, dispensas e missões. Aprovadas, impedem a escala no período."
        actions={<NewAbsenceButton label="Pedir indisponibilidade" />}
      />
      <div className="space-y-6">
        {isManager && (
          <Card>
            <CardHeader
              title="Pedidos para analisar"
              description="Quem pediu recebe a resposta no app e por e-mail."
            />
            <CardBody>
              <AbsenceList
                absences={pending}
                viewer={viewer}
                showPerson
                empty="Nenhum pedido aguardando análise."
              />
            </CardBody>
          </Card>
        )}
        {isManager && (
          <Card>
            <CardHeader
              title="Aprovadas a partir de hoje"
              action={
                members.length > 0 ? (
                  <NewAbsenceButton
                    members={members}
                    label="Lançar para integrante"
                    variant="secondary"
                  />
                ) : undefined
              }
            />
            <CardBody>
              <AbsenceList
                absences={[...current].reverse()}
                viewer={viewer}
                showPerson
                empty="Ninguém indisponível nos próximos dias."
              />
            </CardBody>
          </Card>
        )}
        <Card>
          <CardHeader title="Minhas indisponibilidades" />
          <CardBody>
            <AbsenceList
              absences={mine}
              viewer={viewer}
              showPerson={false}
              empty="Você ainda não pediu nenhuma indisponibilidade."
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
