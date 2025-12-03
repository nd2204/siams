// src/infra/realtime/SocketIoRealtimeClient.ts
import { Server as IOServer, Socket } from "socket.io";
import { Server as HttpServer } from "node:http"
import { IRealtimeClient, RealtimeMessage } from "@domain/interfaces/realtime-client";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { ILogger } from "@shared/interfaces";
import { UserClaims } from "@feature/user/dtos/user-claims";
import { IAuthService } from "@domain/services/auth-service";
import { IEventBus } from "@domain/interfaces/events";
import { DeviceRegisteredEventHandler } from "./handlers/device-registered-handler";
import { DeviceTelemetryReceivedEventHandler } from "./handlers/device-telemetry-received-handler";
import { TelemetryGroupDto } from "@feature/device/telemetry/dtos/telemtry-dto";
import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { DeviceStatusReceivedEventHandler } from "./handlers/device-status-received-handler";

interface AuthenticatedSocket extends Socket {
  user: UserClaims;
  subscriptions: {
    organizations: Set<string>;
    clusters: Set<string>;
    devices: Set<string>;
  };
}

export class SocketIoRealtimeClient implements IRealtimeClient {
  private io: IOServer;
  private clientTracker = {
    organizations: new Map<string, Set<string>>(), // orgId -> Set<socketId>
    clusters: new Map<string, Set<string>>(),      // clusterId -> Set<socketId>
    devices: new Map<string, Set<string>>()        // deviceId -> Set<socketId>
  };

  constructor(
    private readonly authService: IAuthService,
    private readonly logger: ILogger,
    private readonly eventBus: IEventBus,
    private readonly verifyToken: (token: string) => AuthResponse["user"]
  ) {
    this.eventBus.subscribe(
      DeviceEventTypeConstants.DeviceRegistered,
      new DeviceRegisteredEventHandler(this)
    );
    this.eventBus.subscribe(
      DeviceEventTypeConstants.DeviceTelemetryReceived,
      new DeviceTelemetryReceivedEventHandler(this)
    );
    this.eventBus.subscribe(
      DeviceEventTypeConstants.DeviceStatusReceived,
      new DeviceStatusReceivedEventHandler(this)
    )
  }

