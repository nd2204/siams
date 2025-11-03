// utils/navigation.ts
import type { AppRouteObject } from "@/types/navigations";
import type { Role } from "@/types/role";

export function filterRoutesByRole(routes: AppRouteObject[], role: Role): AppRouteObject[] {
  return routes
    .filter(r =>
      !r.allowedRoles || r.allowedRoles.includes(role)
    )
    .map(r => ({
      ...r,
      index: false,
      children: r.children ? filterRoutesByRole(r.children, role) : undefined,
    }));
}
