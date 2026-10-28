"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ExternalLink,
  Map,
  MapPin,
  Plus,
  Wand2,
} from "lucide-react";
import {
  Button,
  Drawer,
  Field,
  FormSection,
  Select,
  Spinner,
  TextArea,
} from "@/design-system";
import { eventsClient } from "@/features/events/api/events.client";
import { BR_STATES } from "@/features/events/model/event-labels";
import { mapsSearchUrl } from "@/features/events/model/venue-map";
import type { Venue, VenueInput } from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";
import {
  addressNumberError,
  maskAddressNumber,
  maskZipCode,
  urlError,
  zipCodeError,
} from "@/shared/lib/masks";
import { useToast } from "@/shared/toast/useToast";

type Form = {
  name: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  mapsUrl: string;
  notes: string;
};

const fromVenue = (venue?: Venue): Form => ({
  name: venue?.name ?? "",
  zipCode: venue?.zipCode ? maskZipCode(venue.zipCode) : "",
  street: venue?.street ?? "",
  number: venue?.number ?? "",
  complement: venue?.complement ?? "",
  district: venue?.district ?? "",
  city: venue?.city ?? "Goiânia",
  state: venue?.state ?? "GO",
  mapsUrl: venue?.mapsUrl ?? "",
  notes: venue?.notes ?? "",
});

const toInput = (form: Form): VenueInput => ({
  name: form.name,
  zipCode: form.zipCode.replace(/\D/g, "") || null,
  street: form.street || null,
  number: form.number || null,
  complement: form.complement || null,
  district: form.district || null,
  city: form.city || null,
  state: form.state || null,
  mapsUrl: form.mapsUrl || null,
  notes: form.notes || null,
});

const NO_NUMBER = "S/N";

