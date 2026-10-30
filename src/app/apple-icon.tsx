import { ImageResponse } from "next/og";
import { BrandIcon } from "@/features/layout/components/BrandIcon";
import { brandLogoSrc } from "@/features/layout/model/brand-logo";

// Home-screen icon on iOS (generated at build time).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    <BrandIcon
      size={size.width}
      padding={0.08}
      logoSrc={await brandLogoSrc()}
    />,
    size,
  );
}
