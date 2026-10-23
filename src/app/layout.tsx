import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#070f1d" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
