import type { Tone } from "@/design-system";
import { formatPhone } from "@/features/members/model/member-labels";
import type {
  EnrollmentData,
  EnrollmentInstrumentChoice,
  EnrollmentRequest,
  EnrollmentStatus,
} from "@/shared/contracts/enrollment";
import type { Rank } from "@/shared/contracts/members";
import { phoneError } from "@/shared/lib/masks";

export type EnrollmentForm = {
  fullName: string;
  email: string;
  phone: string;
  /** null until the person answers "militar ou civil". */
  military: boolean | null;
  militaryId: string;
  rank: Rank | "";
  warName: string;
  instruments: EnrollmentInstrumentChoice[];
};

export const EMPTY_ENROLLMENT: EnrollmentForm = {
  fullName: "",
  email: "",
  phone: "",
  military: null,
  militaryId: "",
  rank: "",
  warName: "",
  instruments: [],
};

export const fromRequest = (request: EnrollmentRequest): EnrollmentForm => ({
  fullName: request.fullName,
  email: request.email,
  phone: formatPhone(request.phone),
  military: request.military,
  militaryId: request.militaryId ?? "",
  rank: request.military ? request.rank : "",
  warName: request.warName,
  instruments: request.instruments.map(({ instrumentId, primary }) => ({
    instrumentId,
    primary,
  })),
});

/** RG militar: digits only, 5 at most. */
export const maskMilitaryId = (value: string) =>
  value.replace(/\D/g, "").slice(0, 5);

export type EnrollmentErrors = Partial<Record<keyof EnrollmentForm, string>>;

/** Same rules as the API, to show them while typing. */
export function enrollmentErrors(form: EnrollmentForm): EnrollmentErrors {
  const errors: EnrollmentErrors = {};
  const name = form.fullName.trim();
  if (name.length < 5 || !name.includes(" ")) {
    errors.fullName = "Informe o nome completo (nome e sobrenome).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!form.phone) errors.phone = "Informe o telefone com DDD.";
  else {
    const phone = phoneError(form.phone);
    if (phone) errors.phone = phone;
  }
  if (form.military === null) errors.military = "Escolha militar ou civil.";
  if (form.military) {
    if (form.militaryId.length !== 5) {
      errors.militaryId = "O RG militar tem 5 números.";
    }
    if (!form.rank) errors.rank = "Escolha o posto ou a graduação.";
  }
  const warName = form.warName.trim();
  if (warName.length < 2) errors.warName = "Informe o nome de guerra.";
  if (form.instruments.length === 0) {
    errors.instruments = "Escolha pelo menos um instrumento ou função.";
  }
  return errors;
}

export const toEnrollmentData = (form: EnrollmentForm): EnrollmentData => ({
  fullName: form.fullName.trim(),
  email: form.email.trim(),
  phone: form.phone,
  military: form.military === true,
  militaryId: form.military ? form.militaryId : null,
  rank: form.military && form.rank ? form.rank : null,
  warName: form.warName.trim(),
  instruments: form.instruments,
});

export const ENROLLMENT_STATUS: Record<
  EnrollmentStatus,
  { label: string; tone: Tone }
> = {
  PENDENTE: { label: "Pendente", tone: "warning" },
  APROVADA: { label: "Aprovado", tone: "success" },
  RECUSADA: { label: "Recusado", tone: "danger" },
};

export const ENROLLMENT_STATUSES = Object.keys(
  ENROLLMENT_STATUS,
) as EnrollmentStatus[];
