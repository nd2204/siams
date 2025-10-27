// src/services/api/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    SIGNIN: "/auth/login",
    SIGNUP: "/auth/register",
    ME: "/auth/me",
  },
  DEVICE: {
    ROOT: "/devices",
    BY_ID: (id: string) => `/devices/${id}`,
    SENSORS: (id: string) => `devices/${id}/sensors`,
    TELEMETRY: (id: string) => `/devices/${id}/telemetry`,
    COMMANDS: (id: string) => `/devices/${id}/commands`
  },
  CLUSTER: {
    ROOT: "/clusters",
    BY_ID: (id: string) => `/clusters/${id}`,
  },
};
