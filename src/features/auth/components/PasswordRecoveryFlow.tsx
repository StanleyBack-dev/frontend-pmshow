"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Mail, ShieldCheck } from "lucide-react";
import { Alert, Button, Field, buttonClasses } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { NewPasswordFields } from "@/features/auth/components/NewPasswordFields";
import { passwordProblem } from "@/features/auth/model/password-rules";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Step = "request" | "code" | "password" | "done";

const message = (cause: unknown, fallback: string) =>
  cause instanceof ApiClientError ? cause.message : fallback;

// Three steps: login → code sent by e-mail → new password.
export function PasswordRecoveryFlow() {
  const [step, setStep] = useState<Step>("request");
  const [login, setLogin] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<void>, fallback: string) {
    setPending(true);
    try {
      await action();
    } catch (cause) {
      showError(message(cause, fallback));
    }
    setPending(false);
  }

  const requestCode = (event: FormEvent) => {
    event.preventDefault();
    void run(async () => {
      await authClient.requestRecovery(login);
      setStep("code");
    }, "Não foi possível enviar o código.");
  };

  const verifyCode = (event: FormEvent) => {
    event.preventDefault();
    void run(async () => {
      await authClient.verifyRecoveryCode(login, code);
      setStep("password");
    }, "Não foi possível conferir o código.");
  };

  const resetPassword = (event: FormEvent) => {
    event.preventDefault();
    const problem = passwordProblem(password, confirmation);
    if (problem) return showError(problem);
    void run(async () => {
      await authClient.resetPassword(password);
      setStep("done");
    }, "Não foi possível redefinir a senha.");
  };

  if (step === "done") {
    return (
      <div className="space-y-4 text-center">
        <Alert tone="success">
          Senha redefinida. Por segurança, as sessões abertas foram encerradas.
        </Alert>
        <Link href="/entrar" className={`${buttonClasses()} w-full`}>
          Entrar com a nova senha
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {step === "request" && (
        <form onSubmit={requestCode} className="space-y-4" noValidate>
          <p className="text-sm text-muted">
            Informe seu usuário ou e-mail. Enviaremos um código para o e-mail
            cadastrado.
          </p>
          <Field
            label="Usuário ou e-mail"
            autoComplete="username"
            autoCapitalize="none"
            required
            value={login}
            onChange={(event) => setLogin(event.target.value)}
          />
          <Button
            type="submit"
            className="w-full"
            loading={pending}
            disabled={!login}
            icon={<Mail className="size-4" />}
          >
            Enviar código
          </Button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={verifyCode} className="space-y-4" noValidate>
          <Alert tone="info">
            Se o usuário existir, um código de 6 dígitos foi enviado para o
            e-mail cadastrado. Ele vale por 15 minutos.
          </Alert>
          <Field
            label="Código"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          />
          <Button
            type="submit"
            className="w-full"
            loading={pending}
            disabled={code.length !== 6}
            icon={<ShieldCheck className="size-4" />}
          >
            Conferir código
          </Button>
          <button
            type="button"
            onClick={() => {
              setStep("request");
              setCode("");
            }}
            className="w-full text-center text-sm text-muted hover:text-fg"
          >
            Não recebi — pedir outro código
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={resetPassword} className="space-y-4" noValidate>
          <NewPasswordFields
            password={password}
            confirmation={confirmation}
            onPassword={setPassword}
            onConfirmation={setConfirmation}
          />
          <Button
            type="submit"
            className="w-full"
            loading={pending}
            disabled={!password || !confirmation}
            icon={<Check className="size-4" />}
          >
            Salvar nova senha
          </Button>
        </form>
      )}

      <p className="text-center text-sm">
        <Link
          href="/entrar"
          className="inline-flex items-center gap-1 text-muted hover:text-fg"
        >
          <ArrowLeft className="size-3.5" /> Voltar para o login
        </Link>
      </p>
    </div>
  );
}
