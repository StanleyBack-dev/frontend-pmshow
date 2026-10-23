import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { PasswordRecoveryFlow } from "@/features/auth/components/PasswordRecoveryFlow";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function PasswordRecoveryPage() {
  return (
    <AuthLayout title="Recuperar senha">
      <PasswordRecoveryFlow />
    </AuthLayout>
  );
}
