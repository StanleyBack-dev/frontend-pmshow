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

/** Perfil de acesso: Músico, Gestor ou Administrador geral. */
export type UserGroup =
  /** Gestor */
  | 'ADMIN'
  /** Administrador geral */
  | 'ADMIN_MASTER'
  /** Músico */
  | 'USER';
