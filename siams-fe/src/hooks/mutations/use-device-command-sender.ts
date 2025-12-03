import { deviceService } from "@/services/api/device-service"
import type { DeviceSendCommandRequest } from "@/types/device/index";
import { useMutation } from "@tanstack/react-query"

export const useDeviceCommandSender = () => {
  return useMutation({
    mutationFn: (req: DeviceSendCommandRequest) => {
      return deviceService.sendCommand(req);
    },
  })
}
