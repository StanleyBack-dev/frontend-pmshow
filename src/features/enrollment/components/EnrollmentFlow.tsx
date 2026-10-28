"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, KeyRound, Send } from "lucide-react";
import { Button, Field, FormSection, Spinner } from "@/design-system";
import { enrollmentClient } from "@/features/enrollment/api/enrollment.client";
import { EnrollmentFields } from "@/features/enrollment/components/EnrollmentFields";
import {
  ProfilePhotoField,
  type ProfilePhoto,
} from "@/features/enrollment/components/ProfilePhotoField";
import {
  EMPTY_ENROLLMENT,
  enrollmentErrors,
  toEnrollmentData,
  type EnrollmentForm,
} from "@/features/enrollment/model/enrollment-form";
import type { EnrollmentInstrument } from "@/shared/contracts/enrollment";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Step = "code" | "form" | "done";

const message = (cause: unknown, fallback: string) =>
  cause instanceof ApiClientError ? cause.message : fallback;

// Public sign-up: the cohort code (sent by WhatsApp) opens the form; the
// answer waits for the band's administration to approve it.
const Heading = () => (
  <h1 className="text-center text-2xl font-semibold text-fg">
    Cadastro na banda
  </h1>
);

export function EnrollmentFlow() {
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState("");
  const [instruments, setInstruments] = useState<EnrollmentInstrument[]>([]);
  const [form, setForm] = useState<EnrollmentForm>(EMPTY_ENROLLMENT);
  const [consent, setConsent] = useState(false);
  const [photo, setPhoto] = useState<ProfilePhoto | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  const errors = enrollmentErrors(form);
  const invalid = Object.keys(errors).length > 0;

  async function verify(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await enrollmentClient.verifyCode(code);
      setInstruments(await enrollmentClient.instruments());
      setStep("form");
    } catch (cause) {
      showError(message(cause, "Não foi possível conferir o código."));
    }
    setPending(false);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (invalid) return showError("Confira os campos destacados.");
    if (!consent) return showError("Marque o aceite do uso dos dados.");
    setPending(true);
    try {
      await enrollmentClient.submit(
        toEnrollmentData(form),
        consent,
        photo?.base64 ?? null,
      );
      setStep("done");
    } catch (cause) {
      // The 60 minutes ran out: the code opens the form again, data kept.
      if (
        cause instanceof ApiClientError &&
        cause.code === "ENROLLMENT_FORM_EXPIRED"
      ) {
        setStep("code");
        setCode("");
      }
      showError(message(cause, "Não foi possível enviar o cadastro."));
    }
    setPending(false);
  }

  if (step === "done") {
    return (
      <div className="space-y-4 text-center">
        <Heading />
        <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
        <p className="text-lg font-semibold text-fg">Cadastro enviado!</p>
        <p className="text-sm text-muted">
          A administração da banda vai conferir os seus dados. Quando o acesso
          for aprovado, você recebe o usuário e a senha no e-mail{" "}
          <strong className="text-fg">{form.email.trim()}</strong>.
        </p>
      </div>
    );
  }

  if (step === "code") {
    return (
      <form className="space-y-4" onSubmit={verify}>
        <Heading />
        <p className="text-sm text-muted">
          Digite o código que você recebeu da administração da banda.
        </p>
        <Field
          label="Código de acesso"
          required
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          icon={<KeyRound className="size-4" />}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="[&_input]:font-mono [&_input]:tracking-[0.3em]"
        />
        <Button
          type="submit"
          className="w-full"
          loading={pending}
          disabled={code.length !== 6}
        >
          Continuar
        </Button>
      </form>
    );
  }

  return (
    <form className="space-y-5" onSubmit={submit} noValidate>
      <Heading />
      <p className="text-sm text-muted">
        Código confirmado. Preencha os seus dados: o acesso ao app é liberado
        depois da aprovação da administração.
      </p>
      <FormSection
        icon={<Camera />}
        title="Foto de perfil"
        description="Ajuda a banda a identificar você no app."
      >
        <ProfilePhotoField value={photo} onChange={setPhoto} />
      </FormSection>
      {instruments.length === 0 ? (
        <div className="grid place-items-center py-8">
          <Spinner />
        </div>
      ) : (
        <EnrollmentFields
          form={form}
          onChange={setForm}
          instruments={instruments}
          errors={errors}
          showErrors={submitted}
        />
      )}
      <label className="flex cursor-pointer items-start gap-2 text-sm text-muted">
        <input
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Autorizo o uso destes dados pela banda para escalas e avisos, conforme
          os{" "}
          <Link
            href="/termos"
            target="_blank"
            className="text-accent underline-offset-2 hover:underline"
          >
            termos de uso e privacidade
          </Link>
          .
        </span>
      </label>
      <Button
        type="submit"
        className="w-full"
        loading={pending}
        icon={<Send className="size-4" />}
      >
        Enviar cadastro
      </Button>
    </form>
  );
}
