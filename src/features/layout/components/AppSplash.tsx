"use client";

import { useEffect, useState } from "react";
import { Spinner, cn } from "@/design-system";
import { LogoMark } from "@/features/layout/components/LogoMark";

/** Shortest time on screen since the app opened, so it doesn't just flash. */
const MIN_VISIBLE_MS = 700;
const FADE_MS = 300;

// Opening screen of the app (like Amore Mio's): it comes in the first HTML of
// the page, before the session and the data load, and fades out as soon as the
// app is interactive (hydrated) — not on window "load", which also waits for
// every image and font. Lives in the root layout, so moving between pages
// never shows it again; only opening or reloading the app does. If scripts
// never run, a CSS animation (globals.css) still takes it away.
export function AppSplash() {
  const [stage, setStage] = useState<"shown" | "leaving" | "gone">("shown");

  useEffect(() => {
    let timer = window.setTimeout(
      () => {
        setStage("leaving");
        timer = window.setTimeout(() => setStage("gone"), FADE_MS);
      },
      Math.max(0, MIN_VISIBLE_MS - performance.now()),
    );
    return () => window.clearTimeout(timer);
  }, []);

  if (stage === "gone") return null;
  return (
    <div
      role="status"
      aria-label="Carregando o PM SHOW"
      className={cn(
        "app-splash fixed inset-0 z-[100] flex flex-col items-center justify-center bg-linear-to-br from-chrome-top via-chrome to-chrome-bottom px-6 text-chrome-fg transition-opacity duration-300",
        stage === "leaving" && "pointer-events-none opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-6">
          <span className="grid size-28 place-items-center rounded-full border border-brand-gold/40 bg-chrome-hover">
            <LogoMark className="size-full" />
          </span>
          <div className="text-center">
            <p className="text-4xl font-semibold tracking-wide">
              PM <span className="text-brand-gold">SHOW</span>
            </p>
            <p className="mt-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase">
              Banda da Polícia Militar de Goiás
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Spinner className="text-brand-gold" label="Carregando" />
          <span className="text-[13px] font-medium text-chrome-muted">
            Carregando informações...
          </span>
        </div>
      </div>
    </div>
  );
}
