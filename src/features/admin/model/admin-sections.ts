import {
  ClipboardList,
  Link2,
  ScrollText,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/shared/contracts/api";

export type AdminSection = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  group: "Acessos" | "Sistema";
  permission: Permission;
};

// The areas of Administração, in menu order; each shows only to whoever has
// its permission.
export const ADMIN_SECTIONS: AdminSection[] = [
  {
    href: "/admin/usuarios",
    label: "Usuários",
    description: "Contas, grupos e permissões",
    icon: UsersRound,
    group: "Acessos",
    permission: "USERS_MANAGE",
  },
  {
    href: "/admin/cadastros",
    label: "Cadastros",
    description: "Pedidos vindos do link",
    icon: ClipboardList,
    group: "Acessos",
    permission: "USERS_MANAGE",
  },
  {
    href: "/admin/links",
    label: "Links de cadastro",
    description: "Links enviados por WhatsApp",
    icon: Link2,
    group: "Acessos",
    permission: "USERS_MANAGE",
  },
  {
    href: "/admin/logs",
    label: "Logs e alertas",
    description: "Erros, segurança e rotinas",
    icon: ScrollText,
    group: "Sistema",
    permission: "AUDIT_READ",
  },
];
