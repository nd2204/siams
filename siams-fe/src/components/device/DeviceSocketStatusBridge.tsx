import { useCallback } from "react";
import { useDeviceRoom } from "@/hooks/use-device-room";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/hooks/queries/query-keys";
import type { DeviceEventType } from "@/types/device/device.event";
import type { DeviceStatus } from "@/types/device/device-status";
import { toast } from "sonner";
import type { Device } from "@/types/device/device";

export function DeviceSocketStatusBridge({ device_id }: { device_id: string }) {
  const queryClient = useQueryClient();

  const handleDeviceStatusMessage = useCallback((event: DeviceEventType, msg: any) => {
    if (event !== "device.status") return;

    const raw: DeviceStatus = typeof msg.data === "string"
      ? JSON.parse(msg.data)
      : msg.data;

    const key = [QUERIES.DEVICE.STATUS(device_id)];
    console.log(raw)

    queryClient.setQueryData(key, (old: DeviceStatus | undefined) => {
      if (!old) return raw;
      if (old.online != raw.online) {
        if (raw.online) {
          toast.success(`Device ${device_id} ${raw.online ? "is online" : "went offline"}`)
        } else {
          toast.message(`Device ${device_id} ${raw.online ? "is online" : "went offline"}`)
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
