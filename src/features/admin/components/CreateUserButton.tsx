"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Alert, Button, Drawer } from "@/design-system";
import { adminClient } from "@/features/admin/api/admin.client";
import { TemporaryAccessPanel } from "@/features/admin/components/TemporaryAccessPanel";
import { UserFormFields } from "@/features/admin/components/UserFormFields";
import type {
  TemporaryAccess,
  UserGroup,
  UserInput,
} from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";

const EMPTY: UserInput = { name: "", email: "", username: "", group: "USER" };

export function CreateUserButton({
  assignableGroups,
}: {
  assignableGroups: UserGroup[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UserInput>(EMPTY);
  const [created, setCreated] = useState<TemporaryAccess | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function close() {
    setOpen(false);
    setForm(EMPTY);
    setCreated(null);
    setError(null);
  }

  async function submit() {
    setPending(true);
    setError(null);
    try {
      setCreated(await adminClient.createUser(form));
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível criar o usuário.",
      );
    }
    setPending(false);
  }

  const complete = form.name && form.email && form.username;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        icon={<UserPlus className="size-4" />}
      >
        Novo usuário
      </Button>
      <Drawer
        open={open}
        onClose={close}
        title={created ? "Usuário criado" : "Novo usuário"}
        busy={pending}
        footer={
          created ? (
            <Button onClick={close}>Concluir</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={close} disabled={pending}>
                Cancelar
              </Button>
              <Button onClick={submit} loading={pending} disabled={!complete}>
                Criar e enviar acesso
              </Button>
            </>
          )
        }
      >
        {created ? (
          <TemporaryAccessPanel access={created} />
        ) : (
          <div className="space-y-4">
            {error && <Alert tone="danger">{error}</Alert>}
            <UserFormFields
              value={form}
              onChange={setForm}
              assignableGroups={assignableGroups}
            />
            <p className="text-xs text-soft">
              O sistema gera uma senha temporária e envia por e-mail.
            </p>
          </div>
        )}
      </Drawer>
    </>
  );
}
