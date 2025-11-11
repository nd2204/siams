import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "./query-keys";
import { deviceService } from "@/services/api/device-service";
import React from "react";
import { useSocket } from "../use-socket";

export const useDeviceTelemetry = (deviceId: string) => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const key = [QUERIES.DEVICE.TELEMETRY(deviceId)]

  // Realtime subscription setup
  React.useEffect(() => {
    if (!socket) return;

    const handleTelemetry = (message: any) => {
      const update = JSON.parse(message.data);

      // Merge dữ liệu mới vào cache
      queryClient.setQueryData(key, (old: any) => {
        if (!old) return [update];
        return [...old.slice(-99), update]; // giữ 100 bản ghi mới nhất
      });
    };

    socket?.on("device.telemetry", handleTelemetry)

    return () => { socket?.off("device.telemetry", handleTelemetry); }
  }, [socket, deviceId, queryClient]);

  return useQuery({
    queryKey: key,
    queryFn: async () => await deviceService.getTelemetry(deviceId),
    refetchInterval: 60_000
  });
}
