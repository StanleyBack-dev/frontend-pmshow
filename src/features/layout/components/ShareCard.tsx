import { BRAND_MARK } from "@/features/layout/model/brand-mark";

// Link preview (1200×630) for ImageResponse: what WhatsApp, Instagram,
// Facebook and X show when someone shares an address of the app. Dark chrome
// with faint staff lines, the mark in a gold ring, the name and a headline.
export const SHARE_CARD_SIZE = { width: 1200, height: 630 };

export function ShareCard({
  headline,
  note,
}: {
  /** Big line under the name (e.g. "Cadastro de integrante"). */
  headline: string;
  /** Small line at the bottom. */
  note: string;
}) {
  const { shield, noteStem, noteFlag, noteHead, colors } = BRAND_MARK;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background:
          "linear-gradient(135deg, #16231a 0%, #0e1610 55%, #0a100c 100%)",
        color: colors.white,
        fontFamily: "sans-serif",
      }}
    >
      {/* Five staff lines, faint, across the card. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 250,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {[0, 1, 2, 3, 4].map((line) => (
          <div
            key={line}
            style={{ height: 2, background: "rgba(242,236,221,0.06)" }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 150,
            border: `4px solid rgba(209,161,42,0.55)`,
            background: "rgba(242,236,221,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="190" height="190" viewBox={BRAND_MARK.viewBox}>
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            PM&nbsp;<span style={{ color: colors.gold }}>SHOW</span>
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: colors.gold,
            }}
          >
            Banda da Polícia Militar de Goiás
          </div>
          <div
            style={{
              marginTop: 44,
              fontSize: 44,
              fontWeight: 600,
              maxWidth: 640,
              lineHeight: 1.15,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 26,
              color: "rgba(242,236,221,0.7)",
              maxWidth: 640,
            }}
          >
            {note}
          </div>
        </div>
      </div>
    </div>
  );
}