// Create (no `venue`) or edit a venue: name, address in parts (the CEP
// fills street, district, city and UF) and the map link.
export function VenueFormDrawer({
  venue,
  onClose,
  onSaved,
}: {
  venue?: Venue;
  onClose: () => void;
  /** After saving (e.g. select the new venue in the event form). */
  onSaved: (venue: Venue) => void;
}) {
  const [form, setForm] = useState<Form>(() => fromVenue(venue));
  const { showError } = useToast();
  const [pending, setPending] = useState(false);
  const [lookup, setLookup] = useState<"idle" | "busy" | "missing">("idle");
  const [touched, setTouched] = useState(false);
  // The map link follows the address until someone types their own link
  // (a new venue, or one whose link was generated the same way).
  const [autoMap, setAutoMap] = useState(() => {
    const saved = venue?.mapsUrl;
    return !saved || saved === mapsSearchUrl(fromVenue(venue));
  });
  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  // "Sem número" is stored as S/N and locks the number field.
  const noNumber = form.number === NO_NUMBER;
  const generatedMap = mapsSearchUrl(form);
  const mapsUrl = autoMap ? (generatedMap ?? "") : form.mapsUrl;
  const errors = {
    zipCode: zipCodeError(form.zipCode),
    number: addressNumberError(form.number),
    mapsUrl: urlError(mapsUrl),
    city: form.city.trim() ? null : "Informe a cidade.",
  };
  const invalid = Object.values(errors).some(Boolean);

  async function changeZipCode(value: string) {
    const masked = maskZipCode(value);
    set("zipCode", masked);
    const digits = masked.replace(/\D/g, "");
    if (digits.length !== 8) return setLookup("idle");
    setLookup("busy");
    try {
      const found = await eventsClient.zipCode(digits);
      if (!found) return setLookup("missing");
      setForm((current) => ({
        ...current,
        street: found.street ?? current.street,
        district: found.district ?? current.district,
        city: found.city,
        state: found.state,
      }));
      setLookup("idle");
    } catch {
      setLookup("missing");
    }
  }

  async function submit() {
    setTouched(true);
    if (invalid) return showError("Corrija os campos destacados.");
    setPending(true);
    try {
      const saved = venue
        ? await eventsClient.updateVenue(venue.id, {
            ...toInput({ ...form, mapsUrl }),
            archived: venue.archived,
          })
        : await eventsClient.createVenue(toInput({ ...form, mapsUrl }));
      onSaved(saved);
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar o local.",
      );
      setPending(false);
    }
  }

  return (
    <Drawer
      open
      width="lg"
      onClose={onClose}
      title={venue ? "Editar local" : "Novo local"}
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={submit}
            loading={pending}
            disabled={form.name.trim().length < 2}
          >
            {venue ? "Salvar" : "Criar local"}
          </Button>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <FormSection
          icon={<Building2 />}
          title="O local"
          description="Como ele aparece nos eventos, na agenda e na escala."
        >
          <Field
            label="Nome"
            required
            data-autofocus
            placeholder="Ex.: Teatro Goiânia, Praça Cívica, 1º BPM"
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
          />
        </FormSection>

        <FormSection
          icon={<MapPin />}
          title="Endereço"
          description="Digite o CEP para preencher rua, bairro, cidade e UF."
        >
          <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
            <Field
              label="CEP"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              value={form.zipCode}
              onChange={(event) => void changeZipCode(event.target.value)}
              error={errors.zipCode ?? undefined}
              trailing={
                lookup === "busy" ? (
                  <span className="grid size-8 place-items-center">
                    <Spinner size="sm" />
                  </span>
                ) : undefined
              }
            />
            <Field
              label="Rua / logradouro"
              autoComplete="address-line1"
              placeholder="Ex.: Av. Anhanguera"
              value={form.street}
              onChange={(event) => set("street", event.target.value)}
            />
          </div>
          {lookup === "missing" && (
            <p className="text-xs text-soft">
              CEP não encontrado: preencha o endereço manualmente.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-[8rem_1fr_1fr]">
            <div className="space-y-2">
              <Field
                label="Número"
                inputMode="numeric"
                placeholder={noNumber ? "S/N" : "Ex.: 123"}
                disabled={noNumber}
                value={noNumber ? "" : form.number}
                onChange={(event) =>
                  set("number", maskAddressNumber(event.target.value))
                }
                error={errors.number ?? undefined}
              />
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--accent)]"
                  checked={noNumber}
                  onChange={(event) =>
                    set("number", event.target.checked ? NO_NUMBER : "")
                  }
                />
                Sem número
              </label>
            </div>
            <Field
              label="Complemento"
              placeholder="Ex.: Bloco B, portão 2"
              value={form.complement}
              onChange={(event) => set("complement", event.target.value)}
            />
            <Field
              label="Bairro"
              placeholder="Ex.: Setor Central"
              value={form.district}
              onChange={(event) => set("district", event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
            <Field
              label="Cidade"
              required
              autoComplete="address-level2"
              value={form.city}
              onChange={(event) => set("city", event.target.value)}
              error={touched ? (errors.city ?? undefined) : undefined}
            />
            <Select
              label="UF"
              required
              value={form.state}
              onChange={(event) => set("state", event.target.value)}
              options={BR_STATES.map((uf) => ({ value: uf, label: uf }))}
            />
          </div>
        </FormSection>

        <FormSection
          icon={<Map />}
          title="Mapa e observações"
          description="O link do mapa sai do endereço; troque por outro se quiser."
        >
          <div className="space-y-2">
            <Field
              label="Link do mapa"
              type="url"
              inputMode="url"
              placeholder={
                autoMap
                  ? "Preencha o endereço para gerar o link"
                  : "https://maps.app.goo.gl/…"
              }
              value={mapsUrl}
              onChange={(event) => {
                setAutoMap(false);
                set("mapsUrl", event.target.value);
              }}
              error={errors.mapsUrl ?? undefined}
              trailing={
                mapsUrl && !errors.mapsUrl ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Conferir no mapa"
                    aria-label="Conferir no mapa"
                    className="grid size-8 place-items-center rounded-md text-accent hover:bg-accent-soft"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                ) : undefined
              }
            />
            {autoMap ? (
              <p className="text-xs text-soft">
                {generatedMap
                  ? "Gerado pelo endereço e atualizado sozinho. Confira no ícone ao lado; se o ponto não estiver certo, cole o link do lugar exato."
                  : "Assim que houver rua (ou o nome do lugar) e cidade, o link é gerado."}
              </p>
            ) : (
              generatedMap && (
                <button
                  type="button"
                  onClick={() => setAutoMap(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  <Wand2 aria-hidden className="size-3.5" />
                  Gerar pelo endereço
                </button>
              )
            )}
          </div>
          <TextArea
            label="Observações"
            rows={2}
            placeholder="Ex.: entrada pelo portão lateral, estacionamento no subsolo."
            value={form.notes}
            onChange={(event) => set("notes", event.target.value)}
          />
        </FormSection>
      </form>
    </Drawer>
  );
}

export function NewVenueButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<Plus className="size-4" />}>
        Novo local
      </Button>
      {open && (
        <VenueFormDrawer
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
