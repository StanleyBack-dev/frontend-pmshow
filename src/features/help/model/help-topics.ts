import {
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CalendarOff,
  CalendarRange,
  CircleHelp,
  CircleUserRound,
  ClipboardList,
  Guitar,
  House,
  LifeBuoy,
  ListMusic,
  MapPin,
  Megaphone,
  MicVocal,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/shared/contracts/api";

// The app's manual, in one place: the help page (Ajuda), the help button in
// each page's header and the guided tour (onboarding) all read from here.
// Items marked `only` show to whoever has any of those permissions, so each
// person reads what applies to them.

export type HelpItem = {
  text: string;
  /** Shown only with any of these permissions. */
  only?: Permission[];
};

export type HelpSectionKind =
  "purpose" | "howto" | "rules" | "access" | "notices";

export const HELP_SECTION_TITLES: Record<HelpSectionKind, string> = {
  purpose: "Para que serve",
  howto: "Como usar",
  rules: "Regras importantes",
  access: "Quem pode fazer o quê",
  notices: "Avisos e notificações",
};

export type HelpTopic = {
  id: string;
  /** The page (and the pages under it) the topic explains. */
  href: string;
  title: string;
  icon: LucideIcon;
  /** Same rule as the menu: visible with this permission… */
  permission?: Permission;
  /** …or with any of these. */
  anyPermission?: Permission[];
  /** Only for who sees the admin area. */
  admin?: boolean;
  /** Where the topic lives in the menu (tour and help page). */
  area: "main" | "account";
  /** One or two lines for the guided tour. */
  tour: string;
  sections: Partial<Record<HelpSectionKind, HelpItem[]>>;
};

const MANAGERS_EVENTS: Permission[] = ["EVENTS_MANAGE"];
const ROSTER_BUILDERS: Permission[] = ["ROSTERS_MANAGE"];

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "inicio",
    href: "/inicio",
    title: "Início",
    icon: House,
    area: "main",
    tour: "O resumo do seu dia: próximos eventos, seus expedientes e as escalas que esperam a sua ciência.",
    sections: {
      purpose: [
        {
          text: "Mostrar logo ao entrar o que importa agora: próximos eventos, seus expedientes e escalas pendentes.",
        },
        {
          text: "Gestores também veem o painel da banda: integrantes ativos, eventos dos próximos 30 dias, ciências pendentes, pedidos de troca e indisponibilidades a analisar.",
          only: ["ROSTERS_READ_ALL"],
        },
      ],
      howto: [
        {
          text: "Toque num evento para abrir a página dele, com local, horários, músicas e escala.",
        },
        {
          text: "Em “Minhas escalas”, os eventos que ainda esperam a sua ciência aparecem primeiro.",
          only: ["ROSTERS_READ_OWN"],
        },
        {
          text: "Os cartões do painel levam direto à lista correspondente (ex.: ciências pendentes leva aos pedidos de troca quando houver).",
          only: ["ROSTERS_READ_ALL"],
        },
      ],
    },
  },
  {
    id: "agenda",
    href: "/agenda",
    title: "Agenda",
    icon: CalendarDays,
    permission: "EVENTS_READ",
    area: "main",
    tour: "O calendário do mês com apresentações, desfiles, ensaios e os seus expedientes. O que você está escalado aparece em destaque.",
    sections: {
      purpose: [
        {
          text: "Ver o mês da banda num calendário e numa lista: eventos e expedientes.",
        },
      ],
      howto: [
        {
          text: "Use as setas para trocar de mês e “Hoje” para voltar ao mês atual.",
        },
        {
          text: "Em dourado ficam os eventos em que você está escalado; em azul, os seus expedientes.",
        },
        {
          text: "“Só os meus” mostra apenas o que é seu. Toque num dia ou num evento para ver os detalhes.",
        },
      ],
      rules: [
        {
          text: "Expedientes aparecem só para quem está neles; eventos cancelados aparecem riscados.",
        },
      ],
    },
  },
  {
    id: "eventos",
    href: "/eventos",
    title: "Eventos",
    icon: CalendarClock,
    permission: "EVENTS_READ",
    area: "main",
    tour: "Todas as apresentações com detalhes, lista de músicas, mapa do local e escalados.",
    sections: {
      purpose: [
        {
          text: "Consultar os eventos da banda: data, horários, local, uniforme, músicas e escala.",
        },
        {
          text: "Cadastrar e organizar os eventos: dados, lista de músicas e escala dos músicos.",
          only: MANAGERS_EVENTS,
        },
      ],
      howto: [
        {
          text: "Use os filtros (próximos ou passados, tipo, situação e busca) para achar um evento.",
        },
        {
          text: "Abra a seta da linha para ver tudo sem sair da tabela: horários, local, pedido, escalados e os botões Músicas PDF, Abrir no mapa e Lista de músicas.",
        },
        {
          text: "“Novo evento” cadastra um evento; o lápis edita; a situação muda direto na tabela.",
          only: MANAGERS_EVENTS,
        },
        {
          text: "Na coluna Escala, “Montar” abre o editor de escala: escolha os integrantes e defina a função de cada um.",
          only: ROSTER_BUILDERS,
        },
        {
          text: "Publique a escala para que os escalados sejam avisados e possam dar ciência.",
          only: ["ROSTERS_PUBLISH"],
        },
      ],
      rules: [
        {
          text: "Uniforme e local são obrigatórios. O link do mapa é gerado pelo endereço do local.",
          only: MANAGERS_EVENTS,
        },
        {
          text: "Cancelar exige um motivo e trava a edição até o evento ser reaberto.",
          only: MANAGERS_EVENTS,
        },
        {
          text: "Na escala, quem está com indisponibilidade aprovada ou afastado fica bloqueado; quem já está em outro evento no mesmo horário precisa de justificativa.",
          only: ROSTER_BUILDERS,
        },
        {
          text: "Rascunhos de escala só aparecem para os gestores; a escala publicada aparece para toda a banda, sem telefone e matrícula.",
        },
      ],
      access: [
        {
          text: "Todos com acesso à agenda veem os eventos e as escalas publicadas.",
        },
        {
          text: "Você pode cadastrar, editar e mudar a situação dos eventos.",
          only: MANAGERS_EVENTS,
        },
        {
          text: "Você pode montar escalas.",
          only: ROSTER_BUILDERS,
        },
      ],
      notices: [
        {
          text: "Quem está escalado é avisado no app e por e-mail quando o horário ou o local muda e quando o evento é cancelado, com o nome do gestor que fez a mudança.",
        },
      ],
    },
  },
  {
    id: "locais",
    href: "/locais",
    title: "Locais",
    icon: MapPin,
    permission: "EVENTS_MANAGE",
    area: "main",
    tour: "Onde a banda se apresenta: endereço completo e mapa, reaproveitados em todos os eventos.",
    sections: {
      purpose: [
        {
          text: "Cadastrar uma vez cada lugar e usá-lo em quantos eventos precisar.",
        },
      ],
      howto: [
        {
          text: "Em “Novo local”, digite o CEP: rua, bairro, cidade e UF são preenchidos sozinhos.",
        },
        {
          text: "O link do mapa é gerado pelo endereço; confira no ícone ao lado ou cole o link do ponto exato.",
        },
        {
          text: "Arquive um local que não é mais usado: ele some das listas, mas os eventos antigos continuam com ele.",
        },
      ],
    },
  },
  {
    id: "escalas",
    href: "/escalas",
    title: "Escalas",
    icon: ClipboardList,
    permission: "ROSTERS_READ_OWN",
    area: "main",
    tour: "Os eventos em que você está escalado. Confirme a ciência ou peça troca, com o motivo.",
    sections: {
      purpose: [
        { text: "Acompanhar as suas escalas e responder a cada uma." },
        {
          text: "Resolver os pedidos de troca da banda (aba “Pedidos de troca”).",
          only: ROSTER_BUILDERS,
        },
      ],
      howto: [
        {
          text: "“Não cientes” lista o que espera resposta; “Cientes”, o que você já confirmou.",
        },
        {
          text: "“Estou ciente” confirma. “Pedir troca” pede para ser substituído e exige um motivo.",
        },
        {
          text: "Em “Pedidos de troca”: Substituir escolhe outra pessoa para a mesma função; Manter na escala recusa a troca.",
          only: ROSTER_BUILDERS,
        },
      ],
      rules: [
        {
          text: "Só é possível responder escalas publicadas de eventos que ainda vão acontecer.",
        },
        { text: "Se a sua função mudar, a ciência volta a ser pedida." },
        {
          text: "Ninguém resolve o próprio pedido de troca: outro gestor precisa analisar.",
          only: ROSTER_BUILDERS,
        },
      ],
      notices: [
        {
          text: "Você é avisado no app e por e-mail quando é escalado, quando sua função muda e quando sai da escala, com o nome do gestor.",
        },
        { text: "Lembretes chegam na véspera e na manhã do evento." },
        {
          text: "Se a troca não for aceita, você é avisado com o nome do gestor e a observação.",
        },
        {
          text: "Todos os gestores são avisados quando alguém pede troca.",
          only: ROSTER_BUILDERS,
        },
      ],
    },
  },
  {
    id: "expedientes",
    href: "/expedientes",
    title: "Expedientes",
    icon: CalendarRange,
    permission: "ROSTERS_READ_OWN",
    area: "main",
    tour: "Os seus dias de trabalho da semana ou do mês, com entrada e saída de cada dia.",
    sections: {
      purpose: [
        { text: "Ver os dias e horários de expediente em que você está." },
        {
          text: "Lançar expedientes para a banda e cancelar um lote quando preciso.",
          only: ROSTER_BUILDERS,
        },
      ],
      howto: [
        {
          text: "“Novo expediente”: escolha semana ou mês, os dias, os horários (iguais para todos os dias ou dia a dia), o local e quem participa (todos, naipes ou integrantes).",
          only: ROSTER_BUILDERS,
        },
        {
          text: "Na aba “Lançados”, cancele um expediente informando o motivo.",
          only: ROSTER_BUILDERS,
        },
      ],
      rules: [
        { text: "Expediente não pede ciência: ele já entra publicado." },
        {
          text: "Quem tem indisponibilidade aprovada num dia fica fora desse dia.",
        },
      ],
      notices: [
        {
          text: "Você recebe um único aviso (app e e-mail) com todos os seus dias quando um expediente é lançado, e outro se ele for cancelado.",
        },
      ],
    },
  },
  {
    id: "repertorio",
    href: "/repertorio",
    title: "Repertório",
    icon: ListMusic,
    permission: "REPERTOIRE_READ",
    area: "main",
    tour: "As músicas da banda com áudios para ouvir e vídeos para ensaiar, a letra e o tom.",
    sections: {
      purpose: [
        { text: "Estudar as músicas: ouvir, assistir, ver letra e tom." },
      ],
      howto: [
        {
          text: "Busque por título, intérprete ou filtros; abra a música para ver áudios, vídeos e letra.",
        },
        { text: "O player continua tocando enquanto você navega pelo app." },
        {
          text: "Cadastre e edite músicas (título, intérprete, tom, letra, vídeos).",
          only: ["REPERTOIRE_MANAGE"],
        },
        { text: "Envie áudios da música.", only: ["MEDIA_UPLOAD"] },
        {
          text: "Baixe os áudios para ouvir sem internet.",
          only: ["MEDIA_DOWNLOAD"],
        },
      ],
    },
  },
  {
    id: "cantores",
    href: "/cantores",
    title: "Cantores e bandas",
    icon: MicVocal,
    permission: "REPERTOIRE_READ",
    area: "main",
    tour: "Os intérpretes das músicas do repertório, usados no cadastro e nos filtros.",
    sections: {
      purpose: [
        { text: "Organizar os intérpretes para achar as músicas mais rápido." },
      ],
      howto: [
        { text: "Use a busca e os filtros para encontrar um cantor ou banda." },
        { text: "Cadastre ou edite intérpretes.", only: ["REPERTOIRE_MANAGE"] },
      ],
    },
  },
  {
    id: "musicos",
    href: "/musicos",
    title: "Músicos",
    icon: Users,
    permission: "MEMBERS_READ",
    area: "main",
    tour: "Os integrantes da banda: posto, naipe, instrumentos, funções e situação.",
    sections: {
      purpose: [{ text: "Consultar os dados de cada integrante." }],
      howto: [
        { text: "Filtre por naipe, situação, posto ou busque pelo nome." },
        {
          text: "Abra a seta da linha para ver telefone, matrícula, instrumentos e funções.",
        },
        {
          text: "Edite o perfil de banda de um integrante (posto, naipe, instrumentos, funções, situação).",
          only: ["MEMBERS_MANAGE"],
        },
      ],
      rules: [
        { text: "Afastados e inativos não podem ser escalados." },
        {
          text: "Telefone e matrícula só aparecem para quem tem acesso aos dados dos músicos.",
        },
      ],
    },
  },
  {
    id: "instrumentos",
    href: "/instrumentos",
    title: "Instrumentos",
    icon: Guitar,
    permission: "MEMBERS_MANAGE",
    area: "main",
    tour: "Os instrumentos da banda por naipe, usados no cadastro dos músicos, nas escalas e no PDF.",
    sections: {
      howto: [
        {
          text: "Cadastre, edite ou arquive instrumentos e defina o naipe de cada um.",
        },
        { text: "O ícone de integrantes mostra quem toca aquele instrumento." },
      ],
    },
  },
  {
    id: "funcoes",
    href: "/funcoes",
    title: "Funções",
    icon: BriefcaseBusiness,
    permission: "MEMBERS_MANAGE",
    area: "main",
    tour: "O que cada um faz na banda além do instrumento (regente, motorista, técnico…).",
    sections: {
      howto: [
        { text: "Cadastre as funções e marque-as no perfil dos músicos." },
        {
          text: "Na escala, cada pessoa entra numa função; “Músico” é a função de quem toca.",
        },
      ],
    },
  },
  {
    id: "indisponibilidades",
    href: "/indisponibilidades",
    title: "Indisponibilidades",
    icon: CalendarOff,
    anyPermission: ["ABSENCES_REQUEST", "ABSENCES_MANAGE"],
    area: "main",
    tour: "Férias, licenças, dispensas e missões. Aprovadas, impedem a escala no período.",
    sections: {
      purpose: [
        {
          text: "Pedir e acompanhar os seus períodos indisponíveis.",
          only: ["ABSENCES_REQUEST"],
        },
        {
          text: "Analisar os pedidos da banda e lançar indisponibilidades.",
          only: ["ABSENCES_MANAGE"],
        },
      ],
      howto: [
        {
          text: "“Pedir indisponibilidade”: tipo, período, motivo e até 3 anexos (imagens ou PDF de até 5 MB cada).",
          only: ["ABSENCES_REQUEST"],
        },
        {
          text: "Em “Para analisar”, aprove ou recuse com uma observação; veja e baixe os anexos pela coluna Arquivos.",
          only: ["ABSENCES_MANAGE"],
        },
        {
          text: "“Lançar para integrante” registra uma indisponibilidade já aprovada.",
          only: ["ABSENCES_MANAGE"],
        },
      ],
      rules: [
        {
          text: "Aprovada, a indisponibilidade impede a escala e o expediente no período.",
        },
        {
          text: "Não é possível ter dois períodos abertos que se sobreponham.",
        },
        {
          text: "O colapse mostra o andamento: quem aprovou, recusou ou cancelou e quando.",
        },
      ],
      notices: [
        {
          text: "Os gestores são avisados de cada pedido.",
          only: ["ABSENCES_MANAGE"],
        },
        {
          text: "Você é avisado no app e por e-mail da resposta, com o nome de quem aprovou ou recusou.",
          only: ["ABSENCES_REQUEST"],
        },
      ],
    },
  },
  {
    id: "comunicados",
    href: "/comunicados",
    title: "Comunicados",
    icon: Megaphone,
    permission: "NOTIFICATIONS_BROADCAST",
    area: "main",
    tour: "Avisos para a banda inteira, um naipe ou os escalados de um evento.",
    sections: {
      howto: [
        { text: "Escolha o público, escreva o título e a mensagem e envie." },
        { text: "Marque “Também enviar por e-mail” para avisos importantes." },
      ],
      notices: [
        {
          text: "O aviso chega no app (e no celular, para quem ativou) com o seu nome.",
        },
      ],
    },
  },
  {
    id: "perfil",
    href: "/perfil",
    title: "Meu perfil",
    icon: CircleUserRound,
    area: "account",
    tour: "Sua foto e seus dados pessoais. O e-mail recebe escalas, avisos e a recuperação de senha.",
    sections: {
      howto: [
        {
          text: "Troque a foto de perfil: ela ajuda a banda a identificar você.",
        },
        { text: "Mantenha o e-mail atualizado para receber escalas e avisos." },
      ],
    },
  },
  {
    id: "notificacoes",
    href: "/notificacoes",
    title: "Notificações",
    icon: Bell,
    area: "account",
    tour: "Todos os avisos do app num só lugar; o sino no topo mostra os não lidos.",
    sections: {
      howto: [
        {
          text: "Toque num aviso para abrir o que ele trata e marcá-lo como lido.",
        },
        {
          text: "Escolha quais avisos também chegam por e-mail em Configurações → Notificações.",
        },
      ],
    },
  },
  {
    id: "suporte",
    href: "/suporte",
    title: "Suporte",
    icon: LifeBuoy,
    area: "account",
    tour: "Fale com a administração do sistema: até 3 solicitações por dia, com resposta no app e no e-mail.",
    sections: {
      howto: [
        {
          text: "Escolha a categoria, escreva o assunto e descreva o que precisa.",
        },
        { text: "Acompanhe a resposta em “Minhas solicitações”." },
        {
          text: "Na aba “Todas”, responda e finalize as solicitações da banda.",
          only: ["SUPPORT_MANAGE"],
        },
      ],
      rules: [
        {
          text: "Até 3 solicitações por dia; depois, o formulário mostra quanto falta para liberar.",
        },
        {
          text: "Cada solicitação recebe um protocolo (#000001) para referência.",
        },
      ],
      notices: [
        {
          text: "Você é avisado quando o suporte responde e quando a solicitação é finalizada.",
        },
        {
          text: "Você é avisado no app e por e-mail de cada nova solicitação.",
          only: ["SUPPORT_MANAGE"],
        },
      ],
    },
  },
  {
    id: "configuracoes",
    href: "/configuracoes",
    title: "Configurações",
    icon: Settings,
    area: "account",
    tour: "Senha, instalação do app no celular, notificações no aparelho e por e-mail, e os termos de uso.",
    sections: {
      howto: [
        {
          text: "Senha: troque a sua; as sessões em outros aparelhos são encerradas.",
        },
        {
          text: "Aplicativo: instale o PM SHOW na tela inicial e ative os avisos no aparelho (faça em cada celular ou computador).",
        },
        {
          text: "Notificações: escolha quais avisos também chegam por e-mail.",
        },
      ],
    },
  },
  {
    id: "ajuda",
    href: "/ajuda",
    title: "Ajuda",
    icon: CircleHelp,
    area: "account",
    tour: "Este guia: como usar cada menu de acordo com o que você pode fazer no app.",
    sections: {
      howto: [
        {
          text: "Cada página também tem o ícone de ajuda no título, com as informações daquela página.",
        },
        {
          text: "Use “Rever a apresentação” para ver o passo a passo de novo.",
        },
      ],
    },
  },
  {
    id: "admin",
    href: "/admin",
    title: "Administração",
    icon: ShieldCheck,
    admin: true,
    area: "account",
    tour: "Contas de acesso, permissões, cadastros pela página pública e links de convite.",
    sections: {
      howto: [
        {
          text: "Usuários: crie contas, defina o grupo (Músico, Gestor, Administrador geral), abra exceções de permissão, redefina senhas e desative contas.",
          only: ["USERS_MANAGE"],
        },
        {
          text: "Cadastros: aprove ou recuse quem se cadastrou pelo link; ao aprovar, a conta é criada e a senha temporária vai por e-mail.",
          only: ["USERS_MANAGE"],
        },
        {
          text: "Links de cadastro: gere o código da turma e compartilhe pelo WhatsApp.",
          only: ["USERS_MANAGE"],
        },
      ],
      rules: [
        {
          text: "Algumas permissões só vêm do grupo e não podem ser dadas a uma pessoa (contas, permissões, dados dos músicos, suporte).",
        },
      ],
    },
  },
];

