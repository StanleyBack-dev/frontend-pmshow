// Public address of the app, used in metadata and in links sent by e-mail.
// SITE_URL wins; on Vercel the production domain is known at build time;
// everywhere else it is the local dev server.
export function siteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "PM SHOW";
export const SITE_DESCRIPTION =
  "Repertório, agenda e escalas da banda PM SHOW da Polícia Militar de Goiás.";
