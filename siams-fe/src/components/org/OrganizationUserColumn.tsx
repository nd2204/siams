import type { ColumnDef } from "@tanstack/react-table";
import type { OrganizationUser, OrgRole } from "@/types/organization";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import dayjs from 'dayjs'
import { IconDots, IconKey, IconTrash, IconUser } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";

const RoleStyleMap: Record<OrgRole, {
  badge_style: string,
  badge_title: string
}> = {
  ORG_OWNER: {
    badge_style: "status-badge-red text-accent-red",
    badge_title: "Owner"
  },
  ORG_ADMIN: {
    badge_style: "status-badge-purple text-accent-purple",
    badge_title: "Admin"
  },
  ORG_VIEWER: {
    badge_style: "status-badge-green text-accent-green",
    badge_title: "Viewer"
  },
  ORG_OPERATOR: {
    badge_style: "status-badge-blue text-accent-blue",
    badge_title: "Operator"
  }
} as const

export const organizationUserColumn: ColumnDef<OrganizationUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "user_name",
    header: "User name",
    cell: ({ row }) =>
      <div className="flex flex-col gap-2">
        <p>{row.original.user_name}</p>
        <p className="text-muted-foreground text-xs">{row.original.user_email}</p>
      </div>
  },
  {
    accessorKey: "role_name",
    header: "access",
    cell: ({ row }) => {
      const m = RoleStyleMap[row.original.role_name]
      return (
        <Badge
          variant="outline"
          className={cn(
            "border font-semibold",
            m.badge_style
          )}
        >
          {m.badge_title}
        </Badge>
      )
    }
  },
  {
    accessorKey: "joined_at",
    header: "Date added",
    cell: ({ row }) => {
      return (
        <div>
          {dayjs(new Date(row.original.joined_at)).format('MMM D, YYYY')}
        </div>
      )
    }
  },
  {
    id: "action",
    cell: ({ row }) => {
      const { user } = useAuth()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto">
              <IconDots />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <IconUser />
              View profile
            </DropdownMenuItem>
            {user?.id !== row.original.user_id &&
              <>
                <DropdownMenuItem>
                  <IconKey />
                  Change permission
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconTrash />
                  Remove user
                </DropdownMenuItem>
              </>
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )

    }
  }
]

