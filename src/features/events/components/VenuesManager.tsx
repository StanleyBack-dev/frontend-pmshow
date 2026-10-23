"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, MapPin, Pencil, Plus } from "lucide-react";
import { Alert, Badge, Button, Field, Modal, TextArea } from "@/design-system";
import { eventsClient } from "@/features/events/api/events.client";
import type { Venue, VenueInput } from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";

const EMPTY: VenueInput = {
  name: "",
  address: null,
  city: "Goiânia",
  mapsUrl: null,
  notes: null,
};

// Reusable places for events (EVENTS_MANAGE). Archived, never deleted.
export function VenuesManager({ venues }: { venues: Venue[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Venue | "new" | null>(null);
  const [form, setForm] = useState<VenueInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  function open(venue: Venue | "new") {
    setEditing(venue);
    setError(null);
    setForm(
      venue === "new"
        ? EMPTY
        : {
            name: venue.name,
            address: venue.address,
            city: venue.city,
            mapsUrl: venue.mapsUrl,
            notes: venue.notes,
          },
    );
  }

  async function run(key: string, action: () => Promise<unknown>) {
    setPending(key);
    setError(null);
    try {
      await action();
      setEditing(null);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(null);
  }

  const save = () =>
    run("save", () =>
      editing === "new"
        ? eventsClient.createVenue(form)
        : eventsClient.updateVenue((editing as Venue).id, form),
    );

  const set = <K extends keyof VenueInput>(key: K, value: VenueInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-4">
      {error && !editing && <Alert tone="danger">{error}</Alert>}
      <Button icon={<Plus className="size-4" />} onClick={() => open("new")}>
        Novo local
      </Button>

      {venues.length === 0 ? (
        <p className="text-sm text-muted">Nenhum local cadastrado.</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {venues.map((venue) => (
            <li
              key={venue.id}
              className="flex items-start gap-3 px-3 py-3 text-sm"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-soft" />
              <div className="min-w-0 flex-1">
                <p
                  className={
                    venue.archived
                      ? "text-soft line-through"
                      : "font-medium text-fg"
                  }
                >
                  {venue.name}
                </p>
                <p className="text-xs text-soft">
                  {[venue.address, venue.city].filter(Boolean).join(" · ")}
                </p>
              </div>
              {venue.archived && <Badge tone="neutral">Arquivado</Badge>}
              {venue.mapsUrl && (
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  mapa
                </a>
              )}
              <Button
                variant="ghost"
                size="sm"
                icon={<Pencil className="size-4" />}
                onClick={() => open(venue)}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                loading={pending === venue.id}
                icon={
                  venue.archived ? (
                    <ArchiveRestore className="size-4" />
                  ) : (
                    <Archive className="size-4" />
                  )
                }
                onClick={() =>
                  void run(venue.id, () =>
                    eventsClient.updateVenue(venue.id, {
                      name: venue.name,
                      address: venue.address,
                      city: venue.city,
                      mapsUrl: venue.mapsUrl,
                      notes: venue.notes,
                      archived: !venue.archived,
                    }),
                  )
                }
              >
                {venue.archived ? "Restaurar" : "Arquivar"}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Novo local" : "Editar local"}
        icon={<MapPin className="size-5" />}
        busy={pending === "save"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditing(null)}
              disabled={pending === "save"}
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              loading={pending === "save"}
              disabled={form.name.trim().length < 2}
            >
              Salvar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <Alert tone="danger">{error}</Alert>}
          <Field
            label="Nome"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <Field
            label="Endereço"
            value={form.address ?? ""}
            onChange={(e) => set("address", e.target.value)}
          />
          <Field
            label="Cidade"
            value={form.city ?? ""}
            onChange={(e) => set("city", e.target.value)}
          />
          <Field
            label="Link do mapa"
            placeholder="https://maps.app.goo.gl/…"
            value={form.mapsUrl ?? ""}
            onChange={(e) => set("mapsUrl", e.target.value)}
          />
          <TextArea
            label="Observações"
            rows={2}
            hint="Ex.: entrada pelo portão lateral, estacionamento."
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
