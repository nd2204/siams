import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Device } from "@/types/device/index";
import type { Cluster } from "@/types/cluster";
import type { IPaginated } from "@/types/paginated";
import type { CreateOrganizationRequest, CreateOrganizationResponse, InviteUserToOrgRequest, InviteUserToOrgResponse, OrganizationUser } from "@/types/organization";

export const orgServices = {
  async getById(id: string): Promise<Cluster> {
    return apiClient.get(ENDPOINTS.DEVICE.BY_ID(id));
  },

  async create(req: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return apiClient.post(ENDPOINTS.ORG.ROOT, req)
  },

  async listCluster(orgId: string, page?: number, perPage?: number): Promise<IPaginated<Cluster>> {
    return apiClient.post(ENDPOINTS.ORG.CLUSTERS(orgId), { page, perPage });
  },

  async listDevices(orgId: string, page?: number, perPage?: number): Promise<IPaginated<Device>> {
    return apiClient.post(ENDPOINTS.ORG.DEVICES(orgId), { page, perPage });
  },

  async listOrgUsers(orgId: string, page?: number, perPage?: number): Promise<IPaginated<OrganizationUser>> {
    return apiClient.post(ENDPOINTS.ORG.USERS(orgId), { page, perPage })
  },

  async inviteUsers(req: InviteUserToOrgRequest): Promise<InviteUserToOrgResponse> {
    return apiClient.post(ENDPOINTS.ORG.INVITE(req.orgId), req)
  },
};
