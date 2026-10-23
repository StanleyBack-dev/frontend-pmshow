export type MediaKind =
  | 'AUDIO'
  | 'VIDEO';

export type MediaStatus =
  | 'PENDING'
  | 'READY';

/** Situação do integrante na banda. */
export type MemberStatus =
  | 'AFASTADO'
  | 'ATIVO'
  | 'INATIVO';

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

/** Naipe da banda. */
export type Section =
  | 'APOIO'
  | 'CORDAS_BASE'
  | 'MADEIRAS'
  | 'METAIS'
  | 'PERCUSSAO'
  | 'TECNICA'
  | 'VOCAL';

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

/** Perfil de acesso: Músico, Gestor ou Administrador geral. */
export type UserGroup =
  /** Gestor */
  | 'ADMIN'
  /** Administrador geral */
  | 'ADMIN_MASTER'
  /** Músico */
  | 'USER';
