"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn, inputClasses } from "@/design-system";
import { RequiredMark } from "@/design-system/components/Field";

export type InstrumentChoice = { instrumentId: string; primary: boolean };

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

// Instruments / roles a person plays, with a star for the main one. The
// first one checked starts as the main one.
export function InstrumentChoices({
  instruments,
  value,
  onChange,
  hint = "Marque os que a pessoa toca ou exerce; a estrela indica o principal.",
  required = false,
  error,
}: {
  instruments: { id: string; name: string }[];
  value: InstrumentChoice[];
  onChange: (value: InstrumentChoice[]) => void;
  hint?: string;
  required?: boolean;
  error?: string;
}) {
  const [query, setQuery] = useState("");
  const selected = new Map(
    value.map((item) => [item.instrumentId, item.primary]),
  );
  const term = normalize(query.trim());
  const visible = term
    ? instruments.filter((item) => normalize(item.name).includes(term))
    : instruments;

  const toggle = (id: string) =>
    onChange(
      selected.has(id)
        ? value.filter((item) => item.instrumentId !== id)
        : [...value, { instrumentId: id, primary: value.length === 0 }],
    );

  const makePrimary = (id: string) =>
    onChange(
      value.map((item) => ({ ...item, primary: item.instrumentId === id })),
    );

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-fg">
        Instrumentos / funções
        {required && <RequiredMark />}
      </legend>
      <p className="mb-2 text-xs text-soft">{hint}</p>
      <div className="relative mb-2">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-soft"
        />
        <input
          type="search"
          aria-label="Procurar instrumento ou função"
          placeholder="Procurar instrumento ou função…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          // Enter must not submit the surrounding form.
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          className={cn(inputClasses, "pl-9")}
        />
      </div>
      {visible.length === 0 && (
        <p className="py-3 text-center text-xs text-soft">
          Nenhum instrumento ou função encontrado.
        </p>
      )}
      <div className="grid max-h-56 gap-1.5 overflow-y-auto sm:grid-cols-2">
        {visible.map((instrument) => {
          const checked = selected.has(instrument.id);
          const primary = selected.get(instrument.id) === true;
          return (
            <div
              key={instrument.id}
              className={cn(
                "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm",
                checked ? "border-accent bg-accent-soft" : "border-border",
              )}
            >
              <label className="flex flex-1 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--accent)]"
                  checked={checked}
                  onChange={() => toggle(instrument.id)}
                />
                <span className="text-fg">{instrument.name}</span>
              </label>
              {checked && (
                <button
                  type="button"
                  onClick={() => makePrimary(instrument.id)}
                  aria-pressed={primary}
                  aria-label={`Tornar ${instrument.name} o principal`}
                  title="Principal"
                  className={cn(
                    "text-base leading-none",
                    primary ? "text-brand-gold-ink" : "text-soft hover:text-fg",
                  )}
                >
                  {primary ? "★" : "☆"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="mt-1 text-[11px] font-medium text-danger">{error}</p>
      )}
    </fieldset>
  );
}
