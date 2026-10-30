import { BRAND_MARK } from "@/features/layout/model/brand-mark";

// Link preview (1200×630) for ImageResponse: what WhatsApp, Instagram,
// Facebook and X show when someone shares an address of the app. Dark chrome
// with faint staff lines, the logo in a gold ring, the name and a headline.
export const SHARE_CARD_SIZE = { width: 1200, height: 630 };

export function ShareCard({
  headline,
  note,
  logoSrc,
}: {
  /** Big line under the name (e.g. "Cadastro de integrante"). */
  headline: string;
  /** Small line at the bottom. */
  note: string;
  /** From brandLogoSrc(). */
  logoSrc: string;
}) {
  const { colors } = BRAND_MARK;
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
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse */}
          <img src={logoSrc} width={276} height={276} alt="" />
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
