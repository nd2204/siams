import { SocketContext } from "@/contexts/socket-ctx";
import type { SocketManager } from "@/services/realtime/socket-manager";
import { useContext } from "react";

export function useSocketManager(): SocketManager {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketManager must be used inside <SocketProvider />");
  return ctx;
}
