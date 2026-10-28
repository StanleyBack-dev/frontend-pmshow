import { Card, CardBody, CardHeader } from "@/design-system";
import {
  RANK_LABELS,
  SECTION_LABELS,
  STATUS_LABELS,
  formatPhone,
} from "@/features/members/model/member-labels";
import type { MemberProfile } from "@/shared/contracts/members";

// Read-only: the band profile is kept by the managers (MEMBERS_MANAGE).
export function MyBandProfileCard({
  profile,
}: {
  profile: MemberProfile | null;
}) {
  if (!profile) {
    return (
      <Card>
        <CardHeader title="Cadastro na banda" />
        <CardBody>
          <p className="text-sm text-muted">
            Seu cadastro na banda (posto, naipe e instrumentos) ainda não foi
            preenchido. Fale com um gestor.
          </p>
        </CardBody>
      </Card>
    );
  }

  const rows: [string, string][] = [
    ["Posto / graduação", RANK_LABELS[profile.rank].label],
    ["Nome de guerra", profile.warName],
    ["Naipe", SECTION_LABELS[profile.section]],
    ["Situação", STATUS_LABELS[profile.status]],
    [
      "Instrumentos",
      profile.instruments
        .map((item) => (item.primary ? `${item.name} (principal)` : item.name))
        .join(", ") || "—",
    ],
    ["Funções", profile.functions.map((item) => item.name).join(", ") || "—"],
    ["Matrícula", profile.registration ?? "—"],
    ["Telefone", formatPhone(profile.phone)],
  ];

  return (
    <Card>
      <CardHeader
        title="Cadastro na banda"
        description="Mantido pelos gestores. Viu algo errado? Avise um gestor."
      />
      <CardBody>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-soft">{label}</dt>
              <dd className="text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}
