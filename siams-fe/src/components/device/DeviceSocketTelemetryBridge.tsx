import { useCallback } from "react";
import type { TelemetryGroup } from "@/types/device/";
import { useDeviceRoom } from "@/hooks/use-device-room";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/hooks/queries/query-keys";
import type { DeviceEventType } from "@/types/device/";

export function DeviceSocketTelemetryBridge({ device_id }: { device_id: string }) {
  const queryClient = useQueryClient();

  const handleDeviceTelemetryMessage = useCallback((event: DeviceEventType, msg: any) => {
    if (event !== "device.telemetry") return;

    const raw: TelemetryGroup = typeof msg.event_payload === "string"
      ? JSON.parse(msg.event_payload)
      : msg.event_payload;

    const key = [QUERIES.DEVICE.TELEMETRY(device_id, raw.sensorId)];

    queryClient.setQueryData(key, (old: TelemetryGroup[] | undefined) => {
      if (!old) return [raw];
      return [...old.slice(-20), raw];
    });
  }, [queryClient]);

  // This is the *only* place that actually subscribes to the socket
  useDeviceRoom(device_id, handleDeviceTelemetryMessage);

  return null; // just side-effects
}
