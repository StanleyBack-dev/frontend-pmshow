"use client";

import { Music, ShieldCheck, UserRound } from "lucide-react";
import { Field, FormSection, Select, cn } from "@/design-system";
import { RequiredMark } from "@/design-system/components/Field";
import {
  maskMilitaryId,
  type EnrollmentErrors,
  type EnrollmentForm,
} from "@/features/enrollment/model/enrollment-form";
import { InstrumentChoices } from "@/features/members/components/InstrumentChoices";
import { RANKS, RANK_LABELS } from "@/features/members/model/member-labels";
import type { EnrollmentInstrument } from "@/shared/contracts/enrollment";
import type { Rank } from "@/shared/contracts/members";
import { maskPhone, maskWarName } from "@/shared/lib/masks";

const MILITARY_RANKS = RANKS.filter((rank) => rank !== "CIVIL");

// The sign-up data: the public form and the manager's review share it.
export function EnrollmentFields({
  form,
  onChange,
  instruments,
  errors,
  showErrors,
  autoFocus = false,
}: {
  form: EnrollmentForm;
  onChange: (form: EnrollmentForm) => void;
  instruments: EnrollmentInstrument[];
  errors: EnrollmentErrors;
  /** Errors appear after the first attempt to send. */
  showErrors: boolean;
  autoFocus?: boolean;
}) {
  const set = <K extends keyof EnrollmentForm>(
    key: K,
    value: EnrollmentForm[K],
  ) => onChange({ ...form, [key]: value });
  const error = (key: keyof EnrollmentForm) =>
    showErrors ? errors[key] : undefined;

  return (
    <div className="space-y-5">
      <FormSection
        icon={<ShieldCheck />}
        title="Vínculo"
        description="Militares entram no app com o RG militar (5 números)."
      >
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-fg">
            Você é
            <RequiredMark />
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                [true, "Militar"],
                [false, "Civil"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={label}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium",
                  form.military === value
                    ? "border-accent bg-accent-soft text-fg"
                    : "border-border text-muted hover:text-fg",
                )}
              >
                <input
                  type="radio"
                  name="military"
                  className="size-4 accent-[var(--accent)]"
                  checked={form.military === value}
                  onChange={() =>
                    onChange({
                      ...form,
                      military: value,
                      ...(value ? {} : { militaryId: "", rank: "" }),
                    })
                  }
                />
                {label}
              </label>
            ))}
          </div>
          {error("military") && (
            <p className="mt-1 text-[11px] font-medium text-danger">
              {error("military")}
            </p>
          )}
        </fieldset>

        {form.military && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="RG militar"
              required
              inputMode="numeric"
              placeholder="5 números"
              value={form.militaryId}
              onChange={(e) =>
                set("militaryId", maskMilitaryId(e.target.value))
              }
              error={error("militaryId")}
            />
            <Select
              label="Posto / graduação"
              required
              placeholder="Selecione"
              value={form.rank}
              onChange={(e) => set("rank", e.target.value as Rank)}
              options={MILITARY_RANKS.map((rank) => ({
                value: rank,
                label: RANK_LABELS[rank].label,
              }))}
              error={error("rank")}
            />
          </div>
        )}
        {form.military === false && (
          <p className="text-xs text-soft">
            Civis recebem um usuário gerado pelo sistema na aprovação.
          </p>
        )}
      </FormSection>

      <FormSection
        icon={<UserRound />}
        title="Dados pessoais"
        description="Para a escala; a senha de acesso chega no seu e-mail."
      >
        <Field
          label="Nome completo"
          required
          autoComplete="name"
          data-autofocus={autoFocus || undefined}
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          error={error("fullName")}
        />
        <Field
          label="Nome de guerra"
          required
          placeholder="Ex.: CARVALHO"
          value={form.warName}
          onChange={(e) => set("warName", maskWarName(e.target.value))}
          error={error("warName")}
        />
        <Field
          label="Data de nascimento"
          required
          type="date"
          autoComplete="bday"
          max={new Date().toISOString().slice(0, 10)}
          value={form.birthDate}
          onChange={(e) => set("birthDate", e.target.value)}
          error={error("birthDate")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="E-mail"
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            error={error("email")}
          />
          <Field
            label="Telefone (WhatsApp)"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(62) 99999-0000"
            value={form.phone}
            onChange={(e) => set("phone", maskPhone(e.target.value))}
            error={error("phone")}
          />
        </div>
      </FormSection>

      <FormSection
        icon={<Music />}
        title="Na banda"
        description="O que você toca ou faz; a estrela marca o principal."
      >
        <InstrumentChoices
          instruments={instruments}
          value={form.instruments}
          onChange={(value) => set("instruments", value)}
          hint="Marque todos os que você toca ou exerce."
          required
          error={error("instruments")}
        />
      </FormSection>
    </div>
  );
}
