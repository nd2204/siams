// socket-manager.ts
import { ROOM_EVENTS, type MessageHandler, type RoomType, type SubscribeRoomRequest } from "@/services/realtime/rooms";
import { createSocket, disconnectSocket, getSocket } from "./socket-client";

interface RoomInfo {
  count: number;
  handlers: Set<MessageHandler>;
}

export class SocketManager {
  private token: string | null = null;
  private rooms: Map<RoomType, RoomInfo> = new Map();
  private totalRefs = 0;

  setAuthToken(token: string | null) {
    if (this.token === token) return;

    // If token changes, drop the old socket completely
    if (getSocket()) {
      disconnectSocket();
    }

    this.token = token;
    this.rooms.clear();
    this.totalRefs = 0;
  }

  private ensureSocket() {
    if (!this.token) throw new Error("SocketManager: no auth token set");
    return getSocket() || createSocket(this.token);
  }

  /** Called when *any* component wants to listen to a room */
  subscribeRoom(request: SubscribeRoomRequest<any>) {
    const socket = this.ensureSocket()
    // If this is the very first subscription anywhere: connect the socket.
    if (this.totalRefs === 0) {
      socket.connect()
    }
    this.totalRefs++;

    const room_type = request.room_type;
    const room_subscribe_payload = request.payload;
    const room_event = ROOM_EVENTS[room_type]
    const handler = request.handler

    let info = this.rooms.get(room_type);
    if (!info) {
      info = { count: 0, handlers: new Set() };
      this.rooms.set(room_type, info);
      socket.emit(room_event.join, room_subscribe_payload, (res: any) => {
        console.log("[SocketManager] room_joined", res)
      })
    }
    console.log(info);

    info.count++;
    info.handlers.add(handler);

    // Listen for messages for this room
    // const socketEventName = `room:${room_type}`;

    const socketListener = (event: any, payload: any) => {
      // fan-out to all handlers subscribed to this room
      for (const fn of info!.handlers) fn(event, payload);
    };

    // socket.on(socketEventName, socketListener);
    socket.onAny(socketListener);

    const unsubscribe = () => {
      const currentInfo = this.rooms.get(room_type);
      if (!currentInfo) return;

      currentInfo.count--;
      currentInfo.handlers.delete(handler);
      this.totalRefs--;

      // socket.off(socketEventName, socketListener);
      socket.offAny(socketListener);

      // If no one is listening to this room anymore, leave it
      if (currentInfo.count <= 0) {
        socket.emit(room_event.leave, room_subscribe_payload);
        this.rooms.delete(room_type);
      }

      // If literally no rooms are referenced by any component, disconnect
      if (this.totalRefs === 0) {
        socket.disconnect();
      }
    }

    // Return unsubscribe function
    return unsubscribe;
  }
}
