export interface DeviceDTO {
  id: string;
  name: string;
  clusterId: string;
  status: "online" | "offline";
  lastSeen?: string;
}

