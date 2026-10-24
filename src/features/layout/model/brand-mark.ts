// PM SHOW mark: a police shield framing a musical note. Single source of the
// geometry (32×32 viewBox) for the UI logo and the generated app icons; the
// static favicon (src/app/icon.svg) mirrors these paths.
export const BRAND_MARK = {
  viewBox: "0 0 32 32",
  shield:
    "M16 2.6 27 6.6V15c0 7-4.7 12.3-11 14.4C9.7 27.3 5 22 5 15V6.6L16 2.6Z",
  noteStem: "M18.2 9v10.6",
  noteFlag: "M18.2 9c2.6.8 4.2 2.4 4.2 5",
  noteHead: { cx: 15.6, cy: 19.9, rx: 2.9, ry: 2.2, rotate: -20 },
  // Mirrors the chrome and brand-gold tokens (app/globals.css).
  colors: { tile: "#0e1610", gold: "#d1a12a", white: "#f2ecdd" },
} as const;
