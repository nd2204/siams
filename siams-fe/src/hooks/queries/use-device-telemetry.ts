import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "./query-keys";
import { deviceService } from "@/services/api/device-service";
import { useEffect } from "react";
import { getSocket } from "@/services/realtime/socket-client";
import { useAuth } from "../use-auth";
import { useDeviceSubscription } from "./use-device-subscription";
import type { ListTelemtryPayload } from "@/services/api/dtos/device/list-telemetry-request";

export const useDeviceTelemetry = (
  deviceId: string,
  sensorId: string,
  payload: ListTelemtryPayload
) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const key = [QUERIES.DEVICE.TELEMETRY(deviceId, sensorId)];

  // Subscribe to device-level updates (only one emission per device, even with multiple sensors)
  useDeviceSubscription(deviceId);

  // Setup telemetry listener for THIS specific sensor
  useEffect(() => {
    if (!token || !deviceId || !sensorId) return;

    const socket = getSocket();
    if (!socket) return;

    // Handler for telemetry data - filters by sensor
    const handleTelemetry = (message: any) => {
      try {
        const update = typeof message.data === 'string' ? JSON.parse(message.data) : message.data;

        // Only update cache for our specific sensor
        if (update.sensorId === sensorId || update.deviceId === deviceId) {
          queryClient.setQueryData(key, (old: any) => {
            if (!old) return [update];
            return [...old.slice(-20), update]; // Keep last 20 records
          });
        }
      } catch (error) {
        console.error("[Telemetry] Failed to parse message:", error);
      }
    };

    // Register listener for device telemetry
    socket.on("device.telemetry", handleTelemetry);

    // Cleanup listener when component unmounts or dependencies change
    return () => {
      socket.off("device.telemetry", handleTelemetry);
    };
  }, [token, deviceId, sensorId, queryClient, key]);

  // Query for initial telemetry data
  const now = new Date();
  now.setDate(1);

  return useQuery({
    queryKey: key,
    queryFn: async () => await deviceService.getTelemetry({
      deviceId,
      sensorId,
      payload
    }),
    refetchInterval: 5 * 60 * 1000,
    enabled: !!deviceId && !!sensorId
  });
}
