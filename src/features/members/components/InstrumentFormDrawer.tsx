"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Guitar, Plus } from "lucide-react";
import { Button, Drawer, Field, FormSection, Select } from "@/design-system";
import { membersClient } from "@/features/members/api/members.client";
import {
  SECTIONS,
  SECTION_LABELS,
} from "@/features/members/model/member-labels";
import type { Instrument, Section } from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Create (no `instrument`) or edit an instrument or function of the band:
// its name and the section it belongs to. Archiving is done in the table.
export function InstrumentFormDrawer({
  instrument,
  onClose,
  onSaved,
}: {
  instrument?: Instrument;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(instrument?.name ?? "");
  const [section, setSection] = useState<Section | "">(
    instrument?.section ?? "",
  );
  const { showError, showSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const [touched, setTouched] = useState(false);
  const nameError =
    name.trim().length < 2 ? "Informe o nome (mínimo 2 letras)." : undefined;
  const sectionError = section ? undefined : "Escolha o naipe.";

  async function submit() {
    setTouched(true);
    if (nameError || !section) {
      return showError(nameError ?? "Escolha o naipe.");
    }
    setPending(true);
    try {
      if (instrument) {
        await membersClient.updateInstrument(instrument.id, {
          name,
          section,
        });
      } else {
        await membersClient.createInstrument(name, section);
      }
      showSuccess(instrument ? "Instrumento salvo." : "Instrumento criado.");
      onSaved();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar o instrumento.",
      );
      setPending(false);
    }
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title={instrument ? "Editar instrumento" : "Novo instrumento"}
      subtitle="Instrumentos e funções que os integrantes escolhem no cadastro."
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button onClick={submit} loading={pending}>
            {instrument ? "Salvar" : "Criar instrumento"}
          </Button>
        </>
      }
    >
      <form
        className="space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <FormSection
          icon={<Guitar />}
          title="Instrumento"
          description="O nome aparece no cadastro dos músicos, na escala e no PDF."
        >
          <Field
            label="Nome"
            required
            data-autofocus
            maxLength={60}
            placeholder="Ex.: Trompete, Bateria, Regente"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={touched ? nameError : undefined}
          />
          <Select
            label="Naipe"
            required
            placeholder="Selecione"
            value={section}
            onChange={(e) => setSection(e.target.value as Section)}
            options={SECTIONS.map((value) => ({
              value,
              label: SECTION_LABELS[value],
            }))}
            error={touched ? sectionError : undefined}
          />
        </FormSection>
      </form>
    </Drawer>
  );
}

export function NewInstrumentButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<Plus className="size-4" />}>
        Novo instrumento
      </Button>
      {open && (
        <InstrumentFormDrawer
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
