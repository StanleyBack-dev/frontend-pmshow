"use client";

import { Field, Select } from "@/design-system";
import {
  GROUP_DESCRIPTIONS,
  GROUP_LABELS,
} from "@/features/access/model/access-labels";
import type { UserGroup, UserInput } from "@/shared/contracts/api";

export function UserFormFields({
  value,
  onChange,
  assignableGroups,
}: {
  value: UserInput;
  onChange: (value: UserInput) => void;
  /** Groups the current admin may assign (the API enforces it again). */
  assignableGroups: UserGroup[];
}) {
  const set = <K extends keyof UserInput>(key: K, field: UserInput[K]) =>
    onChange({ ...value, [key]: field });

  return (
    <div className="space-y-4">
      <Field
        label="Nome completo"
        required
        value={value.name}
        onChange={(event) => set("name", event.target.value)}
      />
      <Field
        label="E-mail"
        type="email"
        required
        value={value.email}
        onChange={(event) => set("email", event.target.value)}
      />
      <div>
        <Field
          label="Usuário (login)"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={value.username}
          onChange={(event) =>
            set("username", event.target.value.toLowerCase().trim())
          }
        />
        <p className="mt-1.5 text-xs text-soft">
          3 a 32 caracteres: letras minúsculas, números, ponto, hífen ou
          sublinhado. Ex.: sgt.silva
        </p>
      </div>
      <div>
        <Select
          label="Grupo"
          value={value.group}
          onChange={(event) => set("group", event.target.value as UserGroup)}
          options={assignableGroups.map((group) => ({
            value: group,
            label: GROUP_LABELS[group],
          }))}
        />
        <p className="mt-1.5 text-xs text-soft">
          {GROUP_DESCRIPTIONS[value.group]}
        </p>
      </div>
    </div>
  );
}
