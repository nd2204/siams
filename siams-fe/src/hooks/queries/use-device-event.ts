import { useQuery } from "@tanstack/react-query"
import { ENDPOINTS } from "@/services/api/endpoints"
import { deviceService } from "@/services/api/device-service"

export const useDeviceEvent = (device_id?: string, perBucket?: number) => {
  const key = [ENDPOINTS.DEVICE.EVENTS(device_id!)]

  return useQuery({
    queryKey: key,
    queryFn: async () => await deviceService.listEvent({
      device_id: device_id!, perBucket
    }),
    refetchInterval: 10 * 60 * 1000,
    enabled: !!device_id
  })
}
