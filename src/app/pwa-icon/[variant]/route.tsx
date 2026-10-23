import { ImageResponse } from "next/og";
import { BrandIcon } from "@/features/layout/components/BrandIcon";

// PNG icons referenced by the web manifest, rendered from the brand mark
// instead of committed image files.
const VARIANTS = {
  "192": { size: 192, padding: 0.14 },
  "512": { size: 512, padding: 0.14 },
  // Maskable: launchers crop up to the outer 10%, so the mark sits deeper.
  "maskable-512": { size: 512, padding: 0.24 },
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
    <BrandIcon size={spec.size} padding={spec.padding} />,
    { width: spec.size, height: spec.size },
  );
}
