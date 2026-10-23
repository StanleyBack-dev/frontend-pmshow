import type { Metadata } from "next";
import { Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { ProfileForm } from "@/features/auth/components/ProfileForm";
import { getSessionUser } from "@/server/auth/current-user";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const user = await getSessionUser();

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
      </div>
    </>
  );
}
