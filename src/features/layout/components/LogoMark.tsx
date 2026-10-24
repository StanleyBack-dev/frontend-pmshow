import { BRAND_MARK } from "@/features/layout/model/brand-mark";

// The shield follows currentColor and the note uses the brand-gold token, so
// the same mark works on the dark chrome and on light pages.
export function LogoMark({ className }: { className?: string }) {
  const { shield, noteStem, noteFlag, noteHead } = BRAND_MARK;
  return (
    <svg
      viewBox={BRAND_MARK.viewBox}
      fill="none"
      role="img"
      aria-label="PM SHOW"
      className={className}
    >
      <path
        d={shield}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <g stroke="var(--brand-gold)" strokeWidth="2" strokeLinecap="round">
        <path d={noteStem} />
        <path d={noteFlag} />
      </g>
      <ellipse
        cx={noteHead.cx}
        cy={noteHead.cy}
        rx={noteHead.rx}
        ry={noteHead.ry}
        transform={`rotate(${noteHead.rotate} ${noteHead.cx} ${noteHead.cy})`}
        fill="var(--brand-gold)"
      />
    </svg>
  );
}
