"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Alert, Button, Field } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { ApiClientError } from "@/shared/lib/api-client";

export function LoginForm({
  next,
  expired,
}: {
  next: string | null;
  expired: boolean;
}) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const { mustChangePassword } = await authClient.login(login, password);
      router.replace(
        mustChangePassword ? "/primeiro-acesso" : (next ?? "/inicio"),
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível entrar.",
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {expired && !error && (
        <Alert tone="warning">Sua sessão expirou. Entre novamente.</Alert>
      )}
      {error && <Alert tone="danger">{error}</Alert>}
      <Field
        label="Usuário ou e-mail"
        name="login"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
        value={login}
        onChange={(event) => setLogin(event.target.value)}
      />
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
        type="submit"
        className="w-full"
        loading={pending}
        disabled={!login || !password}
        icon={<LogIn className="size-4" />}
      >
        Entrar
      </Button>
      <p className="text-center text-sm">
        <Link
          href="/recuperar-senha"
          className="text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Esqueci minha senha
        </Link>
      </p>
    </form>
  );
}
