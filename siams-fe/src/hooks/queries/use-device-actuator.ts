import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "./query-keys"
import { deviceService } from "@/services/api/device-service"

export const useDeviceActuators = (deviceId?: string) => {
  return useQuery({
    queryKey: [QUERIES.DEVICE.ACTUATORS(deviceId!)],
    queryFn: async () => await deviceService.listActuators(deviceId!),
    enabled: !!deviceId
  })
}
