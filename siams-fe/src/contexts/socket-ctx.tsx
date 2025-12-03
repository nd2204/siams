// SocketProvider.tsx
import React, { createContext, useEffect, useRef } from "react";
import { SocketManager } from "@/services/realtime/socket-manager";
import { useAuth } from "@/hooks/use-auth";

export const SocketContext = createContext<SocketManager | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();

  // Single manager instance for the lifetime of this provider
  const managerRef = useRef<SocketManager | null>(null);
  if (!managerRef.current) {
    managerRef.current = new SocketManager();
  }

  // Whenever token changes, update the manager
  useEffect(() => {
    managerRef.current!.setAuthToken(token);
  }, [token]);

  return (
    <SocketContext.Provider value={managerRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

