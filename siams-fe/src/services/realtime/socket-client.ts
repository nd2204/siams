import { io, Socket as IOSocket } from "socket.io-client"

let socket: IOSocket | null = null;

export const createSocket = (token: string) => {
  // Create socket only once
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      autoConnect: false,
      auth: { token },
    });
  } else {
    // Update token if changed
    socket.auth = { token };
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
