export const topics = {
  registerDevice: {
    pattern: "org/:orgId/cluster/:clusterId/register/:tempId",
    topic: "org/+/cluster/+/register/+",
    publish: (orgId: string, clusterId: string, tempId: string) =>
      `org/${orgId}/cluster/${clusterId}/register/${tempId}`,
    ack: (orgId: string, clusterId: string, tempId: string) =>
      `org/${orgId}/cluster/${clusterId}/register-ack/${tempId}`
  },
  telemetry: {
    pattern: "org/:orgId/cluster/:clusterId/device/:deviceId/telemetry",
    topic: "org/+/cluster/+/device/+/telemetry"
  },
  status: "org/+/cluster/+/device/+/status",
  ack: "org/+/cluster/+/device/+/ack",
};
