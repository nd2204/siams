import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { roleSanitized } from "@/services/api/dtos/auth/user-data";
import { Badge } from "../ui/badge";

export default function OrganizationSelector() {
  const { user, activeOrg, setOrg } = useAuth()

  // fallback to active org if the user just created a new organization
  const userOrgs = user?.organizations
    ? user?.organizations
    : (activeOrg ? [activeOrg] : [])

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {activeOrg ?
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-medium">{activeOrg.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {activeOrg.slug}
                </span>
              </div>
            </div>
            : <>Select workspace</>}
          <ChevronDown className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      {userOrgs && userOrgs.length > 0 &&
        <>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width] z-[9999]">
            <DropdownMenuLabel className="text-muted-foreground text-xs">Organizations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userOrgs.map((org) => (
              <DropdownMenuItem key={org.id} onSelect={() => setOrg(org)}>
                <div className="flex flex-row flex-1 justify-between">
                  <span>{org.name}</span>
                  <Badge variant="secondary" className="text-muted-foreground ml-4">{roleSanitized(org.role)}</Badge>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </>
      }
    </DropdownMenu>
  )
}

