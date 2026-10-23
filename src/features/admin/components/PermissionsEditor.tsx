"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, RotateCcw, Save } from "lucide-react";
import { Alert, Badge, Button, cn } from "@/design-system";
import {
  LOCKED_PERMISSIONS,
  PERMISSION_AREAS,
  PERMISSION_INFO,
} from "@/features/access/model/access-labels";
import { adminClient } from "@/features/admin/api/admin.client";
import type { Permission, PermissionMatrix } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";

const ALL = Object.keys(PERMISSION_INFO) as Permission[];

// Checklist of every permission, grouped by area. Differences from the group
// defaults are marked; saving sends the full desired set and the API stores
// only the differences.
export function PermissionsEditor({
  userId,
  matrix,
  editable,
}: {
  userId: string;
  matrix: PermissionMatrix;
  /** False for the signed-in user's own account. */
  editable: boolean;
}) {
  const router = useRouter();
  const defaults = useMemo(() => new Set(matrix.defaults), [matrix.defaults]);
  const [selected, setSelected] = useState(() => new Set(matrix.effective));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const dirty =
    selected.size !== matrix.effective.length ||
    matrix.effective.some((permission) => !selected.has(permission));
  const customized = ALL.some(
    (permission) => selected.has(permission) !== defaults.has(permission),
  );

  function toggle(permission: Permission) {
    setSaved(false);
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(permission)) next.delete(permission);
      else next.add(permission);
      return next;
    });
  }

  async function save(useDefaults: boolean) {
    setPending(true);
    setError(null);
    setSaved(false);
    try {
      const result = await adminClient.setPermissions(
        userId,
        useDefaults
          ? null
          : ALL.filter((permission) => selected.has(permission)),
      );
      setSelected(new Set(result.effective));
      setSaved(true);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar as permissões.",
      );
    }
    setPending(false);
  }

  return (
    <div className="space-y-5">
      {!editable && (
        <Alert tone="info">Você não pode alterar as próprias permissões.</Alert>
      )}
      {error && <Alert tone="danger">{error}</Alert>}
      {saved && (
        <Alert tone="success">Permissões salvas. Valem imediatamente.</Alert>
      )}

      {PERMISSION_AREAS.map((area) => (
        <fieldset key={area}>
          <legend className="mb-2 text-xs font-semibold tracking-wide text-soft uppercase">
            {area}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ALL.filter(
              (permission) => PERMISSION_INFO[permission].area === area,
            ).map((permission) => {
              const locked = LOCKED_PERMISSIONS.has(permission);
              const checked = selected.has(permission);
              const differs = checked !== defaults.has(permission);
              return (
                <label
                  key={permission}
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-3 py-2 text-sm",
                    differs ? "border-accent bg-accent-soft" : "border-border",
                    locked || !editable
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer hover:bg-surface-muted",
                  )}
                >
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--accent)]"
                    checked={checked}
                    disabled={locked || !editable || pending}
                    onChange={() => toggle(permission)}
                  />
                  <span className="flex-1 text-fg">
                    {PERMISSION_INFO[permission].label}
                  </span>
                  {locked && (
                    <Lock
                      className="size-3.5 text-soft"
                      aria-label="Definida só pelo grupo"
                    />
                  )}
                  {differs && <Badge tone="accent">Personalizada</Badge>}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {editable && (
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button
            onClick={() => save(false)}
            loading={pending}
            disabled={!dirty}
            icon={<Save className="size-4" />}
          >
            Salvar permissões
          </Button>
          <Button
            variant="secondary"
            onClick={() => save(true)}
            disabled={pending || (!customized && !dirty)}
            icon={<RotateCcw className="size-4" />}
          >
            Voltar ao padrão do grupo
          </Button>
        </div>
      )}
      <p className="text-xs text-soft">
        <Lock className="mr-1 inline size-3" />
        Gerenciar permissões e ver a auditoria só podem ser concedidos pelo
        grupo Administrador geral.
      </p>
    </div>
  );
}
