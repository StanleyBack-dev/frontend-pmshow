"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, UserPlus } from "lucide-react";
import {
  Alert,
  Button,
  Field,
  Drawer,
  Select,
  TextArea,
  cn,
} from "@/design-system";
import { membersClient } from "@/features/members/api/members.client";
import {
  RANKS,
  RANK_LABELS,
  SECTIONS,
  SECTION_LABELS,
  STATUSES,
  STATUS_LABELS,
  formatPhone,
} from "@/features/members/model/member-labels";
import type {
  Instrument,
  MemberProfile,
  MemberProfileInput,
  MemberStatus,
  Rank,
  Section,
} from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";
import {
  maskPhone,
  maskRegistration,
  maskWarName,
  phoneError,
  registrationError,
} from "@/shared/lib/masks";

type Form = Omit<MemberProfileInput, "registration" | "phone" | "notes"> & {
  registration: string;
  phone: string;
  notes: string;
};

const fromProfile = (profile: MemberProfile | null): Form => ({
  warName: profile?.warName ?? "",
  rank: profile?.rank ?? "SOLDADO",
  registration: profile?.registration ?? "",
  phone: profile?.phone ? formatPhone(profile.phone) : "",
  section: profile?.section ?? "METAIS",
  status: profile?.status ?? "ATIVO",
  notes: profile?.notes ?? "",
  instruments:
    profile?.instruments.map(({ instrumentId, primary }) => ({
      instrumentId,
      primary,
    })) ?? [],
});

// Creates or edits a member's band profile (MEMBERS_MANAGE).
export function MemberProfileButton({
  userId,
  name,
  profile,
  instruments,
}: {
  userId: string;
  name: string;
  profile: MemberProfile | null;
  instruments: Instrument[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(() => fromProfile(profile));
  const [error, setError] = useState<string | null>(null);
  // Field errors show once the field was left (or on save).
  const [touched, setTouched] = useState({ registration: false, phone: false });
  const [pending, setPending] = useState(false);
  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const selected = new Map(
    form.instruments.map((item) => [item.instrumentId, item.primary]),
  );

  function toggleInstrument(id: string) {
    set(
      "instruments",
      selected.has(id)
        ? form.instruments.filter((item) => item.instrumentId !== id)
        : [
            ...form.instruments,
            { instrumentId: id, primary: form.instruments.length === 0 },
          ],
    );
  }

  function makePrimary(id: string) {
    set(
      "instruments",
      form.instruments.map((item) => ({
        ...item,
        primary: item.instrumentId === id,
      })),
    );
  }

  async function submit() {
    if (phoneError(form.phone) || registrationError(form.registration)) {
      setTouched({ registration: true, phone: true });
      return setError("Corrija os campos destacados.");
    }
    setPending(true);
    setError(null);
    try {
      await membersClient.saveProfile(userId, {
        ...form,
        registration: form.registration || null,
        phone: form.phone || null,
        notes: form.notes || null,
      });
      setOpen(false);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar o cadastro.",
      );
    }
    setPending(false);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        icon={
          profile ? (
            <Pencil className="size-4" />
          ) : (
            <UserPlus className="size-4" />
          )
        }
        onClick={() => {
          setForm(fromProfile(profile));
          setError(null);
          setOpen(true);
        }}
      >
        {profile ? "Editar" : "Cadastrar"}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Cadastro na banda"
        subtitle={name}
        width="lg"
        busy={pending}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button
              onClick={submit}
              loading={pending}
              disabled={form.warName.trim().length < 2}
            >
              Salvar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <Alert tone="danger">{error}</Alert>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Posto / graduação"
              required
              value={form.rank}
              onChange={(event) => set("rank", event.target.value as Rank)}
              options={RANKS.map((value) => ({
                value,
                label: RANK_LABELS[value].label,
              }))}
            />
            <Field
              label="Nome de guerra"
              required
              placeholder="Ex.: SILVA"
              value={form.warName}
              onChange={(event) =>
                set("warName", maskWarName(event.target.value))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Naipe"
              required
              value={form.section}
              onChange={(event) =>
                set("section", event.target.value as Section)
              }
              options={SECTIONS.map((value) => ({
                value,
                label: SECTION_LABELS[value],
              }))}
            />
            <Select
              label="Situação"
              required
              value={form.status}
              onChange={(event) =>
                set("status", event.target.value as MemberStatus)
              }
              options={STATUSES.map((value) => ({
                value,
                label: STATUS_LABELS[value],
              }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Matrícula"
              autoCapitalize="characters"
              placeholder="Letras e números"
              value={form.registration}
              onChange={(event) =>
                set("registration", maskRegistration(event.target.value))
              }
              onBlur={() => setTouched((t) => ({ ...t, registration: true }))}
              error={
                (touched.registration &&
                  registrationError(form.registration)) ||
                undefined
              }
            />
            <Field
              label="Telefone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(62) 99999-0000"
              value={form.phone}
              onChange={(event) => set("phone", maskPhone(event.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              error={(touched.phone && phoneError(form.phone)) || undefined}
            />
          </div>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-fg">
              Instrumentos / funções
            </legend>
            <p className="mb-2 text-xs text-soft">
              Marque os que a pessoa toca ou exerce; a estrela indica o
              principal.
            </p>
            <div className="grid max-h-56 gap-1.5 overflow-y-auto sm:grid-cols-2">
              {instruments.map((instrument) => {
                const checked = selected.has(instrument.id);
                const primary = selected.get(instrument.id) === true;
                return (
                  <div
                    key={instrument.id}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm",
                      checked
                        ? "border-accent bg-accent-soft"
                        : "border-border",
                    )}
                  >
                    <label className="flex flex-1 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="size-4 accent-[var(--accent)]"
                        checked={checked}
                        onChange={() => toggleInstrument(instrument.id)}
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
                          primary
                            ? "text-brand-gold-ink"
                            : "text-soft hover:text-fg",
                        )}
                      >
                        {primary ? "★" : "☆"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>

          <TextArea
            label="Observações"
            rows={2}
            value={form.notes}
            onChange={(event) => set("notes", event.target.value)}
          />
        </div>
      </Drawer>
    </>
  );
}
