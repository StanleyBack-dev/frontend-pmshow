/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type AbsenceFilterInput = {
  /** Tocando o período a partir de (AAAA-MM-DD). */
  from?: string | null | undefined;
  statuses?: Array<AbsenceStatus> | null | undefined;
  /** Tocando o período até (AAAA-MM-DD). */
  to?: string | null | undefined;
  userId?: string | number | null | undefined;
};

export type AbsenceInput = {
  /** AAAA-MM-DD */
  endsOn: string;
  reason?: string | null | undefined;
  /** AAAA-MM-DD */
  startsOn: string;
  type: AbsenceType;
};

export type AbsenceStatus =
  | 'APROVADA'
  | 'CANCELADA'
  | 'PENDENTE'
  | 'RECUSADA';

/** Motivo da indisponibilidade. */
export type AbsenceType =
  | 'CURSO'
  | 'DISPENSA_MEDICA'
  | 'FERIAS'
  | 'LICENCA'
  | 'MISSAO'
  | 'OUTRO';

export type AckAnswer =
  | 'CIENTE'
  | 'TROCA_SOLICITADA';

/** Resposta do escalado. */
export type AckStatus =
  | 'CIENTE'
  | 'PENDENTE'
  | 'TROCA_SOLICITADA';

export type AddYoutubeVideoInput = {
  /** Link do vídeo (youtube.com, youtu.be, shorts…). */
  link: string;
  songId: string | number;
  /** Título; sem ele, usa o do YouTube. */
  title?: string | null | undefined;
};

export type AssignmentInput = {
  instrumentId?: string | number | null | undefined;
  notes?: string | null | undefined;
  overrideReason?: string | null | undefined;
  role: AssignmentRole;
  userId: string | number;
};

/** Função na escala. */
export type AssignmentRole =
  | 'APOIO'
  | 'CHEFE_EQUIPE'
  | 'MOTORISTA'
  | 'MUSICO'
  | 'REGENTE'
  | 'SOM';

export type AuditFilterInput = {
  actorId?: string | number | null | undefined;
  entity?: string | null | undefined;
  entityId?: string | null | undefined;
};

/** Quem recebe o comunicado. */
export type BroadcastAudience =
  | 'ESCALA_EVENTO'
  | 'NAIPE'
  | 'TODOS';

export type BroadcastInput = {
  audience: BroadcastAudience;
  body: string;
  eventId?: string | number | null | undefined;
  section?: Section | null | undefined;
  /** Também envia por e-mail. */
  sendEmail: boolean;
  title: string;
};

/** Por que a pessoa não pode ser escalada. */
export type CandidateBlocker =
  /** Indisponibilidade aprovada no período. */
  | 'ABSENT'
  /** Afastado. */
  | 'AWAY'
  /** Inativo. */
  | 'INACTIVE'
  /** Sem cadastro ativo na banda. */
  | 'NO_PROFILE';

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type ConfirmAudioUploadInput = {
  assetId: string | number;
  /** Duração lida pelo navegador, em segundos. */
  durationSeconds?: number | null | undefined;
};

export type CreateInstrumentInput = {
  name: string;
  section: Section;
};

export type CreateUserInput = {
  email: string;
  group: UserGroup;
  name: string;
  /** Login: 3 a 32 caracteres (a-z, 0-9, ., -, _). */
  username: string;
};

export type EventFilterInput = {
  /** Início a partir de. */
  from?: string | null | undefined;
  statuses?: Array<EventStatus> | null | undefined;
  /** Início antes de. */
  to?: string | null | undefined;
  type?: EventType | null | undefined;
};

export type EventInput = {
  callTime?: string | null | undefined;
  documentRef?: string | null | undefined;
  endsAt?: string | null | undefined;
  notes?: string | null | undefined;
  requester?: string | null | undefined;
  startsAt: string;
  title: string;
  type: EventType;
  uniform?: string | null | undefined;
  venueId?: string | number | null | undefined;
};

export type EventStatus =
  | 'CANCELADO'
  | 'CONFIRMADO'
  | 'PLANEJADO'
  | 'REALIZADO';

/** Tipo de apresentação ou compromisso. */
export type EventType =
  | 'CULTO_MISSA'
  | 'DESFILE'
  | 'ENSAIO'
  | 'FORMATURA'
  | 'OUTRO'
  | 'SHOW'
  | 'SOLENIDADE';

export type LoginInput = {
  /** Usuário ou e-mail. */
  login: string;
  password: string;
};

export type MediaKind =
  | 'AUDIO'
  | 'VIDEO';

export type MediaStatus =
  | 'PENDING'
  | 'READY';

export type MemberInstrumentInput = {
  instrumentId: string | number;
  primary?: boolean;
};

export type MemberProfileInput = {
  instruments: Array<MemberInstrumentInput>;
  notes?: string | null | undefined;
  phone?: string | null | undefined;
  rank: Rank;
  registration?: string | null | undefined;
  section: Section;
  status: MemberStatus;
  warName: string;
};

/** Situação do integrante na banda. */
export type MemberStatus =
  | 'AFASTADO'
  | 'ATIVO'
  | 'INATIVO';

export type NotificationType =
  | 'ABSENCE_REVIEWED'
  | 'BROADCAST'
  | 'EVENT_CANCELLED'
  | 'EVENT_REMINDER'
  | 'EVENT_RESCHEDULED'
  | 'ROSTER_PUBLISHED'
  | 'ROSTER_REMOVED'
  | 'ROSTER_SWAP_REQUESTED'
  | 'ROSTER_UPDATED';

export type PageInput = {
  limit?: number;
  page?: number;
};

/** Capacidade verificada pela API. */
export type Permission =
  | 'ABSENCES_MANAGE'
  | 'ABSENCES_REQUEST'
  | 'AUDIT_READ'
  | 'EVENTS_MANAGE'
  | 'EVENTS_READ'
  | 'MEDIA_DOWNLOAD'
  | 'MEDIA_UPLOAD'
  | 'MEMBERS_MANAGE'
  | 'MEMBERS_READ'
  | 'NOTIFICATIONS_BROADCAST'
  | 'PERMISSIONS_MANAGE'
  | 'REPERTOIRE_MANAGE'
  | 'REPERTOIRE_READ'
  | 'ROSTERS_MANAGE'
  | 'ROSTERS_PUBLISH'
  | 'ROSTERS_READ_ALL'
  | 'ROSTERS_READ_OWN'
  | 'USERS_MANAGE';

/** PushSubscription do navegador (PushManager). */
export type PushSubscriptionInput = {
  /** Segredo de autenticação (base64url). */
  auth: string;
  endpoint: string;
  /** Chave pública do aparelho (base64url). */
  p256dh: string;
};

/** Posto/graduação. */
export type Rank =
  | 'ASPIRANTE'
  | 'CABO'
  | 'CADETE'
  | 'CAPITAO'
  | 'CIVIL'
  | 'CORONEL'
  | 'MAJOR'
  | 'PRIMEIRO_SARGENTO'
  | 'PRIMEIRO_TENENTE'
  | 'SEGUNDO_SARGENTO'
  | 'SEGUNDO_TENENTE'
  | 'SOLDADO'
  | 'SUBTENENTE'
  | 'TENENTE_CORONEL'
  | 'TERCEIRO_SARGENTO';

export type RequestAudioUploadInput = {
  /** Ex.: audio/mpeg. */
  mimeType: string;
  sizeBytes: number;
  songId: string | number;
  title: string;
};

export type ResetPasswordInput = {
  newPassword: string;
  resetToken: string;
};

export type RosterFilterInput = {
  instrumentId?: string | number | null | undefined;
  search?: string | null | undefined;
  section?: Section | null | undefined;
  status?: MemberStatus | null | undefined;
  /** false = só quem ainda não tem cadastro. */
  withProfile?: boolean | null | undefined;
};

export type RosterInput = {
  assignments: Array<AssignmentInput>;
};

export type RosterStatus =
  | 'PUBLICADA'
  | 'RASCUNHO';

/** Naipe da banda. */
export type Section =
  | 'APOIO'
  | 'CORDAS_BASE'
  | 'MADEIRAS'
  | 'METAIS'
  | 'PERCUSSAO'
  | 'TECNICA'
  | 'VOCAL';

export type SetUserPermissionsInput = {
  /** Conjunto completo desejado (ignorado com useGroupDefaults). */
  permissions?: Array<Permission> | null | undefined;
  /** true descarta as exceções e volta ao padrão do grupo. */
  useGroupDefaults: boolean;
  userId: string | number;
};

export type SetlistInput = {
  items: Array<SetlistItemInput>;
};

export type SetlistItemInput = {
  notes?: string | null | undefined;
  songId: string | number;
};

