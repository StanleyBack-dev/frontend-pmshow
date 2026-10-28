"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CircleHelp, PartyPopper, Sparkles, UserRound, X } from "lucide-react";
import { Button, cn } from "@/design-system";
import {
  visibleTopics,
  type HelpTopic,
} from "@/features/help/model/help-topics";
import type { Permission } from "@/shared/contracts/api";

type Step = {
  id: string;
  title: string;
  description: ReactNode;
  icon: ReactNode;
  /** What the spotlight frames on larger screens (none: centered card). */
  target?: string;
};

const SPOTLIGHT_PADDING = 6;
const GAP = 16;
const EDGE = 16;
const CARD_WIDTH = 360;

/** The tour, built from the manual and the menus this person can open. */
function stepsFor(
  name: string,
  permissions: readonly Permission[],
  showAdmin: boolean,
): Step[] {
  const topics = visibleTopics(permissions, showAdmin);
  const main = topics.filter((topic) => topic.area === "main");
  const account = topics.filter((topic) => topic.area === "account");
  const stepOf = (topic: HelpTopic): Step => {
    const Icon = topic.icon;
    return {
      id: topic.id,
      title: topic.title,
      description: topic.tour,
      icon: <Icon className="size-5" />,
      target: `[data-tour-nav="${topic.href}"]`,
    };
  };
  return [
    {
      id: "welcome",
      title: `Bem-vindo ao PM SHOW, ${name}!`,
      description:
        "Vamos mostrar rapidinho os menus que você pode usar e para que serve cada um. Leva menos de um minuto e dá para pular quando quiser.",
      icon: <Sparkles className="size-6" />,
    },
    ...main.map(stepOf),
    {
      id: "account",
      title: "Sua conta",
      description: (
        <>
          No menu <strong>Conta</strong>, no rodapé da barra lateral:{" "}
          {account.map((topic) => topic.title).join(", ")}. Em{" "}
          <strong>Ajuda</strong> está o guia de cada menu e em{" "}
          <strong>Suporte</strong> você fala com a administração do sistema.
        </>
      ),
      icon: <UserRound className="size-5" />,
      target: '[data-tour="account"]',
    },
    {
      id: "done",
      title: "Pronto! Você já sabe o essencial",
      description: (
        <>
          Em cada página, o ícone{" "}
          <CircleHelp
            aria-label="de ajuda"
            className="inline size-4 align-text-bottom"
          />{" "}
          ao lado do título explica tudo sobre ela. A apresentação pode ser
          revista em Ajuda.
        </>
      ),
      icon: <PartyPopper className="size-6" />,
    },
  ];
}

// The guided tour (like Vaulto's onboarding): shown on the first access and
// whenever the person asks to see it again. It frames each menu item in the
// sidebar; on phones it opens the menu drawer first and puts the card above
// or below the item (there is no room beside it).
export function OnboardingTour({
  open,
  name,
  permissions,
  showAdmin,
  onFinish,
  onMobileMenu,
}: {
  open: boolean;
  name: string;
  permissions: readonly Permission[];
  showAdmin: boolean;
  /** Finished or skipped. */
  onFinish: () => void;
  /** Opens or closes the phone menu drawer (where the items are). */
  onMobileMenu: (open: boolean) => void;
}) {
  const steps = useMemo(
    () => stepsFor(name, permissions, showAdmin),
    [name, permissions, showAdmin],
  );
  const [index, setIndex] = useState(0);
  const step = steps[Math.min(index, steps.length - 1)]!;
  const last = index >= steps.length - 1;
  const rect = useTargetRect(open ? step.target : undefined);

  // Phones: the menu lives in a drawer. Open it for the steps about menu
  // items, close it for the welcome and closing cards and at the end.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    onMobileMenu(open && Boolean(step.target));
  }, [open, step.target, onMobileMenu]);

  // Each opening starts from the first step.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setIndex(0));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Esc skips, like the "X".
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onFinish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onFinish]);

  if (!open) return null;

  const next = () => (last ? onFinish() : setIndex(index + 1));
  const card = (
    <TourCard
      step={step}
      index={index}
      total={steps.length}
      onNext={next}
      onBack={() => setIndex(Math.max(0, index - 1))}
      onSkip={onFinish}
      last={last}
    />
  );

  if (rect) {
    const hole = {
      x: rect.left - SPOTLIGHT_PADDING,
      y: rect.top - SPOTLIGHT_PADDING,
      width: rect.width + SPOTLIGHT_PADDING * 2,
      height: rect.height + SPOTLIGHT_PADDING * 2,
    };
    // Larger screens: beside the item. Phones: the full width, below the
    // item, or above it when the item is in the lower half.
    const wide = window.innerWidth >= 1024;
    const width = wide
      ? CARD_WIDTH
      : Math.min(CARD_WIDTH + 40, window.innerWidth - EDGE * 2);
    const below = rect.top + rect.height / 2 < window.innerHeight / 2;
    const position = wide
      ? {
          top: Math.min(
            Math.max(rect.top + rect.height / 2 - 110, EDGE),
            window.innerHeight - 260,
          ),
          left: Math.min(
            rect.right + GAP,
            window.innerWidth - CARD_WIDTH - EDGE,
          ),
        }
      : below
        ? { top: hole.y + hole.height + GAP, left: EDGE }
        : { bottom: window.innerHeight - hole.y + GAP, left: EDGE };
    return (
      <div
        className="fixed inset-0 z-[90]"
        role="dialog"
        aria-modal="true"
        aria-label="Apresentação do app"
      >
        {/* The page dimmed, with a hole over the menu item (an SVG path:
            a huge box-shadow is not always painted). Also blocks clicks. */}
        <svg
          aria-hidden
          className="absolute inset-0 size-full"
          width="100%"
          height="100%"
        >
          <path
            fillRule="evenodd"
            fill="rgba(6, 10, 7, 0.72)"
            d={`M0 0H${window.innerWidth}V${window.innerHeight}H0Z M${hole.x} ${hole.y}h${hole.width}v${hole.height}h${-hole.width}Z`}
          />
        </svg>
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-lg border-2 border-brand-gold transition-all duration-300 ease-out"
          style={{
            top: hole.y,
            left: hole.x,
            width: hole.width,
            height: hole.height,
          }}
        />
        <div
          className="fixed transition-all duration-300 ease-out"
          style={{ ...position, width }}
        >
          {card}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Apresentação do app"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md">{card}</div>
    </div>
  );
}

