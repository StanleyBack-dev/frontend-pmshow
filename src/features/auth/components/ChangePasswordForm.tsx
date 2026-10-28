"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Alert, Button, cn, PasswordField } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { NewPasswordFields } from "@/features/auth/components/NewPasswordFields";
import { passwordProblem } from "@/features/auth/model/password-rules";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Used on the first access (temporary password → own password) and on the
// profile page. `redirectTo` is where to go after a first-access change.
export function ChangePasswordForm({
  firstAccess = false,
  redirectTo,
  wide = false,
}: {
  firstAccess?: boolean;
  redirectTo?: string;
  /** Full-width page (Configurações): the three fields side by side. */
  wide?: boolean;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { showError } = useToast();
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const problem = passwordProblem(password, confirmation);
    if (problem) return showError(problem);

    setPending(true);
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
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível trocar a senha.",
      );
    }
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {done && (
        <Alert tone="success">
          Senha alterada. As sessões em outros aparelhos foram encerradas.
        </Alert>
      )}
      <div
        className={cn(
          "grid gap-4",
          wide && "items-start md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        <PasswordField
          label={firstAccess ? "Senha temporária" : "Senha atual"}
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
      </div>
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
