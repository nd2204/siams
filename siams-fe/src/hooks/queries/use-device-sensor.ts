import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "./query-keys"
import { deviceService } from "@/services/api/device-service"

export const useDeviceSensors = (deviceId?: string) => {
  return useQuery({
    queryKey: [QUERIES.DEVICE.SENSORS(deviceId!)],
    queryFn: async () => await deviceService.listSensors(deviceId!),
    enabled: !!deviceId
  })
}
