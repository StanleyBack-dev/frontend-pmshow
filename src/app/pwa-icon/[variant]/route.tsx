import { ImageResponse } from "next/og";
import { BrandIcon } from "@/features/layout/components/BrandIcon";
import { brandLogoSrc } from "@/features/layout/model/brand-logo";

// PNG icons referenced by the web manifest, rendered from the brand logo on
// the chrome tile.
const VARIANTS = {
  "192": { size: 192, padding: 0.06 },
  "512": { size: 512, padding: 0.06 },
  // Maskable: launchers keep only the central circle (80% wide), so the
  // round logo shrinks to fit inside it.
  "maskable-512": { size: 512, padding: 0.12 },
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant } = await params;
  const spec = VARIANTS[variant as keyof typeof VARIANTS];
  if (!spec) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    <BrandIcon
      size={spec.size}
      padding={spec.padding}
      logoSrc={await brandLogoSrc()}
    />,
    { width: spec.size, height: spec.size },
  );
}
