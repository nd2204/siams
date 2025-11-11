// src/infra/realtime/SocketIoRealtimeClient.ts
import { Server as IOServer, Socket } from "socket.io";
import { Server as HttpServer } from "node:http"
import { IRealtimeClient, RealtimeMessage } from "@domain/interfaces/realtime-client";
import { DeviceTelemetry } from "@domain/entities";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { IClusterRepository, IDeviceRepository, IOrganizationUserRepository } from "@domain/repositories";
import { ILogger } from "@shared/interfaces";
import { UserClaims } from "@feature/user/dtos/user-claims";

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
    private readonly orgUserRepo: IOrganizationUserRepository,
    private readonly clusterRepo: IClusterRepository,
    private readonly deviceRepo: IDeviceRepository,
    private readonly logger: ILogger,
    private readonly verifyToken: (token: string) => AuthResponse["user"]
  ) { }

  async canAccessOrg(user: UserClaims, orgId: string): Promise<boolean> {
    const orgUser = await this.orgUserRepo.findOneBy({ id: orgId, userId: user.id });
    if (!orgUser) return false

    return true
  }

  async canAccessCluster(user: AuthResponse["user"], orgId: string, clusterId: string): Promise<boolean> {
    if (!this.canAccessOrg(user, orgId)) return false

    const cluster = await this.clusterRepo.findOneBy({ id: clusterId });
    if (!cluster || cluster.orgId !== orgId) return false

    return true
  }

  async canAccessDevice(user: AuthResponse["user"], orgId: string, clusterId: string, deviceId: string): Promise<boolean> {
    if (!this.canAccessOrg(user, orgId)) return false
    if (!this.canAccessCluster(user, orgId, clusterId)) return false

    const device = await this.deviceRepo.findOneBy({ id: deviceId });
    if (!device || device.clusterId !== clusterId) return false

    return true
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
      socket.on("joinCluster", async ({ orgId, clusterId }) => {
        try {
          if (!await this.canAccessCluster(socket.user, orgId, clusterId)) {
            return socket.emit("error", { message: "Forbidden", code: "FORBIDDEN" });
          }

          const room = this.roomForCluster(orgId, clusterId);
          await socket.join(room);

          // Track subscription
          socket.subscriptions.clusters.add(clusterId);
          if (!this.clientTracker.clusters.has(clusterId)) {
            this.clientTracker.clusters.set(clusterId, new Set());
          }
          this.clientTracker.clusters.get(clusterId)?.add(socket.id);

          socket.emit("joinedCluster", {
            orgId,
            clusterId,
            activeClients: this.clientTracker.clusters.get(clusterId)?.size || 1
          });
        } catch (error) {
          this.logger.error(`Error joining cluster: ${error}`);
          socket.emit("error", { message: "Failed to join cluster", code: "JOIN_FAILED" });
        }
      });

      // Handle device subscription
      socket.on("joinDevice", async ({ orgId, clusterId, deviceId }) => {
        try {
          if (!await this.canAccessDevice(socket.user, orgId, clusterId, deviceId)) {
            return socket.emit("error", { message: "Forbidden", code: "FORBIDDEN" });
          }

          const room = this.roomForDevice(orgId, clusterId, deviceId);
          await socket.join(room);

          // Track subscription
          socket.subscriptions.devices.add(deviceId);
          if (!this.clientTracker.devices.has(deviceId)) {
            this.clientTracker.devices.set(deviceId, new Set());
          }
          this.clientTracker.devices.get(deviceId)?.add(socket.id);

          socket.emit("joinedDevice", {
            orgId,
            clusterId,
            deviceId,
            activeClients: this.clientTracker.devices.get(deviceId)?.size || 1
          });
        } catch (error) {
          this.logger.error(`Error joining device: ${error}`);
          socket.emit("error", { message: "Failed to join device", code: "JOIN_FAILED" });
        }
      });

      // Handle disconnection and cleanup
      socket.on("disconnect", () => {
        this.logger.info(`Client disconnected: ${socket.id}`);

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
  async publishTelemetry(message: RealtimeMessage<DeviceTelemetry>): Promise<void> {
    this.io
      .to(this.roomForCluster(message.eventType, message.clusterId))
      .volatile.emit("telemetry", message);
  }

  async publishEvent(payload: RealtimeMessage): Promise<void> {
    this.io
      .to(this.roomForCluster(payload.orgId, payload.clusterId))
      .emit("event", payload);
  }

  private roomForCluster(orgId: string, clusterId: string) {
    return `org:${orgId}:cluster:${clusterId}`;
  }

  private roomForDevice(orgId: string, clusterId: string, deviceId: string) {
    return `org:${orgId}:cluster:${clusterId}:device:${deviceId}`;
  }
}
