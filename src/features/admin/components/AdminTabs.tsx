"use client";

import { usePathname } from "next/navigation";
import { SegmentedNav } from "@/design-system";

export function AdminTabs({ showAudit }: { showAudit: boolean }) {
  const pathname = usePathname();
  const tabs = [
    { label: "Usuários", href: "/admin/usuarios" },
    ...(showAudit ? [{ label: "Auditoria", href: "/admin/auditoria" }] : []),
  ];
  return (
    <SegmentedNav
      label="Administração"
      items={tabs.map((tab) => ({
        ...tab,
        active: pathname === tab.href || pathname.startsWith(`${tab.href}/`),
      }))}
    />
  );
}
