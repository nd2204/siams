import type { Device } from "@/types/device/index";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { IconLink } from "@tabler/icons-react";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { formatLastSeenTime } from "@/utils/time-utils";

export const clusterDeviceColumns: ColumnDef<Device>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={cn("rounded-full",
        row.original.status !== "online" && "text-muted-foreground"
      )}>
        {row.original.status === "online" ? (
          <div className="relative flex h-2 w-2 items-center justify-center">
            <div className="absolute h-2 w-2 rounded-full bg-green-600 opacity-75 animate-ping"></div>
            <div className="relative h-2 w-2 rounded-full bg-green-600"></div>
          </div>
        ) : (
          <div className="relative flex h-2 w-2 items-center justify-center">
            <div className="relative h-2 w-2 rounded-full bg-secondary"></div>
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
          <IconLink />
        </Link>
      </Button>
    )
  }
]

