"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Alert, Button, Field } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { ApiClientError } from "@/shared/lib/api-client";

export function ProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const changed = name.trim() !== initialName || email.trim() !== initialEmail;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSaved(false);
    try {
      await authClient.updateProfile(name, email);
      setSaved(true);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar.",
      );
    }
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <Alert tone="danger">{error}</Alert>}
      {saved && <Alert tone="success">Dados atualizados.</Alert>}
      <Field
        label="Nome completo"
        autoComplete="name"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Field
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button
        type="submit"
        loading={pending}
        disabled={!changed}
        icon={<Save className="size-4" />}
      >
        Salvar
      </Button>
    </form>
  );
}
