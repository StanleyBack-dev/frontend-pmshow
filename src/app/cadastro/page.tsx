import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { EnrollmentFlow } from "@/features/enrollment/components/EnrollmentFlow";

const SHARE_TITLE = "Cadastro de integrante · PM SHOW";
const SHARE_DESCRIPTION =
  "Use o código do convite para preencher os seus dados e entrar na banda da Polícia Militar de Goiás.";

export const metadata: Metadata = {
  title: "Cadastro na banda",
  robots: { index: false },
  // The invite links go over WhatsApp: their own preview.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "PM SHOW",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
  },
};

export default function EnrollmentPage() {
  return (
    <AuthLayout wide>
      <EnrollmentFlow />
    </AuthLayout>
  );
}
