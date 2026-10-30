import { BRAND_MARK } from "@/features/layout/model/brand-mark";

// Full-bleed app icon (dark green tile + the round logo) for ImageResponse
// renders: apple-icon and the PWA manifest icons. `padding` keeps the logo
// inside the safe zone of maskable icons.
export function BrandIcon({
  size,
  logoSrc,
  padding = 0.16,
}: {
  size: number;
  /** From brandLogoSrc(). */
  logoSrc: string;
  padding?: number;
}) {
  const inner = Math.round(size * (1 - padding * 2));
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_MARK.colors.tile,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse */}
      <img src={logoSrc} width={inner} height={inner} alt="" />
    </div>
  );
}
