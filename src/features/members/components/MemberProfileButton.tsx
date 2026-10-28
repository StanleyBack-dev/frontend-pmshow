"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, UserPlus } from "lucide-react";
import { Button, Field, Drawer, Select, TextArea } from "@/design-system";
import { membersClient } from "@/features/members/api/members.client";
import { FunctionChoices } from "@/features/members/components/FunctionChoices";
import { InstrumentChoices } from "@/features/members/components/InstrumentChoices";
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
  BandFunction,
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
import { useToast } from "@/shared/toast/useToast";

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
  functionIds: profile?.functions.map((item) => item.functionId) ?? [],
});

// Creates or edits a member's band profile (MEMBERS_MANAGE).
export function MemberProfileButton({
  userId,
  name,
  profile,
  instruments,
  functions,
}: {
  userId: string;
  name: string;
  profile: MemberProfile | null;
  instruments: Instrument[];
  functions: BandFunction[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(() => fromProfile(profile));
  const { showError } = useToast();
  // Field errors show once the field was left (or on save).
  const [touched, setTouched] = useState({ registration: false, phone: false });
  const [pending, setPending] = useState(false);
  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit() {
    if (phoneError(form.phone) || registrationError(form.registration)) {
      setTouched({ registration: true, phone: true });
      return showError("Corrija os campos destacados.");
    }
    setPending(true);
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
      showError(
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

          <InstrumentChoices
            instruments={instruments}
            value={form.instruments}
            onChange={(value) => set("instruments", value)}
          />

          <FunctionChoices
            functions={functions}
            value={form.functionIds}
            onChange={(value) => set("functionIds", value)}
          />

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
