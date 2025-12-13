import type { Device } from "@/types/device/index";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { IconExternalLink } from "@tabler/icons-react";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { formatLastSeenTime } from "@/utils/time-utils";
import { Checkbox } from "../ui/checkbox";

export const clusterDeviceColumns: ColumnDef<Device>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={cn("flex flex-row gap-2 rounded-full py-1",
        row.original.status !== "online" && "text-muted-foreground"
      )}>
        {row.original.status === "online" ? (
          <div className="relative flex h-3 w-3 items-center justify-center">
            <div className="absolute h-3 w-3 rounded-full bg-green-600 opacity-75 animate-ping"></div>
            <div className="relative h-3 w-3 rounded-full bg-green-600"></div>
          </div>
        ) : (
          <div className="relative flex h-3 w-3 items-center justify-center">
            <div className="relative h-3 w-3 rounded-full bg-secondary"></div>
          </div>
        )}
        {row.original.status}
      </Badge>
    )
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "firmwareVersion",
    header: "Version",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full">
        <span className="font-mono text-muted-foreground">
          {row.original.fw_ver}
        </span>
      </Badge>
    )
  },
  {
    accessorKey: "lastSeen",
    header: "Last Seen",
    cell: ({ row }) => (
      <div>
        {formatLastSeenTime(new Date(row.original.last_seen_at))}
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" className="hover:cursor-pointer">
        <Link to={`/device/${row.original.id}`}>
          <IconExternalLink />
        </Link>
      </Button>
    )
  },
]

