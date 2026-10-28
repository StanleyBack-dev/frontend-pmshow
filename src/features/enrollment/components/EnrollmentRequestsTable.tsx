"use client";

import { auditColumn } from "@/features/audit/components/RecordAudit";
import { useState } from "react";
import { Eye, UserCheck } from "lucide-react";
import {
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
} from "@/design-system";
import { CopyShareValue } from "@/features/admin/components/CopyShareValue";
import { EnrollmentReviewDrawer } from "@/features/enrollment/components/EnrollmentReviewDrawer";
import { ENROLLMENT_STATUS } from "@/features/enrollment/model/enrollment-form";
import { RankBadge } from "@/features/members/components/RankBadge";
import { formatPhone } from "@/features/members/model/member-labels";
import type { UserGroup } from "@/shared/contracts/api";
import type {
  EnrollmentInstrument,
  EnrollmentRequest,
} from "@/shared/contracts/enrollment";
import { formatDateTime } from "@/shared/lib/format";

// Sign-ups sent through the public link; each row opens its review.
export function EnrollmentRequestsTable({
  requests,
  instruments,
  assignableGroups,
}: {
  requests: EnrollmentRequest[];
  instruments: EnrollmentInstrument[];
  /** Groups the current admin may give to the new account. */
  assignableGroups: UserGroup[];
}) {
  const [open, setOpen] = useState<EnrollmentRequest | null>(null);

  const audit = auditColumn((request: EnrollmentRequest) => ({
    entity: "enrollment_request" as const,
    id: request.id,
    label: request.fullName,
  }));
  const columns: DataTableColumn<EnrollmentRequest>[] = [
    {
      key: "name",
      label: "Nome",
      mobile: "title",
      render: (request) => (
        <span className="font-medium text-fg">{request.fullName}</span>
      ),
    },
    {
      key: "warName",
      label: "Nome de guerra",
      desktop: "detail",
      className: "whitespace-nowrap",
      render: (request) => request.warName,
    },
    {
      key: "rank",
      label: "Posto / graduação",
      className: "whitespace-nowrap",
      render: (request) => (
        <RankBadge rank={request.military ? request.rank : "CIVIL"} />
      ),
    },
    {
      key: "identifier",
      label: "RG militar / identificador",
      className: "whitespace-nowrap",
      render: (request) =>
        request.military ? (
          <span className="font-mono">{request.militaryId}</span>
        ) : (
          <span className="text-soft">Gerado na aprovação</span>
        ),
    },
    {
      key: "phone",
      label: "Telefone",
      className: "whitespace-nowrap",
      render: (request) => (
        <span className="text-muted">{formatPhone(request.phone)}</span>
      ),
    },
    {
      key: "status",
      label: "Situação",
      render: (request) => {
        const status = ENROLLMENT_STATUS[request.status];
        return <Badge tone={status.tone}>{status.label}</Badge>;
      },
    },
    {
      key: "sent",
      label: "Enviado em",
      className: "whitespace-nowrap",
      render: (request) => formatDateTime(request.createdAt),
    },
    {
      key: "email",
      label: "E-mail",
      desktop: "detail",
      render: (request) => (
        <CopyShareValue value={request.email} label="E-mail" />
      ),
    },
    {
      key: "actions",
      label: "",
      mobile: "control",
      className: "text-right",
      render: (request) =>
        request.status === "PENDENTE" ? (
          <Button
            size="sm"
            icon={<UserCheck className="size-4" />}
            onClick={() => setOpen(request)}
          >
            Analisar
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            icon={<Eye className="size-4" />}
            onClick={() => setOpen(request)}
          >
            Ver
          </Button>
        ),
    },
  ];

  return (
    <>
      <DataTable
        rows={requests}
        columns={[...columns, audit.column]}
        getId={(request) => request.id}
        renderExpanded={audit.renderExpanded}
      />
      {open && (
        <EnrollmentReviewDrawer
          key={open.id}
          request={open}
          instruments={instruments}
          assignableGroups={assignableGroups}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