/** Categoria da música no repertório. */
export type SongCategory =
  | 'DOBRADO'
  | 'FORRO'
  | 'GOSPEL'
  | 'HINO'
  | 'INFANTIL'
  | 'INSTRUMENTAL'
  | 'MARCHA'
  | 'MPB'
  | 'OUTRO'
  | 'POP_ROCK'
  | 'SAMBA_PAGODE'
  | 'SERTANEJO';

export type SongFilterInput = {
  /** Arquivadas (exige REPERTOIRE_MANAGE). */
  archived?: boolean;
  category?: SongCategory | null | undefined;
  search?: string | null | undefined;
  tag?: string | null | undefined;
};

export type SongInput = {
  arranger?: string | null | undefined;
  artist?: string | null | undefined;
  bpm?: number | null | undefined;
  category: SongCategory;
  durationSeconds?: number | null | undefined;
  lyrics?: string | null | undefined;
  musicalKey?: string | null | undefined;
  notes?: string | null | undefined;
  tags?: Array<string>;
  title: string;
};

export type UpdateInstrumentInput = {
  archived?: boolean | null | undefined;
  name?: string | null | undefined;
  section?: Section | null | undefined;
};

export type UpdateMyProfileInput = {
  email: string;
  name: string;
};

export type UpdateUserInput = {
  email?: string | null | undefined;
  group?: UserGroup | null | undefined;
  name?: string | null | undefined;
  username?: string | null | undefined;
};

export type UserFilterInput = {
  active?: boolean | null | undefined;
  group?: UserGroup | null | undefined;
  search?: string | null | undefined;
};

/** Perfil de acesso: Músico, Gestor ou Administrador geral. */
export type UserGroup =
  /** Gestor */
  | 'ADMIN'
  /** Administrador geral */
  | 'ADMIN_MASTER'
  /** Músico */
  | 'USER';

export type VenueInput = {
  address?: string | null | undefined;
  archived?: boolean | null | undefined;
  /** Padrão: Goiânia. */
  city?: string | null | undefined;
  mapsUrl?: string | null | undefined;
  name: string;
  notes?: string | null | undefined;
};

export type VerifyRecoveryCodeInput = {
  code: string;
  login: string;
};

export type AbsenceFieldsFragment = { id: string, userId: string, userName: string, warName: string | null, type: AbsenceType, startsOn: string, endsOn: string, reason: string | null, status: AbsenceStatus, reviewNote: string | null, reviewedAt: string | null, createdAt: string };

export type MyAbsencesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAbsencesQuery = { myAbsences: Array<{ id: string, userId: string, userName: string, warName: string | null, type: AbsenceType, startsOn: string, endsOn: string, reason: string | null, status: AbsenceStatus, reviewNote: string | null, reviewedAt: string | null, createdAt: string }> };

export type AbsencesQueryVariables = Exact<{
  filter?: AbsenceFilterInput | null | undefined;
}>;


export type AbsencesQuery = { absences: Array<{ id: string, userId: string, userName: string, warName: string | null, type: AbsenceType, startsOn: string, endsOn: string, reason: string | null, status: AbsenceStatus, reviewNote: string | null, reviewedAt: string | null, createdAt: string }> };

export type RequestAbsenceMutationVariables = Exact<{
  input: AbsenceInput;
}>;


export type RequestAbsenceMutation = { requestAbsence: { id: string, userId: string, userName: string, warName: string | null, type: AbsenceType, startsOn: string, endsOn: string, reason: string | null, status: AbsenceStatus, reviewNote: string | null, reviewedAt: string | null, createdAt: string } };

export type RegisterAbsenceMutationVariables = Exact<{
  userId: string | number;
  input: AbsenceInput;
}>;


export type RegisterAbsenceMutation = { registerAbsence: { id: string, userId: string, userName: string, warName: string | null, type: AbsenceType, startsOn: string, endsOn: string, reason: string | null, status: AbsenceStatus, reviewNote: string | null, reviewedAt: string | null, createdAt: string } };

export type ReviewAbsenceMutationVariables = Exact<{
  id: string | number;
  approve: boolean;
  note?: string | null | undefined;
}>;


export type ReviewAbsenceMutation = { reviewAbsence: { id: string, userId: string, userName: string, warName: string | null, type: AbsenceType, startsOn: string, endsOn: string, reason: string | null, status: AbsenceStatus, reviewNote: string | null, reviewedAt: string | null, createdAt: string } };

export type CancelAbsenceMutationVariables = Exact<{
  id: string | number;
}>;


export type CancelAbsenceMutation = { cancelAbsence: { id: string, userId: string, userName: string, warName: string | null, type: AbsenceType, startsOn: string, endsOn: string, reason: string | null, status: AbsenceStatus, reviewNote: string | null, reviewedAt: string | null, createdAt: string } };

export type UsersQueryVariables = Exact<{
  filter?: UserFilterInput | null | undefined;
  page?: PageInput | null | undefined;
}>;


export type UsersQuery = { users: { total: number, page: number, limit: number, totalPages: number, items: Array<{ id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string }> } };

export type UserAccountFieldsFragment = { id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string };

export type UserQueryVariables = Exact<{
  id: string | number;
}>;


export type UserQuery = { user: { id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { createUser: { temporaryPassword: string, emailSent: boolean, user: { id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string } } };

export type UpdateUserMutationVariables = Exact<{
  id: string | number;
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { updateUser: { id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string } };

export type SetUserActiveMutationVariables = Exact<{
  id: string | number;
  active: boolean;
}>;


export type SetUserActiveMutation = { setUserActive: { id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string } };

export type ResetUserPasswordMutationVariables = Exact<{
  id: string | number;
}>;


export type ResetUserPasswordMutation = { resetUserPassword: { temporaryPassword: string, emailSent: boolean, user: { id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string } } };

export type UnlockUserMutationVariables = Exact<{
  id: string | number;
}>;


export type UnlockUserMutation = { unlockUser: { id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string } };

export type RevokeUserSessionsMutationVariables = Exact<{
  id: string | number;
}>;


export type RevokeUserSessionsMutation = { revokeUserSessions: { id: string, name: string, email: string, username: string, group: UserGroup, active: boolean, mustChangePassword: boolean, lockedUntil: string | null, locked: boolean, lastLoginAt: string | null, deactivatedAt: string | null, createdAt: string } };

export type UserPermissionsQueryVariables = Exact<{
  id: string | number;
}>;


export type UserPermissionsQuery = { userPermissions: { effective: Array<Permission>, defaults: Array<Permission>, overrides: Array<{ permission: Permission, allowed: boolean }> } };

export type SetUserPermissionsMutationVariables = Exact<{
  input: SetUserPermissionsInput;
}>;


export type SetUserPermissionsMutation = { setUserPermissions: { effective: Array<Permission>, defaults: Array<Permission>, overrides: Array<{ permission: Permission, allowed: boolean }> } };

export type AuditLogsQueryVariables = Exact<{
  filter?: AuditFilterInput | null | undefined;
  page?: PageInput | null | undefined;
}>;


export type AuditLogsQuery = { auditLogs: { total: number, page: number, limit: number, totalPages: number, items: Array<{ id: string, actorId: string | null, actorName: string | null, action: string, entity: string, entityId: string | null, before: Record<string, unknown> | null, after: Record<string, unknown> | null, ip: string | null, createdAt: string }> } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { accessToken: string, accessTokenExpiresAt: string, refreshToken: string, refreshTokenExpiresAt: string, user: { id: string, name: string, username: string, email: string, group: UserGroup, mustChangePassword: boolean, permissions: Array<Permission> } } };

export type RefreshSessionMutationVariables = Exact<{
  refreshToken: string;
}>;


export type RefreshSessionMutation = { refreshSessionTokens: { accessToken: string, accessTokenExpiresAt: string, refreshToken: string, refreshTokenExpiresAt: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, name: string, username: string, email: string, group: UserGroup, mustChangePassword: boolean, permissions: Array<Permission> } };

export type ChangeMyPasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangeMyPasswordMutation = { changeMyPassword: boolean };

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateMyProfileInput;
}>;


export type UpdateMyProfileMutation = { updateMyProfile: { id: string, name: string, username: string, email: string, group: UserGroup, mustChangePassword: boolean, permissions: Array<Permission> } };

export type RequestPasswordRecoveryMutationVariables = Exact<{
  login: string;
}>;


export type RequestPasswordRecoveryMutation = { requestPasswordRecovery: boolean };

export type VerifyPasswordRecoveryCodeMutationVariables = Exact<{
  input: VerifyRecoveryCodeInput;
}>;


export type VerifyPasswordRecoveryCodeMutation = { verifyPasswordRecoveryCode: string };

export type ResetPasswordWithRecoveryMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordWithRecoveryMutation = { resetPasswordWithRecovery: boolean };

export type BroadcastFieldsFragment = { id: string, title: string, body: string, audience: BroadcastAudience, section: Section | null, eventId: string | null, sendEmail: boolean, recipients: number, authorName: string | null, createdAt: string };

export type BroadcastsQueryVariables = Exact<{ [key: string]: never; }>;


export type BroadcastsQuery = { broadcasts: Array<{ id: string, title: string, body: string, audience: BroadcastAudience, section: Section | null, eventId: string | null, sendEmail: boolean, recipients: number, authorName: string | null, createdAt: string }> };

export type SendBroadcastMutationVariables = Exact<{
  input: BroadcastInput;
}>;


export type SendBroadcastMutation = { sendBroadcast: { id: string, title: string, body: string, audience: BroadcastAudience, section: Section | null, eventId: string | null, sendEmail: boolean, recipients: number, authorName: string | null, createdAt: string } };

export type BandDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type BandDashboardQuery = { bandDashboard: { activeMembers: number, awayMembers: number, upcomingEvents: number, eventsWithoutRoster: number, pendingAcks: number, swapRequests: number, pendingAbsences: number, absentToday: number, failedNotifications: number } };

export type EventFieldsFragment = { id: string, title: string, type: EventType, status: EventStatus, callTime: string | null, startsAt: string, endsAt: string | null, venueId: string | null, uniform: string | null, requester: string | null, documentRef: string | null, notes: string | null, cancellationReason: string | null, venue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } | null };

export type VenueFieldsFragment = { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean };

export type EventsQueryVariables = Exact<{
  filter?: EventFilterInput | null | undefined;
}>;


export type EventsQuery = { events: Array<{ id: string, title: string, type: EventType, status: EventStatus, callTime: string | null, startsAt: string, endsAt: string | null, venueId: string | null, uniform: string | null, requester: string | null, documentRef: string | null, notes: string | null, cancellationReason: string | null, venue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } | null }> };

