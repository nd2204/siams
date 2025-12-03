// use-device-room.ts
import { useEffect } from "react";
import { useSocketManager } from "./use-socket-manager.ts";
import { useAuth } from "./use-auth.ts";
import { SubscribeDeviceRoomRequest, type MessageHandler } from "@/services/realtime/rooms.ts";

export function useDeviceRoom(device_id: string, handler: MessageHandler) {
  const manager = useSocketManager();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      // Not logged in: do nothing
      return;
    }

    const request = new SubscribeDeviceRoomRequest(device_id, handler);
    const unsubscribe = manager.subscribeRoom(request);

    return () => unsubscribe();
  }, [device_id, handler, manager, token]);

}
