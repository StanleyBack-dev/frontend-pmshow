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

/** Função na escala. */
export type AssignmentRole =
  | 'APOIO'
  | 'CHEFE_EQUIPE'
  | 'MOTORISTA'
  | 'MUSICO'
  | 'REGENTE'
  | 'SOM';

/** Quem recebe o comunicado. */
export type BroadcastAudience =
  | 'ESCALA_EVENTO'
  | 'NAIPE'
  | 'TODOS';

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

/** Próximos (a partir de agora) ou passados. */
export type EventPeriod =
  | 'PAST'
  | 'UPCOMING';

export type EventStatus =
  | 'CANCELADO'
  | 'CONFIRMADO'
  | 'PLANEJADO'
  | 'REALIZADO';

/** Tipo de apresentação ou compromisso. */
export type EventType =
  | 'BAILE'
  | 'CULTO_MISSA'
  | 'DESFILE'
  | 'ENSAIO'
  | 'FORMATURA'
  | 'OUTRO'
  | 'SHOW'
  | 'SOLENIDADE';

/** Uniforme da PMGO (ou paisano, sem uniforme). */
export type EventUniform =
  | 'OPERACIONAL_4A'
  | 'OPERACIONAL_4B'
  | 'OPERACIONAL_4C'
  | 'PAISANO'
  | 'SOCIAL'
  | 'TUNICA';

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

/** NOVA: a banda ainda vai aprender; CONHECIDA: já toca. */
export type SongStage =
  | 'CONHECIDA'
  | 'NOVA';

/** Perfil de acesso: Músico, Gestor ou Administrador geral. */
export type UserGroup =
  /** Gestor */
  | 'ADMIN'
  /** Administrador geral */
  | 'ADMIN_MASTER'
  /** Músico */
  | 'USER';
