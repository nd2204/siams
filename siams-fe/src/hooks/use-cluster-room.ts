// use-cluster-room.ts
import { useEffect } from "react";
import { useSocketManager } from "./use-socket-manager.ts";
import { useAuth } from "./use-auth.ts";
import { SubscribeClusterRoomRequest, type MessageHandler } from "@/services/realtime/rooms.ts";

export function useClusterRoom(cluster_id: string, handler: MessageHandler) {
  const manager = useSocketManager();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      // Not logged in: do nothing
      return;
    }

    const request = new SubscribeClusterRoomRequest(cluster_id, handler);
    const unsubscribe = manager.subscribeRoom(request);

    return () => unsubscribe();
  }, [cluster_id, handler, manager, token]);

}
