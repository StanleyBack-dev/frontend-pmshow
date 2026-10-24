import type { Metadata } from "next";
import { Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { ProfileForm } from "@/features/auth/components/ProfileForm";
import { MyBandProfileCard } from "@/features/members/components/MyBandProfileCard";
import { NotificationPreferences } from "@/features/notifications/components/NotificationPreferences";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { membersService } from "@/server/services/members.service";
import { notificationsService } from "@/server/services/notifications.service";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const user = await getSessionUser();
  const [bandProfile, preferences] = await authed((token) =>
    Promise.all([
      membersService.myProfile(token),
      notificationsService.preferences(token),
    ]),
  );

  return (
    <>
      <PageHeader
        title="Meu perfil"
        description={`Usuário ${user.username} · ${GROUP_LABELS[user.group]}`}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Dados pessoais"
            description="O e-mail recebe escalas, avisos e a recuperação de senha."
          />
          <CardBody>
            <ProfileForm initialName={user.name} initialEmail={user.email} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Senha"
            description="Ao trocar, você continua conectado só neste aparelho."
          />
          <CardBody>
            <ChangePasswordForm />
          </CardBody>
        </Card>
        <div className="lg:col-span-2">
          <MyBandProfileCard profile={bandProfile} />
        </div>
        <Card className="lg:col-span-2">
          <CardHeader
            title="Avisos por e-mail"
            description="No app, todos os avisos aparecem no sino. Escolha quais também chegam por e-mail."
          />
          <CardBody>
            <NotificationPreferences initial={preferences} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
