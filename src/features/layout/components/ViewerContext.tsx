"use client";

import { createContext, useContext } from "react";
import type { Permission } from "@/shared/contracts/api";

/** What client components need to know about who is using the app. */
export type Viewer = {
  permissions: readonly Permission[];
  /** Sees the admin area (any of its permissions). */
  showAdmin: boolean;
  /** Opens the guided tour again (Ajuda → "Rever a apresentação"). */
  restartTour: () => void;
};

const ViewerContext = createContext<Viewer | null>(null);

export const ViewerProvider = ViewerContext.Provider;

/** null outside the signed-in area (login, public pages). */
export const useViewer = () => useContext(ViewerContext);
