// types/navigation.ts
import type { Role } from "./role";
import type { Icon } from "@tabler/icons-react";
import { type IndexRouteObject, type NonIndexRouteObject } from "react-router";

type RouteMetadata = {
  title?: string;
  tablerIcon?: Icon;
  icon?: string;
  sidebar?: boolean;
  order?: number;
  group?: string;
}

interface NonIndexAppRouteObject extends NonIndexRouteObject {
  /** Unique route ID (recommended but optional) */
  id?: string;
  /** Role-based access control */
  allowedRoles?: Role[];
  /** Meta information for UI, breadcrumbs, etc. */
  meta?: RouteMetadata;
  /** Nested routes */
  children?: AppRouteObject[];
}

interface IndexAppRouteObject extends IndexRouteObject {
  /** Unique route ID (recommended but optional) */
  id?: string;
  /** Role-based access control */
  allowedRoles?: undefined;
  /** Meta information for UI, breadcrumbs, etc. */
  meta?: undefined;
}

export type AppRouteObject = IndexAppRouteObject | NonIndexAppRouteObject

export type NavItem = {
  title: string
  path: string
  icon?: Icon
}

export type NavGroupMap = Record<string, NavItem[]>
