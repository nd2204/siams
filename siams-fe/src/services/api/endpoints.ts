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
    ACTUATORS: (id: string) => `devices/${id}/actuators`,
    TELEMETRY: (id: string, sensorId: string) => `/devices/${id}/sensors/${sensorId}/telemetry/$`,
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
    LIST_CLUSTERS: (orgId: string) => `/orgs/${orgId}/clusters`,
    LIST_USERS: (orgId: string) => `/orgs/${orgId}/users`,
    GET_USER_BY_ID: (orgId: string, uid: string) => `/orgs/${orgId}/users/${uid}`
  },
};
