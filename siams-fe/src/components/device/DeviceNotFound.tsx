import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { IconBuilding } from "@tabler/icons-react";

export default function DeviceNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBuilding />
        </EmptyMedia>
        <EmptyTitle>Device Not Found</EmptyTitle>
        <EmptyDescription>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
        </div>
      </EmptyContent>
    </Empty>
  )
}