export type UpcomingEventsQueryVariables = Exact<{
  limit: number;
}>;


export type UpcomingEventsQuery = { upcomingEvents: Array<{ id: string, title: string, type: EventType, status: EventStatus, callTime: string | null, startsAt: string, endsAt: string | null, venueId: string | null, uniform: string | null, requester: string | null, documentRef: string | null, notes: string | null, cancellationReason: string | null, venue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } | null }> };

export type EventQueryVariables = Exact<{
  id: string | number;
}>;


export type EventQuery = { event: { id: string, title: string, type: EventType, status: EventStatus, callTime: string | null, startsAt: string, endsAt: string | null, venueId: string | null, uniform: string | null, requester: string | null, documentRef: string | null, notes: string | null, cancellationReason: string | null, setlist: Array<{ position: number, songId: string, notes: string | null, song: { id: string, title: string, musicalKey: string | null, durationSeconds: number | null, archivedAt: string | null, media: Array<{ id: string, kind: MediaKind, title: string }> } | null }>, venue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } | null } };

export type CreateEventMutationVariables = Exact<{
  input: EventInput;
}>;


export type CreateEventMutation = { createEvent: { id: string, title: string, type: EventType, status: EventStatus, callTime: string | null, startsAt: string, endsAt: string | null, venueId: string | null, uniform: string | null, requester: string | null, documentRef: string | null, notes: string | null, cancellationReason: string | null, venue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } | null } };

export type UpdateEventMutationVariables = Exact<{
  id: string | number;
  input: EventInput;
}>;


export type UpdateEventMutation = { updateEvent: { id: string, title: string, type: EventType, status: EventStatus, callTime: string | null, startsAt: string, endsAt: string | null, venueId: string | null, uniform: string | null, requester: string | null, documentRef: string | null, notes: string | null, cancellationReason: string | null, venue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } | null } };

export type ChangeEventStatusMutationVariables = Exact<{
  id: string | number;
  status: EventStatus;
  reason?: string | null | undefined;
}>;


export type ChangeEventStatusMutation = { changeEventStatus: { id: string, title: string, type: EventType, status: EventStatus, callTime: string | null, startsAt: string, endsAt: string | null, venueId: string | null, uniform: string | null, requester: string | null, documentRef: string | null, notes: string | null, cancellationReason: string | null, venue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } | null } };

export type SetEventSetlistMutationVariables = Exact<{
  id: string | number;
  input: SetlistInput;
}>;


export type SetEventSetlistMutation = { setEventSetlist: Array<{ position: number, songId: string }> };

export type VenuesQueryVariables = Exact<{
  includeArchived: boolean;
}>;


export type VenuesQuery = { venues: Array<{ id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean }> };

export type CreateVenueMutationVariables = Exact<{
  input: VenueInput;
}>;


export type CreateVenueMutation = { createVenue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } };

export type UpdateVenueMutationVariables = Exact<{
  id: string | number;
  input: VenueInput;
}>;


export type UpdateVenueMutation = { updateVenue: { id: string, name: string, address: string | null, city: string, mapsUrl: string | null, notes: string | null, archived: boolean } };

export type MemberProfileFieldsFragment = { userId: string, warName: string, rank: Rank, registration: string | null, phone: string | null, section: Section, status: MemberStatus, notes: string | null, updatedAt: string, instruments: Array<{ instrumentId: string, name: string, primary: boolean }> };

export type RosterQueryVariables = Exact<{
  filter?: RosterFilterInput | null | undefined;
  page?: PageInput | null | undefined;
}>;


export type RosterQuery = { roster: { total: number, page: number, limit: number, totalPages: number, items: Array<{ userId: string, name: string, username: string, active: boolean, profile: { userId: string, warName: string, rank: Rank, registration: string | null, phone: string | null, section: Section, status: MemberStatus, notes: string | null, updatedAt: string, instruments: Array<{ instrumentId: string, name: string, primary: boolean }> } | null }> } };

export type MemberProfileQueryVariables = Exact<{
  userId: string | number;
}>;


export type MemberProfileQuery = { memberProfile: { userId: string, warName: string, rank: Rank, registration: string | null, phone: string | null, section: Section, status: MemberStatus, notes: string | null, updatedAt: string, instruments: Array<{ instrumentId: string, name: string, primary: boolean }> } | null };

export type MyMemberProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyMemberProfileQuery = { myMemberProfile: { userId: string, warName: string, rank: Rank, registration: string | null, phone: string | null, section: Section, status: MemberStatus, notes: string | null, updatedAt: string, instruments: Array<{ instrumentId: string, name: string, primary: boolean }> } | null };

export type SaveMemberProfileMutationVariables = Exact<{
  userId: string | number;
  input: MemberProfileInput;
}>;


export type SaveMemberProfileMutation = { saveMemberProfile: { userId: string, warName: string, rank: Rank, registration: string | null, phone: string | null, section: Section, status: MemberStatus, notes: string | null, updatedAt: string, instruments: Array<{ instrumentId: string, name: string, primary: boolean }> } };

export type InstrumentsQueryVariables = Exact<{
  includeArchived: boolean;
}>;


export type InstrumentsQuery = { instruments: Array<{ id: string, name: string, section: Section, archived: boolean }> };

export type CreateInstrumentMutationVariables = Exact<{
  input: CreateInstrumentInput;
}>;


export type CreateInstrumentMutation = { createInstrument: { id: string, name: string, section: Section, archived: boolean } };

export type UpdateInstrumentMutationVariables = Exact<{
  id: string | number;
  input: UpdateInstrumentInput;
}>;


export type UpdateInstrumentMutation = { updateInstrument: { id: string, name: string, section: Section, archived: boolean } };

export type MyNotificationsQueryVariables = Exact<{
  unreadOnly: boolean;
  page?: PageInput | null | undefined;
}>;


export type MyNotificationsQuery = { myNotifications: { total: number, page: number, totalPages: number, items: Array<{ id: string, type: NotificationType, title: string, body: string, link: string | null, readAt: string | null, createdAt: string }> } };

export type UnreadNotificationsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadNotificationsCountQuery = { unreadNotificationsCount: number };

export type MarkNotificationReadMutationVariables = Exact<{
  id: string | number;
}>;


export type MarkNotificationReadMutation = { markNotificationRead: boolean };

export type MarkAllNotificationsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsReadMutation = { markAllNotificationsRead: number };

export type NotificationPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationPreferencesQuery = { myNotificationPreferences: Array<{ type: NotificationType, emailEnabled: boolean }> };

export type SetNotificationPreferenceMutationVariables = Exact<{
  type: NotificationType;
  emailEnabled: boolean;
}>;


