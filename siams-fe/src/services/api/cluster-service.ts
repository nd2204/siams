import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Device } from "@/types/device/index";
import type { AddDeviceToClusterRequest, AddDeviceToClusterResponse, Cluster } from "@/types/cluster";
import type { IPaginated } from "@/types/paginated";
import type { CreateClusterRequest } from "./dtos/cluster/create-cluster-request";
import type { CreateClusterResponse } from "./dtos/cluster/create-cluster-response";

export const clusterServices = {
  async getAll(): Promise<Cluster[]> {
    return apiClient.get(ENDPOINTS.CLUSTER.ROOT);
  },

  async getById(id: string): Promise<Cluster> {
    return apiClient.get(ENDPOINTS.CLUSTER.BY_ID(id));
  },

  async listByOrgId(orgId: string, page?: number, perPage?: number): Promise<IPaginated<Cluster>> {
    return apiClient.post(ENDPOINTS.ORG.DEVICES(orgId), { page, perPage });
  },

  async create(req: CreateClusterRequest): Promise<CreateClusterResponse> {
    return apiClient.post(ENDPOINTS.CLUSTER.ROOT, req);
  },

  async listDevices(clusterId: string, page?: number, perPage?: number): Promise<IPaginated<Device>> {
    return apiClient.post(ENDPOINTS.CLUSTER.DEVICES(clusterId), { page, perPage });
  },

  async addDevice(req: AddDeviceToClusterRequest): Promise<AddDeviceToClusterResponse> {
    return apiClient.post(ENDPOINTS.CLUSTER.DEVICE_ID(req.cluster_id, req.device_id), req)
  }
};
