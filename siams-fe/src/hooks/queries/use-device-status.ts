import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "./query-keys";
import { deviceService } from "@/services/api/device-service";

export const useDeviceStatus = (
  deviceId?: string,
) => {
  const key = [QUERIES.DEVICE.STATUS(deviceId!)];

  // Query for initial telemetry data
  const now = new Date();
  now.setDate(1);

  return useQuery({
    queryKey: key,
    queryFn: async () => await deviceService.getLatestStatus(deviceId!),
    refetchInterval: 10 * 60 * 1000,
    enabled: !!deviceId
  });
}
