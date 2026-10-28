"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Search, X } from "lucide-react";
import { Card, CardBody, cn, inputClasses } from "@/design-system";
import { HelpTopicContent } from "@/features/help/components/HelpTopicContent";
import {
  sectionsFor,
  visibleTopics,
  type HelpTopic,
} from "@/features/help/model/help-topics";
import { useViewer } from "@/features/layout/components/ViewerContext";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

// The help page's body: a search that suggests the topics as you type (and
// filters the cards), the topics this person can read — each one collapsed
// to its title until opened — and a "back to top" button once the page is
// scrolled down.
export function HelpBrowser() {
  const viewer = useViewer();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [highlight, setHighlight] = useState<string | null>(null);
  // Topics opened by the person (all start closed).
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const box = useRef<HTMLDivElement>(null);

  const topics = useMemo(
    () => (viewer ? visibleTopics(viewer.permissions, viewer.showAdmin) : []),
    [viewer],
  );
  // Everything a topic says, to search by any word of it.
  const searchable = useMemo(
    () =>
      new Map(
        topics.map((topic) => [
          topic.id,
          normalize(
            [
              topic.title,
              topic.tour,
              ...sectionsFor(topic, viewer?.permissions ?? []).flatMap(
                (section) => [section.title, ...section.items],
              ),
            ].join(" "),
          ),
        ]),
      ),
    [topics, viewer],
  );
  const term = normalize(query.trim());
  const matches = term
    ? topics.filter((topic) => searchable.get(topic.id)?.includes(term))
    : topics;

  // Closes the suggestions when clicking elsewhere.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!viewer) return null;

  function choose(topic: HelpTopic) {
    setOpen(false);
    setQuery(topic.title);
    setHighlight(topic.id);
    // The chosen topic opens.
    setExpanded((current) => new Set(current).add(topic.id));
    // After the filter re-renders the card.
    requestAnimationFrame(() =>
      document
        .getElementById(topic.id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  return (
    <>
      <div ref={box} className="relative mb-6 max-w-xl">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-soft"
        />
        <input
          type="search"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Buscar na ajuda"
          placeholder="Buscar ajuda: digite um menu ou um assunto (ex.: troca, anexo, senha)"
          className={cn(inputClasses, "pr-9 pl-9")}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlight(null);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (!matches.length) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((current) => (current + 1) % matches.length);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive(
                (current) => (current - 1 + matches.length) % matches.length,
              );
            } else if (event.key === "Enter" && open) {
              event.preventDefault();
              choose(matches[Math.min(active, matches.length - 1)]!);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setHighlight(null);
            }}
            aria-label="Limpar a busca"
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-soft hover:bg-surface-muted hover:text-fg"
          >
            <X className="size-4" />
          </button>
        )}
        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-pop"
          >
            {matches.length === 0 ? (
              <li className="px-3 py-2.5 text-[13px] text-soft">
                Nada encontrado. Tente outra palavra.
              </li>
            ) : (
              matches.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <li
                    key={topic.id}
                    role="option"
                    aria-selected={index === active}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      choose(topic);
                    }}
                    onMouseEnter={() => setActive(index)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-[13px]",
                      index === active
                        ? "bg-accent-soft text-fg"
                        : "text-muted",
                    )}
                  >
                    <Icon
                      aria-hidden
                      className="size-4 shrink-0 text-brand-gold-ink"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-fg">
                        {topic.title}
                      </span>
                      <span className="block truncate text-xs text-soft">
                        {topic.tour}
                      </span>
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      {matches.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-soft">
          Nenhuma ajuda com “{query.trim()}”.
        </p>
      ) : (
        <div className="grid items-start gap-3 lg:grid-cols-2">
          {matches.map((topic) => {
            const Icon = topic.icon;
            const isOpen = expanded.has(topic.id);
            return (
              <Card
                key={topic.id}
                id={topic.id}
                className={cn(
                  "scroll-mt-20 overflow-hidden transition-shadow",
                  highlight === topic.id && "ring-2 ring-brand-gold",
                )}
              >
                <h2>
                  <button
                    type="button"
                    onClick={() => toggle(topic.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${topic.id}-content`}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted sm:px-5",
                      isOpen && "border-b border-border",
                    )}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-semibold text-fg">
                      {topic.title}
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-4 shrink-0 text-soft transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </h2>
                {isOpen && (
                  <CardBody id={`${topic.id}-content`}>
                    <HelpTopicContent
                      topic={topic}
                      permissions={viewer.permissions}
                    />
                  </CardBody>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <BackToTop />
    </>
  );
}

// Appears once the page is scrolled down a bit.
function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 400);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
      className={cn(
        "fixed right-4 bottom-20 z-30 grid size-11 place-items-center rounded-full bg-accent text-accent-fg shadow-pop transition-all hover:bg-accent-hover sm:right-6 sm:bottom-8",
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
