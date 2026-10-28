"use client";

import { usePathname } from "next/navigation";
import { SegmentedNav } from "@/design-system";

const TABS = [
  { label: "Usuários", href: "/admin/usuarios" },
  { label: "Cadastros", href: "/admin/cadastros" },
  { label: "Links de cadastro", href: "/admin/links" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <SegmentedNav
      label="Administração"
      items={TABS.map((tab) => ({
        ...tab,
        active: pathname === tab.href || pathname.startsWith(`${tab.href}/`),
      }))}
    />
  );
}
