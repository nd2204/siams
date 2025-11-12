import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "./query-keys";
import { deviceService } from "@/services/api/device-service";

export const useDeviceDetail = (id?: string) => {
  return useQuery({
    queryKey: [QUERIES.DEVICE.BY_ID(id!)],
    queryFn: async () => await deviceService.getById(id!),
    enabled: !!id
  });
}
