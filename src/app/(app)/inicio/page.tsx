import type { Metadata } from "next";
import { CalendarDays, ClipboardList, ListMusic } from "lucide-react";
import { Card, PageHeader } from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { getSessionUser } from "@/server/auth/current-user";

export const metadata: Metadata = { title: "Início" };

const COMING = [
  {
    icon: ListMusic,
    title: "Repertório",
    text: "Músicas com áudio e vídeo para ouvir e assistir no app.",
  },
  {
    icon: CalendarDays,
    title: "Agenda",
    text: "Apresentações com local, horário e uniforme.",
  },
  {
    icon: ClipboardList,
    title: "Escalas",
    text: "Quem está escalado em cada evento, com aviso por e-mail.",
  },
];

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      <PageHeader
        title={`Olá, ${user.name.split(" ")[0]}!`}
        description={`Você entrou como ${GROUP_LABELS[user.group]}.`}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {COMING.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="p-5">
            <Icon className="size-5 text-brand-gold" aria-hidden />
            <h2 className="mt-3 font-semibold text-fg">{title}</h2>
            <p className="mt-1 text-sm text-muted">{text}</p>
            <p className="mt-3 text-xs font-medium text-soft">Em breve</p>
          </Card>
        ))}
      </div>
    </>
  );
}
