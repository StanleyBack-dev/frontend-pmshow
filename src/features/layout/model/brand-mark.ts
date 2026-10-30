// PM SHOW mark: the band's round medallion (assets/pm-show-logo.png, also the
// favicon at src/app/icon.png). The UI shows it through LogoMark; the
// generated images (app icons, link previews) read it with brandLogoSrc().
export const BRAND_MARK = {
  /** Project-relative path, read from disk by the image routes. */
  file: "src/features/layout/assets/pm-show-logo.png",
  // Mirrors the chrome and brand-gold tokens (app/globals.css).
  colors: { tile: "#0e1610", gold: "#d1a12a", white: "#f2ecdd" },
} as const;
