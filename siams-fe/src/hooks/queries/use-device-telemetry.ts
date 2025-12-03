import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "./query-keys";
import { deviceService } from "@/services/api/device-service";
import type { ListTelemtryPayload } from "@/types/device/index";

export const useDeviceTelemetry = (
  deviceId: string,
  sensorId: string,
  payload: ListTelemtryPayload
) => {
  const key = [QUERIES.DEVICE.TELEMETRY(deviceId, sensorId)];

  // Query for initial telemetry data
  const now = new Date();
  now.setDate(1);

  return useQuery({
    queryKey: key,
    queryFn: async () => await deviceService.listTelemetry({
      deviceId,
      sensorId,
      payload
    }),
    refetchInterval: 5 * 60 * 1000,
    enabled: !!deviceId && !!sensorId
  });
}
