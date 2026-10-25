"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Plus } from "lucide-react";
import { Alert, Badge, Button, Field, Select } from "@/design-system";
import { membersClient } from "@/features/members/api/members.client";
import {
  SECTIONS,
  SECTION_LABELS,
} from "@/features/members/model/member-labels";
import type { Instrument, Section } from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";

// The catalog used in member profiles (MEMBERS_MANAGE). Instruments are
// archived, never deleted, so old profiles keep their names.
export function InstrumentsManager({
  instruments,
}: {
  instruments: Instrument[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [section, setSection] = useState<Section>("METAIS");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  async function run(key: string, action: () => Promise<unknown>) {
    setPending(key);
    setError(null);
    try {
      await action();
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(null);
  }

  function create(event: FormEvent) {
    event.preventDefault();
    void run("create", async () => {
      await membersClient.createInstrument(name, section);
      setName("");
    });
  }

  return (
    <div className="space-y-5">
      {error && <Alert tone="danger">{error}</Alert>}
      <form
        onSubmit={create}
        className="flex flex-col gap-2 sm:flex-row sm:items-end"
        noValidate
      >
        <Field
          label="Novo instrumento ou função"
          required
          className="flex-1"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Select
          label="Naipe"
          required
          className="sm:w-44"
          value={section}
          onChange={(event) => setSection(event.target.value as Section)}
          options={SECTIONS.map((value) => ({
            value,
            label: SECTION_LABELS[value],
          }))}
        />
        <Button
          type="submit"
          loading={pending === "create"}
          disabled={name.trim().length < 2}
          icon={<Plus className="size-4" />}
        >
          Adicionar
        </Button>
      </form>

      {SECTIONS.map((group) => {
        const items = instruments.filter((item) => item.section === group);
        if (items.length === 0) return null;
        return (
          <section key={group}>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-soft uppercase">
              {SECTION_LABELS[group]}
            </h3>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 text-sm"
                >
                  <span
                    className={
                      item.archived
                        ? "flex-1 text-soft line-through"
                        : "flex-1 text-fg"
                    }
                  >
                    {item.name}
                  </span>
                  {item.archived && <Badge tone="neutral">Arquivado</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    loading={pending === item.id}
                    icon={
                      item.archived ? (
                        <ArchiveRestore className="size-4" />
                      ) : (
                        <Archive className="size-4" />
                      )
                    }
                    onClick={() =>
                      void run(item.id, () =>
                        membersClient.updateInstrument(item.id, {
                          archived: !item.archived,
                        }),
                      )
                    }
                  >
                    {item.archived ? "Restaurar" : "Arquivar"}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
