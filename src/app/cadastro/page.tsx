import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { EnrollmentFlow } from "@/features/enrollment/components/EnrollmentFlow";

export const metadata: Metadata = {
  title: "Cadastro na banda",
  robots: { index: false },
};

export default function EnrollmentPage() {
  return (
    <AuthLayout wide>
      <EnrollmentFlow />
    </AuthLayout>
  );
}
