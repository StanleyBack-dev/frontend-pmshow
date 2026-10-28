"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Modal, Spinner } from "@/design-system";
import { rostersClient } from "@/features/rosters/api/rosters.client";
import { RosterEditor } from "@/features/rosters/components/RosterEditor";
import type { BandFunction } from "@/shared/contracts/members";
import type { Roster, RosterCandidate } from "@/shared/contracts/rosters";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Loaded = {
  roster: Roster | null;
  candidates: RosterCandidate[];
  functions: BandFunction[];
};

// The roster of one event, built without leaving the event drawer.
export function RosterModal({
  eventId,
  eventTitle,
  canPublish,
  onClose,
}: {
  eventId: string;
  eventTitle: string;
  canPublish: boolean;
  onClose: () => void;
}) {
  const { showError } = useToast();
  const [data, setData] = useState<Loaded | null>(null);

  useEffect(() => {
    let active = true;
    rostersClient.load(eventId).then(
      (result) => {
        if (active) setData(result);
      },
      (cause: unknown) => {
        if (!active) return;
        showError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar a escala.",
        );
        onClose();
      },
    );
    return () => {
      active = false;
    };
  }, [eventId, onClose, showError]);

  return (
    <Modal
      open
      size="xl"
      onClose={onClose}
      icon={<ClipboardList className="size-5" />}
      title={`${data?.roster ? "Editar escala" : "Montar escala"} · ${eventTitle}`}
    >
      {data ? (
        <RosterEditor
          eventId={eventId}
          candidates={data.candidates}
          functions={data.functions}
          roster={data.roster}
          canPublish={canPublish}
          onPublished={onClose}
        />
      ) : (
        <div className="grid place-items-center py-16">
          <Spinner />
        </div>
      )}
    </Modal>
  );
}
