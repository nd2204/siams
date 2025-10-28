"use client"

import * as React from "react"
import {
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconInnerShadowTop,
  IconReport,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav/documents"
import { NavMain } from "@/components/nav/main"
import { NavSecondary } from "@/components/nav/secondary"
import { NavUser } from "@/components/nav/user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { routes } from "@/app/routes"
import { extractSidebarNavGroups } from "@/utils/extract-sidebar-nav-group"

const data = {
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      path: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      path: "#",
      items: [
        {
          title: "Active Proposals",
          path: "#",
        },
        {
          title: "Archived",
          path: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      path: "#",
      items: [
        {
          title: "Active Proposals",
          path: "#",
        },
        {
          title: "Archived",
          path: "#",
        },
      ],
    },
  ],
  documents: [
    {
      title: "Data Library",
      path: "#",
      icon: IconDatabase,
    },
    {
      title: "Reports",
      path: "#",
      icon: IconReport,
    },
    {
      title: "Word Assistant",
      path: "#",
      icon: IconFileWord,
    },
  ],
}

const groups = (extractSidebarNavGroups(routes))
const navMain = groups["general"]
const navSecondary = groups["secondary"]

export function MainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Siams</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
