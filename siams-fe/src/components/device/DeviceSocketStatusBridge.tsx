import { useCallback } from "react";
import { useDeviceRoom } from "@/hooks/use-device-room";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/hooks/queries/query-keys";
import type { DeviceEvent, DeviceEventType } from "@/types/device/";
import type { DeviceStatus } from "@/types/device/device-status";
import { toast } from "sonner";
import type { Device } from "@/types/device/device";

export function DeviceSocketStatusBridge({ device_id }: { device_id: string }) {
  const queryClient = useQueryClient();

  const handleDeviceStatusMessage = useCallback((event: DeviceEventType, msg: DeviceEvent) => {
    if (event !== "device.status") return;

    const raw: DeviceStatus = typeof msg.event_payload === "string"
      ? JSON.parse(msg.event_payload)
      : msg.event_payload;

    const key = [QUERIES.DEVICE.STATUS(device_id)];

    queryClient.setQueryData(key, (old: DeviceStatus | undefined) => {
      if (!old) return raw;
      if (old.online != raw.online) {
        if (raw.online) {
          toast.success(`Device ${device_id} is online`)
        } else {
          toast.warning(`Device ${device_id} went offline`)
        }

        queryClient.setQueryData([QUERIES.DEVICE.BY_ID(device_id)], (prev: Device | undefined) => {
          if (!prev) return prev;
          let newDevice: Device = { ...prev }
          newDevice.status = raw.online ? "online" : "offline"
          return newDevice;
        });
      }
      return raw;
    });
  }, [queryClient]);

  // This is the *only* place that actually subscribes to the socket
  useDeviceRoom(device_id, handleDeviceStatusMessage);

  return null; // just side-effects
}
