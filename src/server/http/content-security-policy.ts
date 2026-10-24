import "server-only";

// Content-Security-Policy for every page (Next.js nonce guide): scripts run
// only with this request's nonce ('strict-dynamic' lets them load the rest),
// and the browser only talks to this origin, the YouTube player and the
// audio storage.

export function createNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

export function contentSecurityPolicy(options: {
  nonce: string;
  isDev: boolean;
  /** Origin of the audio storage (signed URLs, uploads); null = none yet. */
  mediaOrigin: string | null;
}): string {
  const media = options.mediaOrigin ? ` ${options.mediaOrigin}` : "";
  return [
    "default-src 'self'",
    // React needs eval only in development (error overlays).
    `script-src 'self' 'nonce-${options.nonce}' 'strict-dynamic'${options.isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${options.nonce}'`,
    // style="" attributes (next/image, progress bars) can't carry a nonce.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `media-src 'self' blob:${media}`,
    `connect-src 'self'${media}`,
    "frame-src https://www.youtube-nocookie.com",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Not in development: the app is opened over plain http on the LAN.
    ...(options.isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}
