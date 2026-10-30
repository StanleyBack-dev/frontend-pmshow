import { ImageResponse } from "next/og";
import {
  SHARE_CARD_SIZE,
  ShareCard,
} from "@/features/layout/components/ShareCard";
import { brandLogoSrc } from "@/features/layout/model/brand-logo";

// Cover of the sign-up invite links, the ones sent most over WhatsApp.
export const alt = "Cadastro de integrante · PM SHOW";
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

export default async function EnrollmentOpengraphImage() {
  return new ImageResponse(
    <ShareCard
      headline="Cadastro de integrante"
      note="Use o código do convite para preencher os seus dados e entrar na banda."
      logoSrc={await brandLogoSrc()}
    />,
    size,
  );
}
