"use client";

import { PlayCircle } from "lucide-react";
import { Button } from "@/design-system";
import { useViewer } from "@/features/layout/components/ViewerContext";

/** Shows the guided tour again (Ajuda). */
export function RestartTourButton() {
  const viewer = useViewer();
  if (!viewer) return null;
  return (
    <Button
      variant="secondary"
      icon={<PlayCircle className="size-4" />}
      onClick={viewer.restartTour}
      className="max-sm:w-full max-sm:justify-center"
    >
      Rever a apresentação
    </Button>
  );
}
