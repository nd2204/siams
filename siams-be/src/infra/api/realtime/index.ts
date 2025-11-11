import { services } from "@config/services";
import { SocketIoRealtimeClient } from "./socketio-client";
import { SMLogger } from "@shared/logger";

export const socketClient = new SocketIoRealtimeClient(
  services.organization.repositories.user,
  services.cluster.repositories.base,
  services.device.repositories.base,
  new SMLogger("infra:realtime:SocketIoRealtimeClient"),
  services.utils.verifyToken
)
