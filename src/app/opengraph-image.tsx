import { ImageResponse } from "next/og";
import {
  SHARE_CARD_SIZE,
  ShareCard,
} from "@/features/layout/components/ShareCard";
import { brandLogoSrc } from "@/features/layout/model/brand-logo";

// Cover shown when a link of the app is shared (WhatsApp, Instagram,
// Facebook…); every page without its own inherits it. Public in proxy.ts.
export const alt = "PM SHOW · Banda da Polícia Militar de Goiás";
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <ShareCard
      headline="A banda inteira no mesmo compasso."
      note="Agenda, escalas e repertório com áudios e vídeos para ensaiar."
      logoSrc={await brandLogoSrc()}
    />,
    size,
  );
}
