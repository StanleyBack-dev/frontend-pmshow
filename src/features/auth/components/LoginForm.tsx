"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, UserRound } from "lucide-react";
import { Alert, Button, Field, PasswordField } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import {
  rememberLogin,
  rememberedLogin,
} from "@/features/auth/model/remembered-login";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// The remembered login only changes when this form saves it, so there is
// nothing to subscribe to; the server render has none.
const noUpdates = () => () => {};

export function LoginForm({
  next,
  expired,
}: {
  next: string | null;
  expired: boolean;
}) {
  const router = useRouter();
  const saved = useSyncExternalStore(noUpdates, rememberedLogin, () => null);
  // null = untouched: the field shows the remembered login (if any).
  const [typedLogin, setLogin] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  // Checked by default: unchecking it forgets the login on this sign-in.
  const [remember, setRemember] = useState(true);
  const login = typedLogin ?? saved ?? "";
  const form = useRef<HTMLFormElement>(null);
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  // With a remembered login, go straight to the password.
  useEffect(() => {
    if (!saved) return;
    form.current
      ?.querySelector<HTMLInputElement>('input[name="password"]')
      ?.focus();
  }, [saved]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const { mustChangePassword } = await authClient.login(login, password);
      // Only a login that worked is worth remembering.
      rememberLogin(remember ? login.trim() : null);
      router.replace(
        mustChangePassword ? "/primeiro-acesso" : (next ?? "/inicio"),
      );
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível entrar.",
      );
      setPending(false);
    }
  }

  return (
    <form ref={form} onSubmit={submit} className="space-y-5" noValidate>
      {expired && (
        <Alert tone="warning">Sua sessão expirou. Entre novamente.</Alert>
      )}
      <Field
        label="Usuário ou e-mail"
        name="login"
        icon={<UserRound />}
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
        value={login}
        onChange={(event) => setLogin(event.target.value)}
        controlSize="lg"
      />
      <div>
        <PasswordField
          label="Senha"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          controlSize="lg"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted select-none">
            <input
              type="checkbox"
              name="remember"
              className="size-4 accent-[var(--accent)]"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            Lembrar meu usuário
          </label>
          <Link
            href="/recuperar-senha"
            className="text-xs font-medium text-accent underline-offset-4 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={pending}
        disabled={!login || !password}
        icon={<LogIn className="size-4" />}
      >
        Entrar
      </Button>
    </form>
  );
}
