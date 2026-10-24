import type { ReactNode } from "react";
import Link from "next/link";
import { LogoMark } from "@/features/layout/components/LogoMark";

// Frame of the signed-out pages (login, recovery, first access): the dark
// chrome with the band's mark above a light card (amoremio pattern).
export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-linear-to-b from-chrome-top via-chrome to-chrome-bottom px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center select-none">
          <span className="mb-4 grid size-16 place-items-center rounded-full border border-brand-gold/40 bg-chrome-hover shadow-lg">
            <LogoMark className="size-11 text-chrome-fg" />
          </span>
          <p className="text-3xl font-semibold tracking-wide text-chrome-fg">
            PM <span className="text-brand-gold">SHOW</span>
          </p>
          <p className="mt-1 text-[13px] text-chrome-muted">
            Banda da Polícia Militar de Goiás
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface px-6 py-7 shadow-pop sm:px-8">
          <h1 className="text-lg font-semibold text-fg">{title}</h1>
          {description && (
            <p className="mt-1 text-[13px] text-muted">{description}</p>
          )}
          <div className="mt-5">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-chrome-subtle">
          Acesso restrito aos integrantes da banda ·{" "}
          <Link
            href="/termos"
            className="text-chrome-muted hover:text-chrome-fg hover:underline"
          >
            Termos e privacidade
          </Link>
        </p>
      </div>
    </main>
  );
}
