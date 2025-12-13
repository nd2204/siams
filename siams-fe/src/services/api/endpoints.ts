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
    TELEMETRY: (id: string, sensorId: string) => `/devices/${id}/sensors/${sensorId}/telemetry`,
    STATUS: (id: string) => `devices/${id}/status`,
    COMMANDS: (id: string) => `/devices/${id}/commands`,
    EVENTS: (id: string) => `/devices/${id}/events`,
  },
  CLUSTER: {
    ROOT: "/clusters",
    BY_ID: (id: string) => `/clusters/${id}`,
    DEVICES: (id: string) => `/clusters/${id}/devices`,
    DEVICE_ID: (id: string, device_id: string) => `/clusters/${id}/devices/${device_id}`,
  },
  ORG: {
    ROOT: "/orgs",
    DEVICES: (orgId: string) => `/orgs/${orgId}/devices`,
    CLUSTERS: (orgId: string) => `/orgs/${orgId}/clusters`,
    USERS: (orgId: string) => `/orgs/${orgId}/users`,
    USER_BY_ID: (orgId: string, uid: string) => `/orgs/${orgId}/users/${uid}`,
    INVITE: (orgId: string) => `/orgs/${orgId}/invite`
  },
  USER: {
    ROOT: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
  MISC: {
    VERIFY: "/verify"
  }
};
