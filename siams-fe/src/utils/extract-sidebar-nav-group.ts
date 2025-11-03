import type { AppRouteObject, NavGroupMap, NavItem } from "@/types/navigations";
import { filterSidebarRoutes } from "./filter-sidebar-routes";

export function extractSidebarNavGroups(routes: AppRouteObject[]): NavGroupMap {
  const sidebarRoutes = filterSidebarRoutes(routes)
  const sidebarItems: ({ item: NavItem } & { group: string })[] = []

  const traverse = (routeList: AppRouteObject[]) => {
    for (const r of routeList) {
      if (r.meta?.sidebar && r.meta.title && r.meta.group) {
        sidebarItems.push({
          item: {
            title: r.meta.title,
            path: r.path || "#",
            icon: r.meta.tablerIcon
          },
          group: r.meta.group,
        });
      }

      if (r.children) traverse(r.children);
    }
  };

  traverse(sidebarRoutes);

  // Group by `group`
  const grouped: Record<string, NavItem[]> = {};

  for (const item of sidebarItems) {
    if (!grouped[item.group]) grouped[item.group] = [];
    grouped[item.group].push(item.item);
  }

  return grouped
}
