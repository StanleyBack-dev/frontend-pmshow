"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button, Drawer, Field } from "@/design-system";
import { artistsClient } from "@/features/artists/api/artists.client";
import type { Artist } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Create (no `artist`) or rename a singer / band.
export function ArtistFormDrawer({
  artist,
  onClose,
  onSaved,
}: {
  artist?: Artist;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(artist?.name ?? "");
  const { showError } = useToast();
  const [pending, setPending] = useState(false);
  const valid = name.trim().length >= 2;

  async function submit() {
    setPending(true);
    try {
      if (artist) await artistsClient.update(artist.id, { name });
      else await artistsClient.create(name);
      onSaved();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar.",
      );
      setPending(false);
    }
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title={artist ? "Editar cantor / banda" : "Novo cantor / banda"}
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button onClick={submit} loading={pending} disabled={!valid}>
            Salvar
          </Button>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (valid) void submit();
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
    </Drawer>
  );
}

export function NewArtistButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<Plus className="size-4" />}>
        Novo cantor / banda
      </Button>
      {/* Remounted on each open, so the form starts empty. */}
      {open && (
        <ArtistFormDrawer
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
