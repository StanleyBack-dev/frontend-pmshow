import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { MyPhotoField } from "@/features/auth/components/MyPhotoField";
import { ProfileForm } from "@/features/auth/components/ProfileForm";
import { MyBandDatesCard } from "@/features/members/components/MyBandDatesCard";
import { MyBandProfileCard } from "@/features/members/components/MyBandProfileCard";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { membersService } from "@/server/services/members.service";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const user = await getSessionUser();
  const [bandProfile, dates] = await authed((token) =>
    Promise.all([
      membersService.myProfile(token),
      membersService.myDates(token),
    ]),
  );

  return (
    <>
      <PageHeader
        title="Meu perfil"
        description={
          <>
            Foto, dados pessoais e perfil na banda. Senha, app e avisos em{" "}
            <Link href="/configuracoes" className="text-accent hover:underline">
              Configurações
            </Link>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Foto de perfil"
            description="Ajuda a banda a identificar você no app."
          />
          <CardBody>
            <MyPhotoField initialUrl={user.photoUrl} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Dados pessoais"
            description="O e-mail recebe escalas, avisos e a recuperação de senha."
          />
          <CardBody>
            <ProfileForm
              initialName={user.name}
              initialEmail={user.email}
              username={user.username}
              groupLabel={GROUP_LABELS[user.group]}
            />
          </CardBody>
        </Card>
        <div className="lg:col-span-2">
          <MyBandProfileCard profile={bandProfile} />
        </div>
        {/* Everyone, with or without a band profile. */}
        <div className="lg:col-span-2">
          <MyBandDatesCard profile={dates} />
        </div>
      </div>
    </>
  );
}
