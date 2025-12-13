import ClusterMapView from "@/components/cluster/ClusterMapView";
import DashboardClusterView from "@/components/dashboard/DashboardClusterView";
import { SectionCards } from "@/components/dashboard/SectionCards"
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <DashboardClusterView />
            </div>
            <div className="flex flex-row px-4 lg:px-6">
              <Card className="flex-1 overflow-hidden p-0 h-80">
                <ClusterMapView />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
