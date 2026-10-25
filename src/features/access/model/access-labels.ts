import type { Permission, UserGroup } from "@/shared/contracts/api";

export const GROUP_LABELS: Record<UserGroup, string> = {
  USER: "Músico",
  ADMIN: "Gestor",
  ADMIN_MASTER: "Administrador geral",
};

export const GROUP_DESCRIPTIONS: Record<UserGroup, string> = {
  USER: "Vê repertório, agenda e as próprias escalas.",
  ADMIN: "Gerencia repertório, agenda, escalas e os músicos.",
  ADMIN_MASTER: "Acesso total, inclusive permissões e auditoria.",
};

/** Groups in rank order (lowest first). */
export const GROUPS: UserGroup[] = ["USER", "ADMIN", "ADMIN_MASTER"];

type PermissionInfo = { label: string; area: PermissionArea };

export type PermissionArea =
  | "Repertório"
  | "Agenda"
  | "Escalas"
  | "Músicos"
  | "Comunicação"
  | "Administração";

// Exhaustive on purpose: a permission added to the API fails the typecheck
// here until it gets a label.
export const PERMISSION_INFO: Record<Permission, PermissionInfo> = {
  REPERTOIRE_READ: { label: "Ver o repertório", area: "Repertório" },
  REPERTOIRE_MANAGE: { label: "Gerenciar músicas", area: "Repertório" },
  MEDIA_UPLOAD: { label: "Enviar áudios e vídeos", area: "Repertório" },
  MEDIA_DOWNLOAD: { label: "Baixar os áudios", area: "Repertório" },
  EVENTS_READ: { label: "Ver a agenda", area: "Agenda" },
  EVENTS_MANAGE: { label: "Gerenciar eventos e locais", area: "Agenda" },
  ROSTERS_READ_OWN: { label: "Ver as próprias escalas", area: "Escalas" },
  ROSTERS_READ_ALL: { label: "Ver todas as escalas", area: "Escalas" },
  ROSTERS_MANAGE: { label: "Montar escalas", area: "Escalas" },
  ROSTERS_PUBLISH: { label: "Publicar escalas", area: "Escalas" },
  MEMBERS_READ: { label: "Ver dados dos músicos", area: "Músicos" },
  MEMBERS_MANAGE: { label: "Gerenciar músicos", area: "Músicos" },
  ABSENCES_REQUEST: {
    label: "Informar indisponibilidade",
    area: "Músicos",
  },
  ABSENCES_MANAGE: {
    label: "Aprovar indisponibilidades",
    area: "Músicos",
  },
  NOTIFICATIONS_BROADCAST: {
    label: "Enviar comunicados gerais",
    area: "Comunicação",
  },
  USERS_MANAGE: { label: "Gerenciar usuários", area: "Administração" },
  PERMISSIONS_MANAGE: {
    label: "Gerenciar permissões",
    area: "Administração",
  },
  AUDIT_READ: { label: "Ver a auditoria", area: "Administração" },
};

/** Only granted by the ADMIN_MASTER group; never per user. */
export const LOCKED_PERMISSIONS: ReadonlySet<Permission> = new Set([
  "PERMISSIONS_MANAGE",
  "AUDIT_READ",
]);

export const PERMISSION_AREAS: PermissionArea[] = [
  "Repertório",
  "Agenda",
  "Escalas",
  "Músicos",
  "Comunicação",
  "Administração",
];

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  "user.created": "Criou usuário",
  "user.updated": "Editou usuário",
  "user.activated": "Ativou usuário",
  "user.deactivated": "Desativou usuário",
  "user.password_reset": "Redefiniu a senha",
  "user.unlocked": "Desbloqueou usuário",
  "user.sessions_revoked": "Encerrou as sessões",
  "user.permissions_changed": "Alterou permissões",
  "user.first_access_completed": "Concluiu o primeiro acesso",
  "user.password_changed": "Trocou a própria senha",
  "user.password_recovered": "Recuperou a senha",
  "user.profile_updated": "Atualizou o perfil",
  "member.created": "Cadastrou na banda",
  "member.updated": "Editou o cadastro na banda",
  "instrument.created": "Criou instrumento / função",
  "instrument.updated": "Editou instrumento / função",
  "song.created": "Cadastrou música",
  "song.updated": "Editou música",
  "song.archived": "Arquivou música",
  "song.restored": "Restaurou música",
  "artist.created": "Cadastrou cantor / banda",
  "artist.updated": "Editou cantor / banda",
  "media.video_added": "Adicionou vídeo",
  "media.audio_uploaded": "Enviou áudio",
  "media.renamed": "Renomeou mídia",
  "media.removed": "Removeu mídia",
  "event.created": "Criou evento",
  "event.updated": "Editou evento",
  "event.changed": "Alterou evento",
  "event.status_changed": "Mudou a situação do evento",
  "event.setlist_updated": "Alterou a lista de músicas",
  "venue.created": "Cadastrou local",
  "venue.updated": "Editou local",
  "roster.created": "Criou escala",
  "roster.updated": "Editou escala",
  "roster.published": "Publicou escala",
  "roster.acknowledged": "Respondeu à escala",
  "absence.requested": "Pediu indisponibilidade",
  "absence.registered": "Registrou indisponibilidade",
  "absence.cancelled": "Cancelou indisponibilidade",
  "broadcast.sent": "Enviou comunicado",
};
