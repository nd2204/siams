import { MainSidebar } from "@/components/MainSidebar"
import OrganizationEmpty from "@/components/org/OrganizationEmpty"
import { SiteHeader } from "@/components/SiteHeader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Suspense, useState } from "react"
import { Outlet } from "react-router"

export default function MainLayout() {
  const { user, activeOrg, setOrg } = useAuth();

  // set first org as default
  if (!activeOrg && user?.organizations && user?.organizations?.length > 0) {
    setOrg(user.organizations[0]);
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={true}
    >
      <MainSidebar variant="floating" />
      <SidebarInset className={cn(
        "overflow-hidden",
        !activeOrg && "border-dashed"
      )}>
        {activeOrg ?
          <>
            <SiteHeader />
            <Suspense fallback={<Spinner />}>
              <Outlet />
            </Suspense>
          </>
          :
          <>
            <OrganizationEmpty />
          </>
        }
      </SidebarInset>
    </SidebarProvider>
  )
}
