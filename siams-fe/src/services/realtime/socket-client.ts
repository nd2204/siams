import { io, Socket as IOSocket } from "socket.io-client"

let socket: IOSocket | null = null;

const WS_BASE_URL = import.meta.env.VITE_BE_HOST;

export const createSocket = (token: string) => {
  // Create socket only once
  if (!socket) {
    socket = io(WS_BASE_URL, {
      extraHeaders: {
        "ngrok-skip-browser-warning": "true"
      },
      autoConnect: false,
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Setup connection listeners
    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error);
    });
  } else {
    // Update token if already connected
    const currentToken = (socket.auth as any)?.token;
    if (currentToken !== token) {
      socket.auth = { token };
      // Reconnect with new token
      if (socket.connected) {
        socket.disconnect();
        socket.connect();
      }
    }
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = () => socket?.connected ?? false;
