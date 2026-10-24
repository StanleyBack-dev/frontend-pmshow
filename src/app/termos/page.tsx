import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/design-system";
import { Logo } from "@/features/layout/components/Logo";

export const metadata: Metadata = { title: "Termos de uso e privacidade" };

const UPDATED_AT = "24/10/2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-base font-semibold text-fg">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

// Public (signed in or not): what the app is for, which personal data it
// keeps and for how long (LGPD), and the copyright terms of the audio files.
export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-bg px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
          >
            <ArrowLeft className="size-4" /> Voltar ao app
          </Link>
        </div>
        <Card className="space-y-6 p-6 sm:p-8">
          <header>
            <h1 className="text-xl font-semibold text-fg">
              Termos de uso e privacidade
            </h1>
            <p className="mt-1 text-xs text-soft">
              Última atualização: {UPDATED_AT}
            </p>
          </header>

          <Section title="Para que serve o app">
            <p>
              O PM SHOW organiza o repertório, a agenda, as escalas e os avisos
              da Banda da Polícia Militar de Goiás. O acesso é restrito aos
              integrantes e à equipe da banda, com conta pessoal e
              intransferível criada por um gestor.
            </p>
          </Section>

          <Section title="Quais dados pessoais o app guarda">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Conta: nome, e-mail e usuário. A senha é guardada só de forma
                cifrada e ninguém, nem os gestores, consegue vê-la.
              </li>
              <li>
                Cadastro na banda: nome de guerra, posto ou graduação,
                matrícula, telefone, naipe e instrumentos.
              </li>
              <li>
                Escalas, respostas de ciência e pedidos de troca;
                indisponibilidades (tipo, período e observação).
              </li>
              <li>
                Segurança: endereço IP e navegador de cada sessão, e um registro
                das ações administrativas (auditoria).
              </li>
            </ul>
            <p>
              Ao pedir uma indisponibilidade, não informe diagnóstico nem outros
              dados de saúde: o tipo (por exemplo, dispensa médica) e o período
              bastam.
            </p>
          </Section>

          <Section title="Quem vê o quê">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Matrícula e telefone: só quem tem permissão de ver os músicos
                (gestores).
              </li>
              <li>
                Uma escala publicada: os gestores e quem está nela. O rascunho,
                só os gestores.
              </li>
              <li>
                Suas indisponibilidades: você e os gestores que as analisam.
              </li>
            </ul>
          </Section>

          <Section title="Por quanto tempo">
            <ul className="list-disc space-y-1 pl-5">
              <li>Sessões encerradas (IP e navegador): 30 dias.</li>
              <li>Códigos de recuperação de senha: 7 dias depois de vencer.</li>
              <li>Notificações lidas: 1 ano.</li>
              <li>
                Dados da conta e do cadastro: enquanto você fizer parte da
                banda. A conta desativada deixa de entrar no app.
              </li>
              <li>
                A auditoria das ações administrativas é mantida para prestação
                de contas.
              </li>
            </ul>
          </Section>

          <Section title="Seus direitos">
            <p>
              Você pode ver e corrigir seu nome e e-mail em{" "}
              <Link href="/perfil" className="text-accent hover:underline">
                Meu perfil
              </Link>
              , escolher quais avisos recebe por e-mail e desativar as
              notificações em cada aparelho. Para corrigir o cadastro na banda,
              saber o que está guardado ou pedir a exclusão dos seus dados, fale
              com um gestor da banda.
            </p>
          </Section>

          <Section title="Áudios, vídeos e direitos autorais">
            <p>
              Os áudios do repertório servem só para estudo e ensaio internos da
              banda. É proibido publicar, compartilhar ou distribuir os arquivos
              fora do app. Os direitos das obras pertencem aos seus autores e
              titulares. Os vídeos são exibidos a partir do YouTube, que segue
              as próprias regras.
            </p>
          </Section>

          <Section title="Segurança">
            <p>
              Não compartilhe sua senha. Depois de várias tentativas erradas, a
              conta é bloqueada por alguns minutos. Se notar algo estranho, como
              um aviso de troca de senha que você não fez, avise um gestor.
            </p>
          </Section>
        </Card>
      </div>
    </main>
  );
}
