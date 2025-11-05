// src/services/api/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    SIGNIN: "/auth/login",
    SIGNUP: "/auth/register",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },
  DEVICE: {
    ROOT: "/devices",
    BY_ID: (id: string) => `/devices/${id}`,
    SENSORS: (id: string) => `devices/${id}/sensors`,
    TELEMETRY: (id: string) => `/devices/${id}/telemetry`,
    STATUS: (id: string) => `devices/${id}/status`,
    COMMANDS: (id: string) => `/devices/${id}/commands`
  },
  CLUSTER: {
    ROOT: "/clusters",
    LIST_DEVICES: (clusterId: string) => `/clusters/${clusterId}/devices`,
    BY_ID: (id: string) => `/clusters/${id}`,
  },
  ORG: {
    ROOT: "/orgs",
    LIST_DEVICES: (orgId: string) => `/orgs/${orgId}/devices`,
    LIST_USERS: (orgId: string) => `/orgs/${orgId}/users`,
    GET_USER_BY_ID: (orgId: string, uid: string) => `/orgs/${orgId}/users/${uid}`
  },
};