  start(httpServer: HttpServer) {
    this.io = new IOServer(httpServer, {
      cors: {
        origin: [
          'http://127.0.0.1:33445',
          'http://localhost:33445',
          'http://192.168.1.16:33445',
        ],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      }
    });

    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        const user = this.verifyToken(token);
        if (!user) return next(new Error("unauthorized"));

        socket.user = user;
        socket.subscriptions = {
          organizations: new Set(),
          clusters: new Set(),
          devices: new Set()
        };

        next();
      } catch (error) {
        next(new Error("Invalid authentication"));
      }
    });

    this.io.on("connection", (socket: AuthenticatedSocket) => {
      this.logger.info(`Client connected: ${socket.id} (${socket.user.id})`);

      // Handle cluster subscription
      socket.on("join_cluster", async ({ cluster_id }) => {
        try {
          const data = await this.authService.canAccessCluster(socket.user.id, cluster_id)
          if (!data) {
            return socket.emit("error", { message: "Forbidden", code: "FORBIDDEN" });
          }

          const room = this.roomForCluster(data.org.id, data.cluster.id);
          await socket.join(room);

          // Track subscription
          socket.subscriptions.clusters.add(cluster_id);
          if (!this.clientTracker.clusters.has(cluster_id)) {
            this.clientTracker.clusters.set(cluster_id, new Set());
          }
          this.clientTracker.clusters.get(cluster_id)?.add(socket.id);

          socket.emit("joined_cluster", {
            orgId: data.org.id,
            clusterId: cluster_id,
            activeClients: this.clientTracker.clusters.get(cluster_id)?.size || 1
          });
        } catch (error) {
          this.logger.error(`Error joining cluster: ${error}`);
          socket.emit("error", { message: "Failed to join cluster", code: "JOIN_FAILED" });
        }
      });

      // Handle org subscription
      socket.on("join_org", async ({ org_id }) => {
        try {
          const data = await this.authService.canAccessOrg(socket.user.id, org_id)
          if (!data) {
            return socket.emit("error", { message: "Forbidden", code: "FORBIDDEN" });
          }

          const room = this.roomForOrg(data.id);
          await socket.join(room);

          // Track subscription
          socket.subscriptions.organizations.add(org_id);
          if (!this.clientTracker.organizations.has(org_id)) {
            this.clientTracker.organizations.set(org_id, new Set());
          }
          this.clientTracker.organizations.get(org_id)?.add(socket.id);

          socket.emit("joined_org", {
            orgId: data.id,
            activeClients: this.clientTracker.organizations.get(org_id)?.size || 1
          });
        } catch (error) {
          this.logger.error(`Error joining device: ${error}`);
          socket.emit("error", { message: "Failed to join device", code: "JOIN_FAILED" });
        }
      });

      // Handle device subscription
      socket.on("join_device", async ({ device_id }, callback) => {
        try {
          this.logger.info(`[Socket] Device join request - socket: ${socket.id}, deviceId: ${device_id}, userId: ${socket.user.id}`);

          const data = await this.authService.canAccessDevice(socket.user.id, device_id)
          if (!data) {
            this.logger.warn(`[Socket] Access denied for device ${device_id} - user ${socket.user.id}`);
            return socket.emit("error", { message: "Forbidden", code: "FORBIDDEN" });
          }

          const room = this.roomForDevice(data.org.id, device_id);
          await socket.join(room);
          this.logger.info(`[Socket] Socket ${socket.id} joined room: ${room}`);

          // Track subscription
          socket.subscriptions.devices.add(device_id);
          if (!this.clientTracker.devices.has(device_id)) {
            this.clientTracker.devices.set(device_id, new Set());
          }
          this.clientTracker.devices.get(device_id)?.add(socket.id);

          const activeCount = this.clientTracker.devices.get(device_id)?.size || 1;
          this.logger.info(`[Socket] Device ${device_id} now has ${activeCount} active subscribers`);

          callback({
            orgId: data.org.id,
            deviceId: device_id,
            activeClients: activeCount
          })
        } catch (error) {
          this.logger.error(`[Socket] Error joining device: ${error}`);
          // socket.emit("error", { message: "Failed to join device", code: "JOIN_FAILED" });
          callback(error)
        }
      });

      // Handle disconnection and cleanup
      socket.on("disconnect", () => {
        this.logger.info(`Client disconnected: ${socket.id}`);

        // Cleanup org subscriptions
        socket.subscriptions.organizations.forEach(orgId => {
          this.clientTracker.organizations.get(orgId)?.delete(socket.id);
          if (this.clientTracker.organizations.get(orgId)?.size === 0) {
            this.clientTracker.organizations.delete(orgId);
          }
        });

        // Cleanup cluster subscriptions
        socket.subscriptions.clusters.forEach(clusterId => {
          this.clientTracker.clusters.get(clusterId)?.delete(socket.id);
          if (this.clientTracker.clusters.get(clusterId)?.size === 0) {
            this.clientTracker.clusters.delete(clusterId);
          }
        });

        // Cleanup device subscriptions
        socket.subscriptions.devices.forEach(deviceId => {
          this.clientTracker.devices.get(deviceId)?.delete(socket.id);
          if (this.clientTracker.devices.get(deviceId)?.size === 0) {
            this.clientTracker.devices.delete(deviceId);
          }
        });
      });
    });

    this.logger.info("WebSocket server started");
  }

  // --- Outbound publishing ---
  async publishTelemetry(message: RealtimeMessage<TelemetryGroupDto>): Promise<void> {
    // Emit to both cluster and device rooms for subscribers at different levels
    const roomsToEmit: string[] = [];
    message.clusterId && roomsToEmit.push(this.roomForCluster(message.orgId, message.clusterId));
    message.deviceId && roomsToEmit.push(this.roomForDevice(message.orgId, message.deviceId));
    if (roomsToEmit.length > 0) {
      // this.logger.info({ msg: `${JSON.stringify(this.clientTracker.devices.get(message.deviceId!), null, 2)}` });
      // this.logger.info({ msg: `Publishing event [${message.eventType}] to rooms: ${JSON.stringify(roomsToEmit.join(", "), null, 2)}`, obj: message });
      this.io
        .to(roomsToEmit)
        .emit(message.eventType, message);
    }
  }

  async publishDeviceEvent(message: RealtimeMessage): Promise<void> {
    const rooms: string[] = [this.roomForOrg(message.orgId)];
    message.clusterId && rooms.push(this.roomForCluster(message.orgId, message.clusterId))
    message.deviceId && rooms.push(this.roomForDevice(message.orgId, message.deviceId))
    this.io.to(rooms).emit(message.eventType, message);
  }

  private roomForOrg(orgId: string) {
    return `org:${orgId}`;
  }

  private roomForCluster(orgId: string, clusterId: string) {
    return `org:${orgId}:cluster:${clusterId}`;
  }

  private roomForDevice(orgId: string, deviceId: string) {
    return `org:${orgId}:device:${deviceId}`;
  }
}
