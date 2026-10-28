"use client";

import { createContext, useContext, type ReactNode } from "react";

// A slot next to every page title, filled by the app shell (e.g. the page's
// help button) so the design system never depends on app features.
const PageTitleAddonContext = createContext<ReactNode>(null);

export const PageTitleAddonProvider = PageTitleAddonContext.Provider;

export function PageTitleAddon() {
  return <>{useContext(PageTitleAddonContext)}</>;
}
