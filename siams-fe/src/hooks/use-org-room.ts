// use-org-room.ts
import { useEffect } from "react";
import { useSocketManager } from "./use-socket-manager.ts";
import { useAuth } from "./use-auth.ts";
import { SubscribeOrgRoomRequest, type MessageHandler } from "@/services/realtime/rooms.ts";

export function useOrgRoom(org_id: string, handler: MessageHandler) {
  const manager = useSocketManager();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      // Not logged in: do nothing
      return;
    }

    const request = new SubscribeOrgRoomRequest(org_id, handler);
    const unsubscribe = manager.subscribeRoom(request);

    return () => unsubscribe();
  }, [org_id, handler, manager, token]);

}