function TourCard({
  step,
  index,
  total,
  last,
  onNext,
  onBack,
  onSkip,
}: {
  step: Step;
  index: number;
  total: number;
  last: boolean;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const centered = !step.target;
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface text-fg shadow-pop">
      <button
        type="button"
        onClick={onSkip}
        aria-label="Pular apresentação"
        className="absolute top-3 right-3 grid size-7 place-items-center rounded-full text-soft transition-colors hover:bg-surface-muted hover:text-fg"
      >
        <X className="size-4" />
      </button>
      <div
        className={cn(
          "flex gap-3 px-5 pt-5 pb-4",
          centered ? "flex-col items-center pt-8 text-center" : "pr-10",
        )}
      >
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-full bg-linear-to-br from-chrome to-accent text-brand-gold",
            centered ? "size-14" : "size-10",
          )}
        >
          {step.icon}
        </span>
        <div className="min-w-0">
          <h2
            className={cn(
              "font-semibold",
              centered ? "text-lg" : "text-[15px]",
            )}
          >
            {step.title}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {step.description}
          </p>
        </div>
      </div>
      <div className="space-y-3 border-t border-border bg-surface-muted px-5 py-3.5">
        <div
          className="flex flex-wrap items-center justify-center gap-1.5"
          aria-label={`Passo ${index + 1} de ${total}`}
        >
          {Array.from({ length: total }, (_, dot) => (
            <span
              key={dot}
              className={cn(
                "h-1.5 rounded-full transition-all",
                dot === index ? "w-5 bg-accent" : "w-1.5 bg-border-strong",
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={index === 0 ? onSkip : onBack}
          >
            {index === 0 ? "Pular" : "Voltar"}
          </Button>
          <span className="text-xs text-soft tabular-nums">
            {index + 1}/{total}
          </span>
          <Button size="sm" onClick={onNext}>
            {last ? "Começar a usar" : "Próximo"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Where `selector` is on screen (null while it is off-screen, e.g. the phone
 * drawer still sliding in). Follows scrolling and resizing.
 */
function useTargetRect(selector: string | undefined) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const measure = () => {
      const element = selector
        ? document.querySelector<HTMLElement>(selector)
        : null;
      const box = element?.getBoundingClientRect();
      const onScreen =
        box && box.width > 0 && box.left >= 0 && box.right <= window.innerWidth;
      setRect(onScreen ? box : null);
    };
    if (selector) {
      document
        .querySelector<HTMLElement>(selector)
        ?.scrollIntoView({ block: "nearest" });
    }
    const frame = requestAnimationFrame(measure);
    // The phone drawer slides in (300 ms): measure again once it is there.
    const settle = window.setTimeout(() => {
      if (selector) {
        document
          .querySelector<HTMLElement>(selector)
          ?.scrollIntoView({ block: "nearest" });
      }
      measure();
    }, 350);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [selector]);

  return selector ? rect : null;
}
