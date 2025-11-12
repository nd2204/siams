// src/infra/realtime/SocketIoRealtimeClient.ts
import { Server as IOServer, Socket } from "socket.io";
import { Server as HttpServer } from "node:http"
import { IRealtimeClient, RealtimeMessage } from "@domain/interfaces/realtime-client";
import { DeviceTelemetry } from "@domain/entities";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { IClusterRepository, IDeviceRepository, IOrganizationUserRepository } from "@domain/repositories";
import { ILogger } from "@shared/interfaces";
import { UserClaims } from "@feature/user/dtos/user-claims";
import { IAuthService } from "@domain/services/auth-service";
import { IEventBus } from "@domain/interfaces/events";
import { DeviceRegisteredEventHandler } from "./handlers/device-registered-handler";
import { DeviceRegisteredEvent } from "@domain/events/device-registered-event";
import { DeviceTelemetryReceivedEvent } from "@domain/events/device-telemetry-received-event";
import { DeviceTelemetryReceivedEventHandler } from "./handlers/device-telemetry-received-handler";
import { TelemetryGroupDto } from "@feature/device/dtos/telemtry-dto";

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
      DeviceRegisteredEvent.eventName,
      new DeviceRegisteredEventHandler(this)
    );
    this.eventBus.subscribe(
      DeviceTelemetryReceivedEvent.eventName,
      new DeviceTelemetryReceivedEventHandler(this)
    );
  }

  start(httpServer: HttpServer) {
    this.io = new IOServer(httpServer, {
      cors: {
        origin: process.env.FE_HOST || "*",
        methods: ["GET", "POST"]
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
      socket.on("joinCluster", async ({ clusterId }) => {
        try {
          const data = await this.authService.canAccessCluster(socket.user.id, clusterId)
          if (!data) {
            return socket.emit("error", { message: "Forbidden", code: "FORBIDDEN" });
          }

          const room = this.roomForCluster(data.org.id, data.cluster.id);
          await socket.join(room);

          // Track subscription
          socket.subscriptions.clusters.add(clusterId);
          if (!this.clientTracker.clusters.has(clusterId)) {
            this.clientTracker.clusters.set(clusterId, new Set());
          }
          this.clientTracker.clusters.get(clusterId)?.add(socket.id);

          socket.emit("joinedCluster", {
            orgId: data.org.id,
            clusterId,
            activeClients: this.clientTracker.clusters.get(clusterId)?.size || 1
          });
        } catch (error) {
          this.logger.error(`Error joining cluster: ${error}`);
          socket.emit("error", { message: "Failed to join cluster", code: "JOIN_FAILED" });
        }
      });

      // Handle org subscription
      socket.on("joinOrg", async ({ orgId }) => {
        try {
          const data = await this.authService.canAccessOrg(socket.user.id, orgId)
          if (!data) {
            return socket.emit("error", { message: "Forbidden", code: "FORBIDDEN" });
          }

          const room = this.roomForOrg(data.id);
          await socket.join(room);

          // Track subscription
          socket.subscriptions.organizations.add(orgId);
          if (!this.clientTracker.organizations.has(orgId)) {
            this.clientTracker.organizations.set(orgId, new Set());
          }
          this.clientTracker.organizations.get(orgId)?.add(socket.id);

          socket.emit("joinedOrg", {
            orgId: data.id,
            activeClients: this.clientTracker.organizations.get(orgId)?.size || 1
          });
        } catch (error) {
          this.logger.error(`Error joining device: ${error}`);
          socket.emit("error", { message: "Failed to join device", code: "JOIN_FAILED" });
        }
      });


      // Handle device subscription
      socket.on("joinDevice", async ({ deviceId }) => {
        try {
          this.logger.info(`[Socket] Device join request - socket: ${socket.id}, deviceId: ${deviceId}, userId: ${socket.user.id}`);
          
          const data = await this.authService.canAccessDevice(socket.user.id, deviceId)
          if (!data) {
            this.logger.warn(`[Socket] Access denied for device ${deviceId} - user ${socket.user.id}`);
            return socket.emit("error", { message: "Forbidden", code: "FORBIDDEN" });
          }

          const room = this.roomForDevice(data.org.id, data.cluster.id, deviceId);
          await socket.join(room);
          this.logger.info(`[Socket] Socket ${socket.id} joined room: ${room}`);

          // Track subscription
          socket.subscriptions.devices.add(deviceId);
          if (!this.clientTracker.devices.has(deviceId)) {
            this.clientTracker.devices.set(deviceId, new Set());
          }
          this.clientTracker.devices.get(deviceId)?.add(socket.id);

          const activeCount = this.clientTracker.devices.get(deviceId)?.size || 1;
          this.logger.info(`[Socket] Device ${deviceId} now has ${activeCount} active subscribers`);

          socket.emit("joinedDevice", {
            orgId: data.org.id,
            clusterId: data.cluster.id,
            deviceId,
            activeClients: activeCount
          });
        } catch (error) {
          this.logger.error(`[Socket] Error joining device: ${error}`);
          socket.emit("error", { message: "Failed to join device", code: "JOIN_FAILED" });
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
    
    if (message.clusterId) {
      roomsToEmit.push(this.roomForCluster(message.orgId, message.clusterId));
    }
    
    if (message.deviceId && message.clusterId) {
      roomsToEmit.push(this.roomForDevice(message.orgId, message.clusterId, message.deviceId));
    }

    if (roomsToEmit.length > 0) {
      this.logger.debug(`Publishing telemetry to rooms: ${roomsToEmit.join(", ")}`);
      this.io
        .to(roomsToEmit)
        .emit(
          DeviceTelemetryReceivedEvent.eventName,
          message
        );
    }
  }

  async publishEvent(payload: RealtimeMessage): Promise<void> {
    const rooms: string[] = [];
    rooms.push(this.roomForOrg(payload.orgId))
    payload.clusterId && rooms.push(this.roomForCluster(payload.orgId, payload.clusterId))
    payload.deviceId && rooms.push(this.roomForDevice(payload.orgId, payload.clusterId!, payload.deviceId))
    this.io.to(rooms).emit("device.event", payload);
  }

  private roomForOrg(orgId: string) {
    return `org:${orgId}`;
  }

  private roomForCluster(orgId: string, clusterId: string) {
    return `org:${orgId}:cluster:${clusterId}`;
  }

  private roomForDevice(orgId: string, clusterId: string, deviceId: string) {
    return `org:${orgId}:cluster:${clusterId}:device:${deviceId}`;
  }

  private roomForSensors(orgId: string, clusterId: string, deviceId: string, sensorId: string) {
    return `org:${orgId}:cluster:${clusterId}:device:${deviceId}:sensor:${sensorId}`;
  }
}
