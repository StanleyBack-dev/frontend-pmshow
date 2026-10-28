"use client";

import { Check } from "lucide-react";
import { cn } from "@/design-system";
import type { BandFunction } from "@/shared/contracts/members";

// Functions of a member besides playing (regente, motorista…), as toggles.
// Archived ones only show when the member already has them.
export function FunctionChoices({
  functions,
  value,
  onChange,
}: {
  functions: BandFunction[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const options = functions.filter(
    (item) => !item.archived || value.includes(item.id),
  );
  const toggle = (id: string) =>
    onChange(
      value.includes(id) ? value.filter((item) => item !== id) : [...value, id],
    );

  return (
    <fieldset className="space-y-2">
      <legend className="text-[13px] font-medium text-fg">
        Funções na banda
      </legend>
      <p className="text-xs text-soft">
        Além do instrumento: regente, motorista, técnico… Opcional.
      </p>
      {options.length === 0 ? (
        <p className="text-xs text-muted">
          Nenhuma função cadastrada. Cadastre em Funções.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {options.map((item) => {
            const checked = value.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={checked}
                onClick={() => toggle(item.id)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  checked
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border text-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {checked && <Check aria-hidden className="size-3.5" />}
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
