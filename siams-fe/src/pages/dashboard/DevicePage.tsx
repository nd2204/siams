import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Filter,
  Search,
} from 'lucide-react';
import { useDeviceByOrg } from '@/hooks/queries/use-device-by-org';
import { useAuth } from '@/hooks/use-auth';
import { ClusterDeviceDataTable } from '@/components/cluster/ClusterDeviceDataTable';
import { clusterDeviceColumns } from '@/components/cluster/ClusterDeviceColumn';
import OrganizationDeviceEmpty from '@/components/org/OrganizationDeviceEmpty';

export default function DevicePage() {
  const { activeOrg } = useAuth();
  const { data: devices, refetch } = useDeviceByOrg(activeOrg?.id);
  console.log(devices)

  return (
    <div className="flex flex-col flex-1 px-6 py-6">
      <div className="mb-6">
        <h2 className="text-foreground">Device Management</h2>
        <p className="text-muted-foreground mt-1 font-sm">
          Manage MCU devices and their connected sensors in your organization
        </p>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"> */}
      {/*   <Card className="p-4"> */}
      {/*     <div className="text-foreground mb-1">Total Devices</div> */}
      {/*     <div className="text-foreground">{devices?.pagination.total}</div> */}
      {/*   </Card> */}
      {/*   <Card className="p-4"> */}
      {/*     <div className="text-foreground mb-1">Online</div> */}
      {/*     <div className="text-foreground">{stats.onlineDevices}</div> */}
      {/*   </Card> */}
      {/*   <Card className="p-4"> */}
      {/*     <div className="text-foreground mb-1">Warning</div> */}
      {/*     <div className="text-yellow-600">{stats.warningDevices}</div> */}
      {/*   </Card> */}
      {/*   <Card className="p-4"> */}
      {/*     <div className="text-foreground mb-1">Offline</div> */}
      {/*     <div className="text-red-600">{stats.offlineDevices}</div> */}
      {/*   </Card> */}
      {/* </div> */}

      {/* Filters and Actions */}
      {/* Device Table */}
      {(devices && devices.pagination.total > 0)
        ? (
          <>
            <div className="py-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search devices..." className="pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="MCU Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="esp32">ESP32</SelectItem>
                    <SelectItem value="esp8266">ESP8266</SelectItem>
                    <SelectItem value="arduino">Arduino</SelectItem>
                    <SelectItem value="raspberry">Raspberry Pi</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </div>

            <div className="flex flex-1">
              <div className="@container/card flex-1 overflow-hidden pt-2 pb-0 gap-0">
                <div className="flex justify-between pb-4">
                  <div className="font-semibold">Devices in this Cluster</div>
                  <Badge variant="outline">
                    {devices.pagination.total} devices
                  </Badge>
                </div>
                <ClusterDeviceDataTable
                  columns={clusterDeviceColumns}
                  data={devices.data}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-muted-foreground">Showing {devices?.data.length} of {devices?.pagination.total} devices</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Card className="@container/card flex flex-1 bg-background overflow-hidden pt-2 pb-0 gap-0 border-dashed">
            <OrganizationDeviceEmpty orgId={activeOrg!.id} onRefresh={() => refetch()} />
          </Card>
        )
      }

    </div>
  );
}
