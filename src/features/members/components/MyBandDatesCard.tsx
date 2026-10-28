"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cake, Save } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Field } from "@/design-system";
import { bandTime } from "@/features/members/model/member-labels";
import type { BandDates } from "@/shared/contracts/members";
import { ApiClientError, apiRequest } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Anyone's own birthday (for the month's birthdays on the home page) and
// band start date (time in the band). Both optional.
export function MyBandDatesCard({ profile }: { profile: BandDates }) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [birthDate, setBirthDate] = useState(profile.birthDate ?? "");
  const [joinedOn, setJoinedOn] = useState(profile.joinedOn ?? "");
  const [pending, setPending] = useState(false);
  const changed =
    birthDate !== (profile.birthDate ?? "") ||
    joinedOn !== (profile.joinedOn ?? "");
  const today = new Date().toISOString().slice(0, 10);

  async function save() {
    setPending(true);
    try {
      await apiRequest("/me/band-dates", {
        method: "PUT",
        body: JSON.stringify({
          birthDate: birthDate || null,
          joinedOn: joinedOn || null,
        }),
      });
      showSuccess("Datas salvas.");
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar.",
      );
    }
    setPending(false);
  }

  return (
    <Card>
      <CardHeader
        title="Aniversário e tempo de banda"
        description="Opcionais. O aniversário aparece para a banda no Início, no seu mês."
      />
      <CardBody className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Data de nascimento"
            type="date"
            max={today}
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />
          <Field
            label="Ingresso na banda"
            type="date"
            max={today}
            value={joinedOn}
            onChange={(event) => setJoinedOn(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-[13px] text-muted">
            <Cake aria-hidden className="size-4 text-brand-gold-ink" />
            Tempo de banda:{" "}
            <strong className="text-fg">
              {bandTime(joinedOn || null, new Date())}
            </strong>
          </p>
          <Button
            icon={<Save className="size-4" />}
            loading={pending}
            disabled={!changed}
            onClick={save}
          >
            Salvar datas
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
