import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { connection } from "next/server";
import { ToastProvider } from "@/shared/toast/ToastProvider";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/shared/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  // Private app: no page is offered to search engines.
  robots: { index: false, follow: false },
  // Title and status bar of the installed app on iOS.
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  // The chrome color (globals.css): the installed app's status bar.
  themeColor: "#0e1610",
};

// Every page renders per request: the CSP nonce (proxy.ts) can only be
// applied to dynamically rendered HTML.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
