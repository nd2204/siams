import type { AppRouteObject } from "@/types/navigations";

export function filterSidebarRoutes(routes: AppRouteObject[]): AppRouteObject[] {
  return routes
    .filter(r =>
      r.meta && r.meta.sidebar && !r.index
    )
    .map(r => ({
      ...r,
      index: false,
      children: r.children ? filterSidebarRoutes(r.children) : undefined
    }))
}

