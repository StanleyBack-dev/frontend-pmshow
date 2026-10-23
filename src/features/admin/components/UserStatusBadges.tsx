import { Badge } from "@/design-system";
import type { UserAccount } from "@/shared/contracts/api";

export function UserStatusBadges({
  user,
}: {
  user: Pick<UserAccount, "active" | "mustChangePassword" | "locked">;
}) {
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {user.active ? (
        <Badge tone="success" dot>
          Ativo
        </Badge>
      ) : (
        <Badge tone="neutral" dot>
          Desativado
        </Badge>
      )}
      {user.locked && <Badge tone="danger">Bloqueado</Badge>}
      {user.active && user.mustChangePassword && (
        <Badge tone="warning">Primeiro acesso pendente</Badge>
      )}
    </span>
  );
}
