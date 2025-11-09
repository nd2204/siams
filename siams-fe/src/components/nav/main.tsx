"use client"

import { IconBook2, IconCirclePlusFilled, IconMail } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/types/navigations"
import { useLocation, useNavigate } from "react-router"
import { Kbd, KbdGroup } from "../ui/kbd"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Input } from "../ui/input"


export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <InputGroup>
                <InputGroupAddon>
                  <IconBook2 />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Quick Action"
                />
                <InputGroupAddon align="inline-end">
                  <Kbd>Q</Kbd>
                </InputGroupAddon>
              </InputGroup>
              {/* <IconCirclePlusFilled /> */}
              {/* <span>Quick Action</span> */}
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <IconMail />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>General</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} onClick={() => navigate(item.path)} isActive={location.pathname === item.path}>
                  {item.icon && <item.icon />}
                  <span >{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
