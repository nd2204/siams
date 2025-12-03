import ClusterDeviceView from "@/components/cluster/ClusterDeviceView"
import ClusterDetailInfoSection from "@/components/cluster/ClusterDetailInfoSection"
import ClusterNotFound from "@/components/cluster/ClusterNotFound"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { useClusterDetail } from "@/hooks/queries/use-cluster-detail"
import { cn } from "@/lib/utils"
import { IconKey, IconMapPin, IconStack2 } from "@tabler/icons-react"
import { useParams } from "react-router"

export default function ClusterDetailPage() {
  const { id } = useParams()
  const { data: cluster, status } = useClusterDetail(id)

  if (status == "error" || !cluster) {
    return (
      <div className="flex flex-1 flex-col">
        <ClusterNotFound />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6 ">
          {/* <div className="flex flex-row justify-between items-center"> */}
          {/*   <span className='text-xl'>Clusters</span> */}
          {/* </div> */}
          <Card className={cn("flex", "border-ring/30 from-ring/10 to-card bg-card bg-gradient-to-t shadow-xs px-4 lg:px-6")}>
            <Item variant="default" className="p-0 bg-none">
              <ItemMedia variant="icon" className="border-ring/15 bg-ring/15 self-center">
                <IconStack2 />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className='text-lg font-semibold gap-4'>
                  <span>{cluster.name}</span>
                </ItemTitle>
                <ItemDescription className="flex gap-1 items-center">
                  <IconMapPin stroke={1.5} size={20} /> {cluster.locName}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="lg" variant="outline">
                  <IconKey />
                  Credentials
                </Button>
              </ItemActions>
            </Item>
            <ClusterDetailInfoSection cluster={cluster} />
          </Card>
          {cluster && <ClusterDeviceView cluster={cluster} />}
        </div>
      </div>
    </div>
  )
}
