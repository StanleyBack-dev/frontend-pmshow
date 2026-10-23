"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Alert, Button, Field } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { NewPasswordFields } from "@/features/auth/components/NewPasswordFields";
import { passwordProblem } from "@/features/auth/model/password-rules";
import { ApiClientError } from "@/shared/lib/api-client";

// Used on the first access (temporary password → own password) and on the
// profile page. `redirectTo` is where to go after a first-access change.
export function ChangePasswordForm({
  firstAccess = false,
  redirectTo,
}: {
  firstAccess?: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const problem = passwordProblem(password, confirmation);
    if (problem) return setError(problem);

    setPending(true);
    setError(null);
    try {
      await authClient.changePassword(current, password);
      if (redirectTo) {
        router.replace(redirectTo);
        router.refresh();
        return;
      }
      setDone(true);
      setCurrent("");
      setPassword("");
      setConfirmation("");
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível trocar a senha.",
      );
    }
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <Alert tone="danger">{error}</Alert>}
      {done && (
        <Alert tone="success">
          Senha alterada. As sessões em outros aparelhos foram encerradas.
        </Alert>
      )}
      <Field
        label={firstAccess ? "Senha temporária" : "Senha atual"}
        type="password"
        autoComplete="current-password"
        required
        value={current}
        onChange={(event) => setCurrent(event.target.value)}
      />
      <NewPasswordFields
        password={password}
        confirmation={confirmation}
        onPassword={setPassword}
        onConfirmation={setConfirmation}
      />
      <Button
        type="submit"
        loading={pending}
        disabled={!current || !password || !confirmation}
        icon={<KeyRound className="size-4" />}
        className={firstAccess ? "w-full" : undefined}
      >
        {firstAccess ? "Criar minha senha" : "Trocar senha"}
      </Button>
    </form>
  );
}
