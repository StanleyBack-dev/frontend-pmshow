"use client";

import { useState } from "react";
import { Button, Field, Modal } from "@/design-system";
import { artistsClient } from "@/features/artists/api/artists.client";
import type { Artist } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Registers a singer / band without leaving the song form.
export function ArtistQuickCreateModal({
  open,
  onClose,
  onCreated,
  initialName = "",
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (artist: Artist) => void;
  initialName?: string;
}) {
  const [name, setName] = useState(initialName);
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    try {
      onCreated(await artistsClient.create(name));
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível cadastrar.",
      );
    }
    setPending(false);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo cantor / banda"
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={submit}
            loading={pending}
            disabled={name.trim().length < 2}
          >
            Cadastrar
          </Button>
        </>
      }
    >
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim().length >= 2) void submit();
        }}
      >
        <Field
          label="Nome"
          required
          data-autofocus
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </form>
    </Modal>
  );
}
