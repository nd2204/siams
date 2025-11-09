import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Cluster, Device } from "@/types/device";
import type { IPaginated } from "@/types/paginated";
import type { OrganizationUserData } from "./dtos/auth/user-data";
import type { CreateOrganizationRequest } from "./dtos/org/create-from-user-request";

export const orgServices = {
  async getById(id: string): Promise<Cluster> {
    return apiClient.get<Cluster>(ENDPOINTS.DEVICE.BY_ID(id));
  },

  async create(req: CreateOrganizationRequest): Promise<OrganizationUserData> {
    return apiClient.post<OrganizationUserData>(ENDPOINTS.ORG.ROOT, req)
  },

  async listCluster(orgId: string, page?: number, perPage?: number): Promise<IPaginated<Cluster>> {
    return apiClient.post<IPaginated<Cluster>>(ENDPOINTS.ORG.LIST_CLUSTERS(orgId), { page, perPage });
  },

  async listDevices(orgId: string, page?: number, perPage?: number): Promise<IPaginated<Device>> {
    return apiClient.post<IPaginated<Device>>(ENDPOINTS.ORG.LIST_DEVICES(orgId), { page, perPage });
  },
};
