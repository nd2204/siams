import type { Device } from "@/types/device";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { IconLink } from "@tabler/icons-react";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { Link } from "react-router";

function formatLastSeenTime(pastDate: Date) {
  const now = new Date();
  const secondsElapsed = Math.floor((now.getTime() - pastDate.getTime()) / 1000); // Difference in seconds

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  // Define time intervals in seconds
  const minute = 60;
  const hour = 3600;
  const day = 86400;

  if (secondsElapsed < minute) {
    return formatter.format(-secondsElapsed, 'second');
  } else if (secondsElapsed < hour) {
    const minutes = Math.floor(secondsElapsed / minute);
    return formatter.format(-minutes, 'minute');
  } else if (secondsElapsed < day) {
    const hours = Math.floor(secondsElapsed / hour);
    return formatter.format(-hours, 'hour');
  } else {
    // For longer periods, you might want a specific date format
    return pastDate.toLocaleDateString();
  }
}

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
          {row.original.firmwareVersion}
        </span>
      </Badge>
    )
  },
  {
    accessorKey: "lastSeen",
    header: "Last Seen",
    cell: ({ row }) => (
      <div>
        {formatLastSeenTime(new Date(row.original.lastSeen))}
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

