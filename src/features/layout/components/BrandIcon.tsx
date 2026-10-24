import { BRAND_MARK } from "@/features/layout/model/brand-mark";

// Full-bleed app icon (dark green tile + light shield + gold note) for ImageResponse
// renders: apple-icon and the PWA manifest icons. `padding` keeps the mark
// inside the safe zone of maskable icons.
export function BrandIcon({
  size,
  padding = 0.16,
}: {
  size: number;
  padding?: number;
}) {
  const { shield, noteStem, noteFlag, noteHead, colors } = BRAND_MARK;
  const inner = Math.round(size * (1 - padding * 2));
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.tile,
      }}
    >
      <svg width={inner} height={inner} viewBox={BRAND_MARK.viewBox}>
        <path
          d={shield}
          fill="none"
          stroke={colors.white}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d={noteStem}
          stroke={colors.gold}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d={noteFlag}
          fill="none"
          stroke={colors.gold}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse
          cx={noteHead.cx}
          cy={noteHead.cy}
          rx={noteHead.rx}
          ry={noteHead.ry}
          transform={`rotate(${noteHead.rotate} ${noteHead.cx} ${noteHead.cy})`}
          fill={colors.gold}
        />
      </svg>
    </div>
  );
}
