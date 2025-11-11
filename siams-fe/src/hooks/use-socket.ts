// src/hooks/useSocket.ts
import { useEffect, useState } from "react";
import { getSocket } from "@/services/realtime/socket-client";
import type { Socket } from "socket.io-client";

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(getSocket());

  useEffect(() => {
    setSocket(getSocket());
  }, []);

  return socket;
}
