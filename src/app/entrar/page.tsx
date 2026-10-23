import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { safeNextPath } from "@/shared/lib/safe-redirect";
import { firstParam, type RawSearchParams } from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  return (
    <AuthLayout
      title="Entrar"
      description="Use o usuário e a senha que você recebeu por e-mail."
    >
      <LoginForm
        next={safeNextPath(firstParam(params, "next"))}
        expired={firstParam(params, "expired") === "1"}
      />
    </AuthLayout>
  );
}