/** The topics this person may read (same rule as the menu). */
export function visibleTopics(
  permissions: readonly Permission[],
  showAdmin: boolean,
): HelpTopic[] {
  return HELP_TOPICS.filter(
    (topic) =>
      (!topic.admin || showAdmin) &&
      (!topic.permission || permissions.includes(topic.permission)) &&
      (!topic.anyPermission ||
        topic.anyPermission.some((item) => permissions.includes(item))),
  );
}

/** The topic's sections with only the items for these permissions. */
export function sectionsFor(
  topic: HelpTopic,
  permissions: readonly Permission[],
): { kind: HelpSectionKind; title: string; items: string[] }[] {
  return (Object.keys(HELP_SECTION_TITLES) as HelpSectionKind[]).flatMap(
    (kind) => {
      const items = (topic.sections[kind] ?? [])
        .filter(
          (item) =>
            !item.only || item.only.some((p) => permissions.includes(p)),
        )
        .map((item) => item.text);
      return items.length > 0
        ? [{ kind, title: HELP_SECTION_TITLES[kind], items }]
        : [];
    },
  );
}

/** The topic of a page (the longest matching path). */
export function topicForPath(pathname: string): HelpTopic | null {
  return (
    HELP_TOPICS.filter(
      (topic) =>
        pathname === topic.href || pathname.startsWith(`${topic.href}/`),
    ).sort((a, b) => b.href.length - a.href.length)[0] ?? null
  );
}
