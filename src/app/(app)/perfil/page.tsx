import type { Metadata } from "next";
import { Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { ProfileForm } from "@/features/auth/components/ProfileForm";
import { MyBandProfileCard } from "@/features/members/components/MyBandProfileCard";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { membersService } from "@/server/services/members.service";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const user = await getSessionUser();
  const bandProfile = await authed((token) => membersService.myProfile(token));

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
      </div>
    </>
  );
}