export type SetNotificationPreferenceMutation = { setNotificationPreference: { type: NotificationType, emailEnabled: boolean } };

export type PushPublicKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type PushPublicKeyQuery = { pushPublicKey: string | null };

export type SubscribePushMutationVariables = Exact<{
  input: PushSubscriptionInput;
}>;


export type SubscribePushMutation = { subscribePush: boolean };

export type UnsubscribePushMutationVariables = Exact<{
  endpoint: string;
}>;


export type UnsubscribePushMutation = { unsubscribePush: boolean };

export type SendTestPushMutationVariables = Exact<{ [key: string]: never; }>;


export type SendTestPushMutation = { sendTestPush: number };

export type SongFieldsFragment = { id: string, title: string, artist: string | null, arranger: string | null, category: SongCategory, musicalKey: string | null, bpm: number | null, durationSeconds: number | null, lyrics: string | null, notes: string | null, tags: Array<string>, archivedAt: string | null, createdAt: string, updatedAt: string };

export type MediaAssetFieldsFragment = { id: string, songId: string, kind: MediaKind, status: MediaStatus, title: string, mimeType: string | null, sizeBytes: number | null, durationSeconds: number | null, youtubeVideoId: string | null, thumbnailUrl: string | null, createdAt: string };

export type SongsQueryVariables = Exact<{
  filter?: SongFilterInput | null | undefined;
  page?: PageInput | null | undefined;
}>;


export type SongsQuery = { songTags: Array<string>, songs: { total: number, page: number, limit: number, totalPages: number, items: Array<{ id: string, title: string, artist: string | null, arranger: string | null, category: SongCategory, musicalKey: string | null, bpm: number | null, durationSeconds: number | null, lyrics: string | null, notes: string | null, tags: Array<string>, archivedAt: string | null, createdAt: string, updatedAt: string }> } };

export type SongQueryVariables = Exact<{
  id: string | number;
}>;


export type SongQuery = { song: { id: string, title: string, artist: string | null, arranger: string | null, category: SongCategory, musicalKey: string | null, bpm: number | null, durationSeconds: number | null, lyrics: string | null, notes: string | null, tags: Array<string>, archivedAt: string | null, createdAt: string, updatedAt: string, media: Array<{ id: string, songId: string, kind: MediaKind, status: MediaStatus, title: string, mimeType: string | null, sizeBytes: number | null, durationSeconds: number | null, youtubeVideoId: string | null, thumbnailUrl: string | null, createdAt: string }> } };

export type CreateSongMutationVariables = Exact<{
  input: SongInput;
}>;


export type CreateSongMutation = { createSong: { id: string, title: string, artist: string | null, arranger: string | null, category: SongCategory, musicalKey: string | null, bpm: number | null, durationSeconds: number | null, lyrics: string | null, notes: string | null, tags: Array<string>, archivedAt: string | null, createdAt: string, updatedAt: string } };

export type UpdateSongMutationVariables = Exact<{
  id: string | number;
  input: SongInput;
}>;


export type UpdateSongMutation = { updateSong: { id: string, title: string, artist: string | null, arranger: string | null, category: SongCategory, musicalKey: string | null, bpm: number | null, durationSeconds: number | null, lyrics: string | null, notes: string | null, tags: Array<string>, archivedAt: string | null, createdAt: string, updatedAt: string } };

export type SetSongArchivedMutationVariables = Exact<{
  id: string | number;
  archived: boolean;
}>;


export type SetSongArchivedMutation = { setSongArchived: { id: string, title: string, artist: string | null, arranger: string | null, category: SongCategory, musicalKey: string | null, bpm: number | null, durationSeconds: number | null, lyrics: string | null, notes: string | null, tags: Array<string>, archivedAt: string | null, createdAt: string, updatedAt: string } };

export type AddYoutubeVideoMutationVariables = Exact<{
  input: AddYoutubeVideoInput;
}>;


export type AddYoutubeVideoMutation = { addYoutubeVideo: { id: string, songId: string, kind: MediaKind, status: MediaStatus, title: string, mimeType: string | null, sizeBytes: number | null, durationSeconds: number | null, youtubeVideoId: string | null, thumbnailUrl: string | null, createdAt: string } };

export type RequestAudioUploadMutationVariables = Exact<{
  input: RequestAudioUploadInput;
}>;


export type RequestAudioUploadMutation = { requestAudioUpload: { asset: { id: string, songId: string, kind: MediaKind, status: MediaStatus, title: string, mimeType: string | null, sizeBytes: number | null, durationSeconds: number | null, youtubeVideoId: string | null, thumbnailUrl: string | null, createdAt: string }, upload: { url: string, fields: Record<string, unknown>, expiresAt: string } } };

export type ConfirmAudioUploadMutationVariables = Exact<{
  input: ConfirmAudioUploadInput;
}>;


export type ConfirmAudioUploadMutation = { confirmAudioUpload: { id: string, songId: string, kind: MediaKind, status: MediaStatus, title: string, mimeType: string | null, sizeBytes: number | null, durationSeconds: number | null, youtubeVideoId: string | null, thumbnailUrl: string | null, createdAt: string } };

export type RenameMediaMutationVariables = Exact<{
  id: string | number;
  title: string;
}>;


export type RenameMediaMutation = { renameMedia: { id: string, songId: string, kind: MediaKind, status: MediaStatus, title: string, mimeType: string | null, sizeBytes: number | null, durationSeconds: number | null, youtubeVideoId: string | null, thumbnailUrl: string | null, createdAt: string } };

export type RemoveMediaMutationVariables = Exact<{
  id: string | number;
}>;


export type RemoveMediaMutation = { removeMedia: boolean };

export type AudioPlaybackUrlQueryVariables = Exact<{
  assetId: string | number;
}>;


export type AudioPlaybackUrlQuery = { audioPlaybackUrl: string };

export type AudioDownloadUrlQueryVariables = Exact<{
  assetId: string | number;
}>;


export type AudioDownloadUrlQuery = { audioDownloadUrl: string };

export type AssignmentFieldsFragment = { userId: string, role: AssignmentRole, instrumentId: string | null, instrumentName: string | null, notes: string | null, overrideReason: string | null, ackStatus: AckStatus, ackNote: string | null, ackAt: string | null, person: { name: string, warName: string, rank: Rank, section: Section } | null };

export type RosterFieldsFragment = { eventId: string, status: RosterStatus, version: number, publishedAt: string | null, uncoveredSections: Array<Section>, assignments: Array<{ userId: string, role: AssignmentRole, instrumentId: string | null, instrumentName: string | null, notes: string | null, overrideReason: string | null, ackStatus: AckStatus, ackNote: string | null, ackAt: string | null, person: { name: string, warName: string, rank: Rank, section: Section } | null }> };

export type EventRosterQueryVariables = Exact<{
  eventId: string | number;
}>;


export type EventRosterQuery = { eventRoster: { eventId: string, status: RosterStatus, version: number, publishedAt: string | null, uncoveredSections: Array<Section>, assignments: Array<{ userId: string, role: AssignmentRole, instrumentId: string | null, instrumentName: string | null, notes: string | null, overrideReason: string | null, ackStatus: AckStatus, ackNote: string | null, ackAt: string | null, person: { name: string, warName: string, rank: Rank, section: Section } | null }> } | null };

export type RosterCandidatesQueryVariables = Exact<{
  eventId: string | number;
}>;


export type RosterCandidatesQuery = { rosterCandidates: Array<{ userId: string, name: string, warName: string, rank: Rank, section: Section, memberStatus: MemberStatus, blocker: CandidateBlocker | null, instruments: Array<{ instrumentId: string, name: string, primary: boolean }>, absence: { type: AbsenceType, startsOn: string, endsOn: string } | null, busyWith: Array<{ eventId: string, title: string }> }> };

export type MyAssignmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAssignmentsQuery = { myAssignments: Array<{ eventId: string, role: AssignmentRole, instrumentId: string | null, instrumentName: string | null, ackStatus: AckStatus, ackNote: string | null, event: { id: string, title: string, type: EventType, status: EventStatus, callTime: string | null, startsAt: string, endsAt: string | null, venue: { id: string, name: string } | null } | null }> };

export type SaveRosterMutationVariables = Exact<{
  eventId: string | number;
  input: RosterInput;
}>;


export type SaveRosterMutation = { saveRoster: { eventId: string, status: RosterStatus, version: number, publishedAt: string | null, uncoveredSections: Array<Section>, assignments: Array<{ userId: string, role: AssignmentRole, instrumentId: string | null, instrumentName: string | null, notes: string | null, overrideReason: string | null, ackStatus: AckStatus, ackNote: string | null, ackAt: string | null, person: { name: string, warName: string, rank: Rank, section: Section } | null }> } };

