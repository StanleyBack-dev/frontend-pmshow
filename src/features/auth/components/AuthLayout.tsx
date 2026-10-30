import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarCheck, ListMusic, Smartphone } from "lucide-react";
import { cn } from "@/design-system";
import { LogoMark } from "@/features/layout/components/LogoMark";

const HIGHLIGHTS = [
  { icon: CalendarCheck, text: "Agenda e escalas com aviso no celular" },
  { icon: ListMusic, text: "Repertório com áudios e vídeos para ensaiar" },
  { icon: Smartphone, text: "Instale como aplicativo na tela inicial" },
];

/** Five staff lines, faint, behind the brand panel. */
function StaffLines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 80"
      preserveAspectRatio="none"
      className={className}
    >
      {[8, 24, 40, 56, 72].map((y) => (
        <line
          key={y}
          x1="0"
          x2="600"
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

// Frame of the signed-out pages (login, recovery, first access). Desktop:
// the band's panel on the dark chrome next to the form on light paper.
// Phones: the mark on top and the form below, nothing else in the way.
export function AuthLayout({
  title,
  description,
  children,
  wide = false,
}: {
  /** Omit when the content draws its own heading (e.g. a flow by steps). */
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  /** Room for a longer form (e.g. the public sign-up). */
  wide?: boolean;
}) {
  return (
    <main className="grid min-h-dvh bg-bg lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-chrome-top via-chrome to-chrome-bottom p-12 text-chrome-fg lg:flex">
        <StaffLines className="absolute inset-x-0 top-1/3 h-24 w-full text-chrome-fg/[0.06]" />
        <StaffLines className="absolute inset-x-0 bottom-1/4 h-24 w-full text-chrome-fg/[0.04]" />

        <div className="relative flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full border border-brand-gold/40 bg-chrome-hover">
            <LogoMark className="size-full" />
          </span>
          <span>
            <span className="block text-xl font-semibold tracking-wide">
              PM <span className="text-brand-gold">SHOW</span>
            </span>
            <span className="block text-[11px] tracking-[0.18em] text-chrome-muted uppercase">
              Banda da Polícia Militar de Goiás
            </span>
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-gold uppercase">
            Disciplina e música
          </p>
          <h2 className="mt-3 text-4xl leading-tight font-semibold">
            A banda inteira no mesmo compasso.
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px]">
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-brand-gold/30 bg-brand-gold/10 text-brand-gold">
                  <Icon aria-hidden className="size-[18px]" />
                </span>
                <span className="text-chrome-muted">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          {/* The Goiás flag colors, as a thin band. */}
          <div
            aria-hidden
            className="mb-4 flex h-1 w-24 overflow-hidden rounded-full"
          >
            <span className="flex-1 bg-accent" />
            <span className="flex-1 bg-brand-gold" />
            <span className="flex-1 bg-info" />
          </div>
          <p className="text-xs text-chrome-subtle">
            Acesso restrito aos integrantes da banda.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className={cn("w-full", wide ? "max-w-xl" : "max-w-sm")}>
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <span className="mb-3 grid size-16 place-items-center rounded-full bg-linear-to-br from-chrome-top to-chrome-bottom shadow-pop">
              <LogoMark className="size-full" />
            </span>
            <p className="text-2xl font-semibold tracking-wide text-fg">
              PM <span className="text-brand-gold-ink">SHOW</span>
            </p>
            <p className="mt-1 text-xs tracking-[0.14em] text-muted uppercase">
              Banda da Polícia Militar de Goiás
            </p>
          </div>

          {title && <h1 className="text-2xl font-semibold text-fg">{title}</h1>}
          {description && (
            <p className="mt-1.5 text-sm text-muted">{description}</p>
          )}
          <div className={title ? "mt-7" : undefined}>{children}</div>

          <p className="mt-10 text-center text-xs text-soft">
            <Link href="/termos" className="hover:text-fg hover:underline">
              Termos de uso e privacidade
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
