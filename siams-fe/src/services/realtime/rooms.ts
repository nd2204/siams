export const ROOM_EVENTS = {
  device: {
    join: "join_device",
    joined: "joined_device",
    leave: "leave_device"
  },
  cluster: {
    join: "join_cluster",
    joined: "joined_cluster",
    leave: "leave_cluster"
  },
  org: {
    join: "join_org",
    joined: "joined_org",
    leave: "leave_org"
  },
} as const

export type RoomType = keyof typeof ROOM_EVENTS
export type MessageHandler = (event: any, payload: any) => void;

export interface SubscribeRoomRequest<T> {
  room_type: RoomType;
  event_name?: string;
  handler: MessageHandler;
  payload: T
}

// Listen to all event in device scope
export class SubscribeDeviceRoomRequest implements SubscribeRoomRequest<{
  device_id: string;
}> {
  public room_type: RoomType = "device"
  public handler: MessageHandler = () => { };
  public payload: { device_id: string; } = {
    device_id: ''
  };

  constructor(device_id: string, handler: MessageHandler) {
    this.handler = handler;
    this.payload.device_id = device_id
  }
}

// Listen to all event in cluster scope
export class SubscribeClusterRoomRequest implements SubscribeRoomRequest<{
  cluster_id: string;
}> {
  public room_type: RoomType = "cluster"
  public handler: MessageHandler = () => { };
  public payload: { cluster_id: string; } = {
    cluster_id: ''
  };

  constructor(cluster_id: string, handler: MessageHandler) {
    this.handler = handler;
    this.payload.cluster_id = cluster_id;
  }
}

// Listen to all event in organization scope
export class SubscribeOrgRoomRequest implements SubscribeRoomRequest<{
  org_id: string
}> {
  public handler: MessageHandler = () => { };
  public room_type: RoomType = "org"
  public payload: { org_id: string } = {
    org_id: ''
  };

  constructor(org_id: string, handler: MessageHandler) {
    this.payload.org_id = org_id
    this.handler = handler;
  }
}
