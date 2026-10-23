import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { getSessionUser } from "@/server/auth/current-user";

export const metadata: Metadata = { title: "Primeiro acesso" };

// Outside the (app) layout on purpose: that layout sends users with a
// temporary password here.
export default async function FirstAccessPage() {
  const user = await getSessionUser();
  if (!user.mustChangePassword) redirect("/inicio");

  return (
    <AuthLayout
      title={`Bem-vindo, ${user.name.split(" ")[0]}!`}
      description="Para começar, troque a senha temporária por uma senha só sua."
    >
      <ChangePasswordForm firstAccess redirectTo="/inicio" />
    </AuthLayout>
  );
}
