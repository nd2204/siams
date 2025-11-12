import { services } from "@config/services";
import { SocketIoRealtimeClient } from "./socketio-client";
import { SMLogger } from "@shared/logger";

export const socketClient = new SocketIoRealtimeClient(
  // services.organization.repositories.user,
  // services.cluster.repositories.base,
  // services.device.repositories.base,
  services.authService,
  new SMLogger("infra:realtime:SocketIoRealtimeClient"),
  services.eventBus,
  services.utils.verifyToken
)
