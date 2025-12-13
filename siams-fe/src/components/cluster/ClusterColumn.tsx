import type { Device } from "@/types/device/index";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { IconExternalLink, IconLink } from "@tabler/icons-react";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { formatLastSeenTime } from "@/utils/time-utils";
import { Checkbox } from "../ui/checkbox";
import type { Cluster } from "@/types/cluster";

export const clusterColumns: ColumnDef<Cluster>[] = [
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
    accessorKey: "name",
    header: "Cluster name",
    cell: ({ row }) => {
      return (
        <div>{row.original.name}</div>
      )
    }
  },
  {
    accessorKey: "locName",
    header: "Location",
    cell: ({ row }) => {
      return (
        <div>{row.original.locName}</div>
      )
    }
  },
  {
    id: "device_count",
    header: "Device count",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.devices
            ? row.original.devices.pagination.total
            : "No devices"
          }
        </div>
      )
    }
  },
  {
    id: "action",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => navigate(`/cluster/${row.original.id}`)}
        >
          < IconExternalLink />
        </Button>
      )
    }
  }
]

