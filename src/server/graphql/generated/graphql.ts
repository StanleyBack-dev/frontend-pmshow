/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type AddYoutubeVideoInput = {
  /** Link do vídeo (youtube.com, youtu.be, shorts…). */
  link: string;
  songId: string | number;
  /** Título; sem ele, usa o do YouTube. */
  title?: string | null | undefined;
};

export type AuditFilterInput = {
  actorId?: string | number | null | undefined;
  entity?: string | null | undefined;
  entityId?: string | null | undefined;
};

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

export type VerifyRecoveryCodeInput = {
  code: string;
  login: string;
};

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