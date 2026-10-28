"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { Button, Drawer, Field, FormSection } from "@/design-system";
import { bandFunctionsClient } from "@/features/members/api/members.client";
import type { BandFunction } from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Create (no `bandFunction`) or rename a function of the band. Archiving is
// done in the table.
export function BandFunctionFormDrawer({
  bandFunction,
  onClose,
  onSaved,
}: {
  bandFunction?: BandFunction;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(bandFunction?.name ?? "");
  const { showError, showSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const [touched, setTouched] = useState(false);
  const nameError =
    name.trim().length < 2 ? "Informe o nome (mínimo 2 letras)." : undefined;

  async function submit() {
    setTouched(true);
    if (nameError) return showError(nameError);
    setPending(true);
    try {
      if (bandFunction) {
        await bandFunctionsClient.update(bandFunction.id, { name });
      } else {
        await bandFunctionsClient.create(name);
      }
      showSuccess(bandFunction ? "Função salva." : "Função criada.");
      onSaved();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar a função.",
      );
      setPending(false);
    }
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title={bandFunction ? "Editar função" : "Nova função"}
      subtitle="Funções além do instrumento: usadas no cadastro dos músicos e nas escalas."
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button onClick={submit} loading={pending}>
            {bandFunction ? "Salvar" : "Criar função"}
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
          icon={<BriefcaseBusiness />}
          title="Função"
          description="O nome aparece no cadastro dos músicos, na escala, nos avisos e no PDF."
        >
          <Field
            label="Nome"
            required
            data-autofocus
            maxLength={60}
            placeholder="Ex.: Regente, Motorista, Técnico de som"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={touched ? nameError : undefined}
          />
        </FormSection>
      </form>
    </Drawer>
  );
}

export function NewBandFunctionButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<Plus className="size-4" />}>
        Nova função
      </Button>
      {open && (
        <BandFunctionFormDrawer
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