export type PublishRosterMutationVariables = Exact<{
  eventId: string | number;
}>;


export type PublishRosterMutation = { publishRoster: { eventId: string, status: RosterStatus, version: number, publishedAt: string | null, uncoveredSections: Array<Section>, assignments: Array<{ userId: string, role: AssignmentRole, instrumentId: string | null, instrumentName: string | null, notes: string | null, overrideReason: string | null, ackStatus: AckStatus, ackNote: string | null, ackAt: string | null, person: { name: string, warName: string, rank: Rank, section: Section } | null }> } };

export type AcknowledgeRosterMutationVariables = Exact<{
  eventId: string | number;
  answer: AckAnswer;
  note?: string | null | undefined;
}>;


export type AcknowledgeRosterMutation = { acknowledgeRoster: { ackStatus: AckStatus, ackNote: string | null } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const AbsenceFieldsFragmentDoc = new TypedDocumentString(`
    fragment AbsenceFields on Absence {
  id
  userId
  userName
  warName
  type
  startsOn
  endsOn
  reason
  status
  reviewNote
  reviewedAt
  createdAt
}
    `, {"fragmentName":"AbsenceFields"}) as unknown as TypedDocumentString<AbsenceFieldsFragment, unknown>;
export const UserAccountFieldsFragmentDoc = new TypedDocumentString(`
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}
    `, {"fragmentName":"UserAccountFields"}) as unknown as TypedDocumentString<UserAccountFieldsFragment, unknown>;
export const BroadcastFieldsFragmentDoc = new TypedDocumentString(`
    fragment BroadcastFields on Broadcast {
  id
  title
  body
  audience
  section
  eventId
  sendEmail
  recipients
  authorName
  createdAt
}
    `, {"fragmentName":"BroadcastFields"}) as unknown as TypedDocumentString<BroadcastFieldsFragment, unknown>;
export const VenueFieldsFragmentDoc = new TypedDocumentString(`
    fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}
    `, {"fragmentName":"VenueFields"}) as unknown as TypedDocumentString<VenueFieldsFragment, unknown>;
export const EventFieldsFragmentDoc = new TypedDocumentString(`
    fragment EventFields on Event {
  id
  title
  type
  status
  callTime
  startsAt
  endsAt
  venueId
  uniform
  requester
  documentRef
  notes
  cancellationReason
  venue {
    ...VenueFields
  }
}
    fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`, {"fragmentName":"EventFields"}) as unknown as TypedDocumentString<EventFieldsFragment, unknown>;
export const MemberProfileFieldsFragmentDoc = new TypedDocumentString(`
    fragment MemberProfileFields on MemberProfile {
  userId
  warName
  rank
  registration
  phone
  section
  status
  notes
  updatedAt
  instruments {
    instrumentId
    name
    primary
  }
}
    `, {"fragmentName":"MemberProfileFields"}) as unknown as TypedDocumentString<MemberProfileFieldsFragment, unknown>;
export const SongFieldsFragmentDoc = new TypedDocumentString(`
    fragment SongFields on Song {
  id
  title
  artist
  arranger
  category
  musicalKey
  bpm
  durationSeconds
  lyrics
  notes
  tags
  archivedAt
  createdAt
  updatedAt
}
    `, {"fragmentName":"SongFields"}) as unknown as TypedDocumentString<SongFieldsFragment, unknown>;
export const MediaAssetFieldsFragmentDoc = new TypedDocumentString(`
    fragment MediaAssetFields on MediaAsset {
  id
  songId
  kind
  status
  title
  mimeType
  sizeBytes
  durationSeconds
  youtubeVideoId
  thumbnailUrl
  createdAt
}
    `, {"fragmentName":"MediaAssetFields"}) as unknown as TypedDocumentString<MediaAssetFieldsFragment, unknown>;
export const AssignmentFieldsFragmentDoc = new TypedDocumentString(`
    fragment AssignmentFields on Assignment {
  userId
  role
  instrumentId
  instrumentName
  notes
  overrideReason
  ackStatus
  ackNote
  ackAt
  person {
    name
    warName
    rank
    section
  }
}
    `, {"fragmentName":"AssignmentFields"}) as unknown as TypedDocumentString<AssignmentFieldsFragment, unknown>;
export const RosterFieldsFragmentDoc = new TypedDocumentString(`
    fragment RosterFields on Roster {
  eventId
  status
  version
  publishedAt
  uncoveredSections
  assignments {
    ...AssignmentFields
  }
}
    fragment AssignmentFields on Assignment {
  userId
  role
  instrumentId
  instrumentName
  notes
  overrideReason
  ackStatus
  ackNote
  ackAt
  person {
    name
    warName
    rank
    section
  }
}`, {"fragmentName":"RosterFields"}) as unknown as TypedDocumentString<RosterFieldsFragment, unknown>;
export const MyAbsencesDocument = new TypedDocumentString(`
    query MyAbsences {
  myAbsences {
    ...AbsenceFields
  }
}
    fragment AbsenceFields on Absence {
  id
  userId
  userName
  warName
  type
  startsOn
  endsOn
  reason
  status
  reviewNote
  reviewedAt
  createdAt
}`) as unknown as TypedDocumentString<MyAbsencesQuery, MyAbsencesQueryVariables>;
export const AbsencesDocument = new TypedDocumentString(`
    query Absences($filter: AbsenceFilterInput) {
  absences(filter: $filter) {
    ...AbsenceFields
  }
}
    fragment AbsenceFields on Absence {
  id
  userId
  userName
  warName
  type
  startsOn
  endsOn
  reason
  status
  reviewNote
  reviewedAt
  createdAt
}`) as unknown as TypedDocumentString<AbsencesQuery, AbsencesQueryVariables>;
export const RequestAbsenceDocument = new TypedDocumentString(`
    mutation RequestAbsence($input: AbsenceInput!) {
  requestAbsence(input: $input) {
    ...AbsenceFields
  }
}
    fragment AbsenceFields on Absence {
  id
  userId
  userName
  warName
  type
  startsOn
  endsOn
  reason
  status
  reviewNote
  reviewedAt
  createdAt
}`) as unknown as TypedDocumentString<RequestAbsenceMutation, RequestAbsenceMutationVariables>;
export const RegisterAbsenceDocument = new TypedDocumentString(`
    mutation RegisterAbsence($userId: ID!, $input: AbsenceInput!) {
  registerAbsence(userId: $userId, input: $input) {
    ...AbsenceFields
  }
}
    fragment AbsenceFields on Absence {
  id
  userId
  userName
  warName
  type
  startsOn
  endsOn
  reason
  status
  reviewNote
  reviewedAt
  createdAt
}`) as unknown as TypedDocumentString<RegisterAbsenceMutation, RegisterAbsenceMutationVariables>;
export const ReviewAbsenceDocument = new TypedDocumentString(`
    mutation ReviewAbsence($id: ID!, $approve: Boolean!, $note: String) {
  reviewAbsence(id: $id, approve: $approve, note: $note) {
    ...AbsenceFields
  }
}
    fragment AbsenceFields on Absence {
  id
  userId
  userName
  warName
  type
  startsOn
  endsOn
  reason
  status
  reviewNote
  reviewedAt
  createdAt
}`) as unknown as TypedDocumentString<ReviewAbsenceMutation, ReviewAbsenceMutationVariables>;
export const CancelAbsenceDocument = new TypedDocumentString(`
    mutation CancelAbsence($id: ID!) {
  cancelAbsence(id: $id) {
    ...AbsenceFields
  }
}
    fragment AbsenceFields on Absence {
  id
  userId
  userName
  warName
  type
  startsOn
  endsOn
  reason
  status
  reviewNote
  reviewedAt
  createdAt
}`) as unknown as TypedDocumentString<CancelAbsenceMutation, CancelAbsenceMutationVariables>;
export const UsersDocument = new TypedDocumentString(`
    query Users($filter: UserFilterInput, $page: PageInput) {
  users(filter: $filter, page: $page) {
    total
    page
    limit
    totalPages
    items {
      ...UserAccountFields
    }
  }
}
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}`) as unknown as TypedDocumentString<UsersQuery, UsersQueryVariables>;
export const UserDocument = new TypedDocumentString(`
    query User($id: ID!) {
  user(id: $id) {
    ...UserAccountFields
  }
}
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}`) as unknown as TypedDocumentString<UserQuery, UserQueryVariables>;
export const CreateUserDocument = new TypedDocumentString(`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    temporaryPassword
    emailSent
    user {
      ...UserAccountFields
    }
  }
}
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}`) as unknown as TypedDocumentString<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = new TypedDocumentString(`
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    ...UserAccountFields
  }
}
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}`) as unknown as TypedDocumentString<UpdateUserMutation, UpdateUserMutationVariables>;
export const SetUserActiveDocument = new TypedDocumentString(`
    mutation SetUserActive($id: ID!, $active: Boolean!) {
  setUserActive(id: $id, active: $active) {
    ...UserAccountFields
  }
}
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}`) as unknown as TypedDocumentString<SetUserActiveMutation, SetUserActiveMutationVariables>;
export const ResetUserPasswordDocument = new TypedDocumentString(`
    mutation ResetUserPassword($id: ID!) {
  resetUserPassword(id: $id) {
    temporaryPassword
    emailSent
    user {
      ...UserAccountFields
    }
  }
}
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}`) as unknown as TypedDocumentString<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>;
export const UnlockUserDocument = new TypedDocumentString(`
    mutation UnlockUser($id: ID!) {
  unlockUser(id: $id) {
    ...UserAccountFields
  }
}
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}`) as unknown as TypedDocumentString<UnlockUserMutation, UnlockUserMutationVariables>;
export const RevokeUserSessionsDocument = new TypedDocumentString(`
    mutation RevokeUserSessions($id: ID!) {
  revokeUserSessions(id: $id) {
    ...UserAccountFields
  }
}
    fragment UserAccountFields on UserAccount {
  id
  name
  email
  username
  group
  active
  mustChangePassword
  lockedUntil
  locked
  lastLoginAt
  deactivatedAt
  createdAt
}`) as unknown as TypedDocumentString<RevokeUserSessionsMutation, RevokeUserSessionsMutationVariables>;
export const UserPermissionsDocument = new TypedDocumentString(`
    query UserPermissions($id: ID!) {
  userPermissions(id: $id) {
    effective
    defaults
    overrides {
      permission
      allowed
    }
  }
}
    `) as unknown as TypedDocumentString<UserPermissionsQuery, UserPermissionsQueryVariables>;
export const SetUserPermissionsDocument = new TypedDocumentString(`
    mutation SetUserPermissions($input: SetUserPermissionsInput!) {
  setUserPermissions(input: $input) {
    effective
    defaults
    overrides {
      permission
      allowed
    }
  }
}
    `) as unknown as TypedDocumentString<SetUserPermissionsMutation, SetUserPermissionsMutationVariables>;
export const AuditLogsDocument = new TypedDocumentString(`
    query AuditLogs($filter: AuditFilterInput, $page: PageInput) {
  auditLogs(filter: $filter, page: $page) {
    total
    page
    limit
    totalPages
    items {
      id
      actorId
      actorName
      action
      entity
      entityId
      before
      after
      ip
      createdAt
    }
  }
}
    `) as unknown as TypedDocumentString<AuditLogsQuery, AuditLogsQueryVariables>;
export const LoginDocument = new TypedDocumentString(`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    accessTokenExpiresAt
    refreshToken
    refreshTokenExpiresAt
    user {
      id
      name
      username
      email
      group
      mustChangePassword
      permissions
    }
  }
}
    `) as unknown as TypedDocumentString<LoginMutation, LoginMutationVariables>;
export const RefreshSessionDocument = new TypedDocumentString(`
    mutation RefreshSession($refreshToken: String!) {
  refreshSessionTokens(refreshToken: $refreshToken) {
    accessToken
    accessTokenExpiresAt
    refreshToken
    refreshTokenExpiresAt
  }
}
    `) as unknown as TypedDocumentString<RefreshSessionMutation, RefreshSessionMutationVariables>;
export const LogoutDocument = new TypedDocumentString(`
    mutation Logout {
  logout
}
    `) as unknown as TypedDocumentString<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    id
    name
    username
    email
    group
    mustChangePassword
    permissions
  }
}
    `) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const ChangeMyPasswordDocument = new TypedDocumentString(`
    mutation ChangeMyPassword($input: ChangePasswordInput!) {
  changeMyPassword(input: $input)
}
    `) as unknown as TypedDocumentString<ChangeMyPasswordMutation, ChangeMyPasswordMutationVariables>;
export const UpdateMyProfileDocument = new TypedDocumentString(`
    mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
  updateMyProfile(input: $input) {
    id
    name
    username
    email
    group
    mustChangePassword
    permissions
  }
}
    `) as unknown as TypedDocumentString<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export const RequestPasswordRecoveryDocument = new TypedDocumentString(`
    mutation RequestPasswordRecovery($login: String!) {
  requestPasswordRecovery(login: $login)
}
    `) as unknown as TypedDocumentString<RequestPasswordRecoveryMutation, RequestPasswordRecoveryMutationVariables>;
export const VerifyPasswordRecoveryCodeDocument = new TypedDocumentString(`
    mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {
  verifyPasswordRecoveryCode(input: $input)
}
    `) as unknown as TypedDocumentString<VerifyPasswordRecoveryCodeMutation, VerifyPasswordRecoveryCodeMutationVariables>;
export const ResetPasswordWithRecoveryDocument = new TypedDocumentString(`
    mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {
  resetPasswordWithRecovery(input: $input)
}
    `) as unknown as TypedDocumentString<ResetPasswordWithRecoveryMutation, ResetPasswordWithRecoveryMutationVariables>;
export const BroadcastsDocument = new TypedDocumentString(`
    query Broadcasts {
  broadcasts {
    ...BroadcastFields
  }
}
    fragment BroadcastFields on Broadcast {
  id
  title
  body
  audience
  section
  eventId
  sendEmail
  recipients
  authorName
  createdAt
}`) as unknown as TypedDocumentString<BroadcastsQuery, BroadcastsQueryVariables>;
export const SendBroadcastDocument = new TypedDocumentString(`
    mutation SendBroadcast($input: BroadcastInput!) {
  sendBroadcast(input: $input) {
    ...BroadcastFields
  }
}
    fragment BroadcastFields on Broadcast {
  id
  title
  body
  audience
  section
  eventId
  sendEmail
  recipients
  authorName
  createdAt
}`) as unknown as TypedDocumentString<SendBroadcastMutation, SendBroadcastMutationVariables>;
export const BandDashboardDocument = new TypedDocumentString(`
    query BandDashboard {
  bandDashboard {
    activeMembers
    awayMembers
    upcomingEvents
    eventsWithoutRoster
    pendingAcks
    swapRequests
    pendingAbsences
    absentToday
    failedNotifications
  }
}
    `) as unknown as TypedDocumentString<BandDashboardQuery, BandDashboardQueryVariables>;
export const EventsDocument = new TypedDocumentString(`
    query Events($filter: EventFilterInput) {
  events(filter: $filter) {
    ...EventFields
  }
}
    fragment EventFields on Event {
  id
  title
  type
  status
  callTime
  startsAt
  endsAt
  venueId
  uniform
  requester
  documentRef
  notes
  cancellationReason
  venue {
    ...VenueFields
  }
}
fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<EventsQuery, EventsQueryVariables>;
export const UpcomingEventsDocument = new TypedDocumentString(`
    query UpcomingEvents($limit: Int!) {
  upcomingEvents(limit: $limit) {
    ...EventFields
  }
}
    fragment EventFields on Event {
  id
  title
  type
  status
  callTime
  startsAt
  endsAt
  venueId
  uniform
  requester
  documentRef
  notes
  cancellationReason
  venue {
    ...VenueFields
  }
}
fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<UpcomingEventsQuery, UpcomingEventsQueryVariables>;
export const EventDocument = new TypedDocumentString(`
    query Event($id: ID!) {
  event(id: $id) {
    ...EventFields
    setlist {
      position
      songId
      notes
      song {
        id
        title
        musicalKey
        durationSeconds
        archivedAt
        media {
          id
          kind
          title
        }
      }
    }
  }
}
    fragment EventFields on Event {
  id
  title
  type
  status
  callTime
  startsAt
  endsAt
  venueId
  uniform
  requester
  documentRef
  notes
  cancellationReason
  venue {
    ...VenueFields
  }
}
fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<EventQuery, EventQueryVariables>;
export const CreateEventDocument = new TypedDocumentString(`
    mutation CreateEvent($input: EventInput!) {
  createEvent(input: $input) {
    ...EventFields
  }
}
    fragment EventFields on Event {
  id
  title
  type
  status
  callTime
  startsAt
  endsAt
  venueId
  uniform
  requester
  documentRef
  notes
  cancellationReason
  venue {
    ...VenueFields
  }
}
fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<CreateEventMutation, CreateEventMutationVariables>;
export const UpdateEventDocument = new TypedDocumentString(`
    mutation UpdateEvent($id: ID!, $input: EventInput!) {
  updateEvent(id: $id, input: $input) {
    ...EventFields
  }
}
    fragment EventFields on Event {
  id
  title
  type
  status
  callTime
  startsAt
  endsAt
  venueId
  uniform
  requester
  documentRef
  notes
  cancellationReason
  venue {
    ...VenueFields
  }
}
fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<UpdateEventMutation, UpdateEventMutationVariables>;
export const ChangeEventStatusDocument = new TypedDocumentString(`
    mutation ChangeEventStatus($id: ID!, $status: EventStatus!, $reason: String) {
  changeEventStatus(id: $id, status: $status, reason: $reason) {
    ...EventFields
  }
}
    fragment EventFields on Event {
  id
  title
  type
  status
  callTime
  startsAt
  endsAt
  venueId
  uniform
  requester
  documentRef
  notes
  cancellationReason
  venue {
    ...VenueFields
  }
}
fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<ChangeEventStatusMutation, ChangeEventStatusMutationVariables>;
export const SetEventSetlistDocument = new TypedDocumentString(`
    mutation SetEventSetlist($id: ID!, $input: SetlistInput!) {
  setEventSetlist(id: $id, input: $input) {
    position
    songId
  }
}
    `) as unknown as TypedDocumentString<SetEventSetlistMutation, SetEventSetlistMutationVariables>;
export const VenuesDocument = new TypedDocumentString(`
    query Venues($includeArchived: Boolean!) {
  venues(includeArchived: $includeArchived) {
    ...VenueFields
  }
}
    fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<VenuesQuery, VenuesQueryVariables>;
export const CreateVenueDocument = new TypedDocumentString(`
    mutation CreateVenue($input: VenueInput!) {
  createVenue(input: $input) {
    ...VenueFields
  }
}
    fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<CreateVenueMutation, CreateVenueMutationVariables>;
export const UpdateVenueDocument = new TypedDocumentString(`
    mutation UpdateVenue($id: ID!, $input: VenueInput!) {
  updateVenue(id: $id, input: $input) {
    ...VenueFields
  }
}
    fragment VenueFields on Venue {
  id
  name
  address
  city
  mapsUrl
  notes
  archived
}`) as unknown as TypedDocumentString<UpdateVenueMutation, UpdateVenueMutationVariables>;
export const RosterDocument = new TypedDocumentString(`
    query Roster($filter: RosterFilterInput, $page: PageInput) {
  roster(filter: $filter, page: $page) {
    total
    page
    limit
    totalPages
    items {
      userId
      name
      username
      active
      profile {
        ...MemberProfileFields
      }
    }
  }
}
    fragment MemberProfileFields on MemberProfile {
  userId
  warName
  rank
  registration
  phone
  section
  status
  notes
  updatedAt
  instruments {
    instrumentId
    name
    primary
  }
}`) as unknown as TypedDocumentString<RosterQuery, RosterQueryVariables>;
export const MemberProfileDocument = new TypedDocumentString(`
    query MemberProfile($userId: ID!) {
  memberProfile(userId: $userId) {
    ...MemberProfileFields
  }
}
    fragment MemberProfileFields on MemberProfile {
  userId
  warName
  rank
  registration
  phone
  section
  status
  notes
  updatedAt
  instruments {
    instrumentId
    name
    primary
  }
}`) as unknown as TypedDocumentString<MemberProfileQuery, MemberProfileQueryVariables>;
export const MyMemberProfileDocument = new TypedDocumentString(`
    query MyMemberProfile {
  myMemberProfile {
    ...MemberProfileFields
  }
}
    fragment MemberProfileFields on MemberProfile {
  userId
  warName
  rank
  registration
  phone
  section
  status
  notes
  updatedAt
  instruments {
    instrumentId
    name
    primary
  }
}`) as unknown as TypedDocumentString<MyMemberProfileQuery, MyMemberProfileQueryVariables>;
export const SaveMemberProfileDocument = new TypedDocumentString(`
    mutation SaveMemberProfile($userId: ID!, $input: MemberProfileInput!) {
  saveMemberProfile(userId: $userId, input: $input) {
    ...MemberProfileFields
  }
}
    fragment MemberProfileFields on MemberProfile {
  userId
  warName
  rank
  registration
  phone
  section
  status
  notes
  updatedAt
  instruments {
    instrumentId
    name
    primary
  }
}`) as unknown as TypedDocumentString<SaveMemberProfileMutation, SaveMemberProfileMutationVariables>;
export const InstrumentsDocument = new TypedDocumentString(`
    query Instruments($includeArchived: Boolean!) {
  instruments(includeArchived: $includeArchived) {
    id
    name
    section
    archived
  }
}
    `) as unknown as TypedDocumentString<InstrumentsQuery, InstrumentsQueryVariables>;
export const CreateInstrumentDocument = new TypedDocumentString(`
    mutation CreateInstrument($input: CreateInstrumentInput!) {
  createInstrument(input: $input) {
    id
    name
    section
    archived
  }
}
    `) as unknown as TypedDocumentString<CreateInstrumentMutation, CreateInstrumentMutationVariables>;
export const UpdateInstrumentDocument = new TypedDocumentString(`
    mutation UpdateInstrument($id: ID!, $input: UpdateInstrumentInput!) {
  updateInstrument(id: $id, input: $input) {
    id
    name
    section
    archived
  }
}
    `) as unknown as TypedDocumentString<UpdateInstrumentMutation, UpdateInstrumentMutationVariables>;
export const MyNotificationsDocument = new TypedDocumentString(`
    query MyNotifications($unreadOnly: Boolean!, $page: PageInput) {
  myNotifications(unreadOnly: $unreadOnly, page: $page) {
    items {
      id
      type
      title
      body
      link
      readAt
      createdAt
    }
    total
    page
    totalPages
  }
}
    `) as unknown as TypedDocumentString<MyNotificationsQuery, MyNotificationsQueryVariables>;
export const UnreadNotificationsCountDocument = new TypedDocumentString(`
    query UnreadNotificationsCount {
  unreadNotificationsCount
}
    `) as unknown as TypedDocumentString<UnreadNotificationsCountQuery, UnreadNotificationsCountQueryVariables>;
export const MarkNotificationReadDocument = new TypedDocumentString(`
    mutation MarkNotificationRead($id: ID!) {
  markNotificationRead(id: $id)
}
    `) as unknown as TypedDocumentString<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export const MarkAllNotificationsReadDocument = new TypedDocumentString(`
    mutation MarkAllNotificationsRead {
  markAllNotificationsRead
}
    `) as unknown as TypedDocumentString<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;
export const NotificationPreferencesDocument = new TypedDocumentString(`
    query NotificationPreferences {
  myNotificationPreferences {
    type
    emailEnabled
  }
}
    `) as unknown as TypedDocumentString<NotificationPreferencesQuery, NotificationPreferencesQueryVariables>;
export const SetNotificationPreferenceDocument = new TypedDocumentString(`
    mutation SetNotificationPreference($type: NotificationType!, $emailEnabled: Boolean!) {
  setNotificationPreference(type: $type, emailEnabled: $emailEnabled) {
    type
    emailEnabled
  }
}
    `) as unknown as TypedDocumentString<SetNotificationPreferenceMutation, SetNotificationPreferenceMutationVariables>;
export const PushPublicKeyDocument = new TypedDocumentString(`
    query PushPublicKey {
  pushPublicKey
}
    `) as unknown as TypedDocumentString<PushPublicKeyQuery, PushPublicKeyQueryVariables>;
export const SubscribePushDocument = new TypedDocumentString(`
    mutation SubscribePush($input: PushSubscriptionInput!) {
  subscribePush(input: $input)
}
    `) as unknown as TypedDocumentString<SubscribePushMutation, SubscribePushMutationVariables>;
export const UnsubscribePushDocument = new TypedDocumentString(`
    mutation UnsubscribePush($endpoint: String!) {
  unsubscribePush(endpoint: $endpoint)
}
    `) as unknown as TypedDocumentString<UnsubscribePushMutation, UnsubscribePushMutationVariables>;
export const SendTestPushDocument = new TypedDocumentString(`
    mutation SendTestPush {
  sendTestPush
}
    `) as unknown as TypedDocumentString<SendTestPushMutation, SendTestPushMutationVariables>;
export const SongsDocument = new TypedDocumentString(`
    query Songs($filter: SongFilterInput, $page: PageInput) {
  songs(filter: $filter, page: $page) {
    total
    page
    limit
    totalPages
    items {
      ...SongFields
    }
  }
  songTags
}
    fragment SongFields on Song {
  id
  title
  artist
  arranger
  category
  musicalKey
  bpm
  durationSeconds
  lyrics
  notes
  tags
  archivedAt
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<SongsQuery, SongsQueryVariables>;
export const SongDocument = new TypedDocumentString(`
    query Song($id: ID!) {
  song(id: $id) {
    ...SongFields
    media {
      ...MediaAssetFields
    }
  }
}
    fragment SongFields on Song {
  id
  title
  artist
  arranger
  category
  musicalKey
  bpm
  durationSeconds
  lyrics
  notes
  tags
  archivedAt
  createdAt
  updatedAt
}
fragment MediaAssetFields on MediaAsset {
  id
  songId
  kind
  status
  title
  mimeType
  sizeBytes
  durationSeconds
  youtubeVideoId
  thumbnailUrl
  createdAt
}`) as unknown as TypedDocumentString<SongQuery, SongQueryVariables>;
export const CreateSongDocument = new TypedDocumentString(`
    mutation CreateSong($input: SongInput!) {
  createSong(input: $input) {
    ...SongFields
  }
}
    fragment SongFields on Song {
  id
  title
  artist
  arranger
  category
  musicalKey
  bpm
  durationSeconds
  lyrics
  notes
  tags
  archivedAt
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<CreateSongMutation, CreateSongMutationVariables>;
export const UpdateSongDocument = new TypedDocumentString(`
    mutation UpdateSong($id: ID!, $input: SongInput!) {
  updateSong(id: $id, input: $input) {
    ...SongFields
  }
}
    fragment SongFields on Song {
  id
  title
  artist
  arranger
  category
  musicalKey
  bpm
  durationSeconds
  lyrics
  notes
  tags
  archivedAt
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<UpdateSongMutation, UpdateSongMutationVariables>;
export const SetSongArchivedDocument = new TypedDocumentString(`
    mutation SetSongArchived($id: ID!, $archived: Boolean!) {
  setSongArchived(id: $id, archived: $archived) {
    ...SongFields
  }
}
    fragment SongFields on Song {
  id
  title
  artist
  arranger
  category
  musicalKey
  bpm
  durationSeconds
  lyrics
  notes
  tags
  archivedAt
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<SetSongArchivedMutation, SetSongArchivedMutationVariables>;
export const AddYoutubeVideoDocument = new TypedDocumentString(`
    mutation AddYoutubeVideo($input: AddYoutubeVideoInput!) {
  addYoutubeVideo(input: $input) {
    ...MediaAssetFields
  }
}
    fragment MediaAssetFields on MediaAsset {
  id
  songId
  kind
  status
  title
  mimeType
  sizeBytes
  durationSeconds
  youtubeVideoId
  thumbnailUrl
  createdAt
}`) as unknown as TypedDocumentString<AddYoutubeVideoMutation, AddYoutubeVideoMutationVariables>;
export const RequestAudioUploadDocument = new TypedDocumentString(`
    mutation RequestAudioUpload($input: RequestAudioUploadInput!) {
  requestAudioUpload(input: $input) {
    asset {
      ...MediaAssetFields
    }
    upload {
      url
      fields
      expiresAt
    }
  }
}
    fragment MediaAssetFields on MediaAsset {
  id
  songId
  kind
  status
  title
  mimeType
  sizeBytes
  durationSeconds
  youtubeVideoId
  thumbnailUrl
  createdAt
}`) as unknown as TypedDocumentString<RequestAudioUploadMutation, RequestAudioUploadMutationVariables>;
export const ConfirmAudioUploadDocument = new TypedDocumentString(`
    mutation ConfirmAudioUpload($input: ConfirmAudioUploadInput!) {
  confirmAudioUpload(input: $input) {
    ...MediaAssetFields
  }
}
    fragment MediaAssetFields on MediaAsset {
  id
  songId
  kind
  status
  title
  mimeType
  sizeBytes
  durationSeconds
  youtubeVideoId
  thumbnailUrl
  createdAt
}`) as unknown as TypedDocumentString<ConfirmAudioUploadMutation, ConfirmAudioUploadMutationVariables>;
export const RenameMediaDocument = new TypedDocumentString(`
    mutation RenameMedia($id: ID!, $title: String!) {
  renameMedia(id: $id, title: $title) {
    ...MediaAssetFields
  }
}
    fragment MediaAssetFields on MediaAsset {
  id
  songId
  kind
  status
  title
  mimeType
  sizeBytes
  durationSeconds
  youtubeVideoId
  thumbnailUrl
  createdAt
}`) as unknown as TypedDocumentString<RenameMediaMutation, RenameMediaMutationVariables>;
export const RemoveMediaDocument = new TypedDocumentString(`
    mutation RemoveMedia($id: ID!) {
  removeMedia(id: $id)
}
    `) as unknown as TypedDocumentString<RemoveMediaMutation, RemoveMediaMutationVariables>;
export const AudioPlaybackUrlDocument = new TypedDocumentString(`
    query AudioPlaybackUrl($assetId: ID!) {
  audioPlaybackUrl(assetId: $assetId)
}
    `) as unknown as TypedDocumentString<AudioPlaybackUrlQuery, AudioPlaybackUrlQueryVariables>;
export const AudioDownloadUrlDocument = new TypedDocumentString(`
    query AudioDownloadUrl($assetId: ID!) {
  audioDownloadUrl(assetId: $assetId)
}
    `) as unknown as TypedDocumentString<AudioDownloadUrlQuery, AudioDownloadUrlQueryVariables>;
export const EventRosterDocument = new TypedDocumentString(`
    query EventRoster($eventId: ID!) {
  eventRoster(eventId: $eventId) {
    ...RosterFields
  }
}
    fragment AssignmentFields on Assignment {
  userId
  role
  instrumentId
  instrumentName
  notes
  overrideReason
  ackStatus
  ackNote
  ackAt
  person {
    name
    warName
    rank
    section
  }
}
fragment RosterFields on Roster {
  eventId
  status
  version
  publishedAt
  uncoveredSections
  assignments {
    ...AssignmentFields
  }
}`) as unknown as TypedDocumentString<EventRosterQuery, EventRosterQueryVariables>;
export const RosterCandidatesDocument = new TypedDocumentString(`
    query RosterCandidates($eventId: ID!) {
  rosterCandidates(eventId: $eventId) {
    userId
    name
    warName
    rank
    section
    memberStatus
    instruments {
      instrumentId
      name
      primary
    }
    blocker
    absence {
      type
      startsOn
      endsOn
    }
    busyWith {
      eventId
      title
    }
  }
}
    `) as unknown as TypedDocumentString<RosterCandidatesQuery, RosterCandidatesQueryVariables>;
export const MyAssignmentsDocument = new TypedDocumentString(`
    query MyAssignments {
  myAssignments {
    eventId
    role
    instrumentId
    instrumentName
    ackStatus
    ackNote
    event {
      id
      title
      type
      status
      callTime
      startsAt
      endsAt
      venue {
        id
        name
      }
    }
  }
}
    `) as unknown as TypedDocumentString<MyAssignmentsQuery, MyAssignmentsQueryVariables>;
export const SaveRosterDocument = new TypedDocumentString(`
    mutation SaveRoster($eventId: ID!, $input: RosterInput!) {
  saveRoster(eventId: $eventId, input: $input) {
    ...RosterFields
  }
}
    fragment AssignmentFields on Assignment {
  userId
  role
  instrumentId
  instrumentName
  notes
  overrideReason
  ackStatus
  ackNote
  ackAt
  person {
    name
    warName
    rank
    section
  }
}
fragment RosterFields on Roster {
  eventId
  status
  version
  publishedAt
  uncoveredSections
  assignments {
    ...AssignmentFields
  }
}`) as unknown as TypedDocumentString<SaveRosterMutation, SaveRosterMutationVariables>;
export const PublishRosterDocument = new TypedDocumentString(`
    mutation PublishRoster($eventId: ID!) {
  publishRoster(eventId: $eventId) {
    ...RosterFields
  }
}
    fragment AssignmentFields on Assignment {
  userId
  role
  instrumentId
  instrumentName
  notes
  overrideReason
  ackStatus
  ackNote
  ackAt
  person {
    name
    warName
    rank
    section
  }
}
fragment RosterFields on Roster {
  eventId
  status
  version
  publishedAt
  uncoveredSections
  assignments {
    ...AssignmentFields
  }
}`) as unknown as TypedDocumentString<PublishRosterMutation, PublishRosterMutationVariables>;
export const AcknowledgeRosterDocument = new TypedDocumentString(`
    mutation AcknowledgeRoster($eventId: ID!, $answer: AckAnswer!, $note: String) {
  acknowledgeRoster(eventId: $eventId, answer: $answer, note: $note) {
    ackStatus
    ackNote
  }
}
    `) as unknown as TypedDocumentString<AcknowledgeRosterMutation, AcknowledgeRosterMutationVariables>;