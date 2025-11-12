import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "./query-keys"
import { deviceService } from "@/services/api/device-service"

export const useDeviceCommand = (deviceId?: string) => {
  return useQuery({
    queryKey: [QUERIES.DEVICE.COMMANDS(deviceId!)],
    queryFn: async () => await deviceService.listCommands(deviceId!),
    enabled: !!deviceId
  })
}
