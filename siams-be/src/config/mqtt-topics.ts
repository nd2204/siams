import { parseTopic } from "@infra/utils/mqtt/parse-topic";

function defineTopic<P extends string, T extends string>(
  pattern: P,
  topic: T
) {
  // const paramNames = [...pattern.matchAll(/:([a-zA-Z0-9_]+)/g)].map(m => m[1]);
  const paramNames = Object.keys(parseTopic(topic, pattern))

  return {
    pattern,
    topic,
    create: (params: Record<string, string>) => {
      let result: string = pattern;
      for (const name of paramNames) {
        result = result.replace(`:${name}`, params[name]);
      }
      return result;
    },
  };
}

export const topics = {
  deviceRegister: defineTopic(
    "org/:orgId/cluster/:clusterId/register/:tempId",
    "org/+/cluster/+/register/+",
  ),
  deviceRegisterAck: defineTopic(
    "org/:orgId/cluster/:clusterId/register-ack/:tempId",
    "org/+/cluster/+/register-ack/+"
  ),
  deviceVerify: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/verify",
    "org/+/cluster/+/device/+/verify",
  ),
  deviceVerifyAck: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/verify-ack",
    "org/+/cluster/+/device/+/verify-ack",
  ),
  deviceCommand: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/command",
    "org/+/cluster/+/device/+/command",
  ),
  deviceCommandAck: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/command-ack",
    "org/+/cluster/+/device/+/command-ack",
  ),
  deviceStatus: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/status",
    "org/+/cluster/+/device/+/status",
  ),
  deviceTelemetry: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/telemetry",
    "org/+/cluster/+/device/+/telemetry",
  ),
  deviceConfig: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/config",
    "org/+/cluster/+/device/+/config",
  ),
  deviceConfigAck: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/config-ack",
    "org/+/cluster/+/device/+/config-ack",
  ),
  deviceConfigSync: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/config/syncack",
    "org/+/cluster/+/device/+/config/sync",
  ),
  deviceConfigSyncAck: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/config/sync-ack",
    "org/+/cluster/+/device/+/config/sync-ack",
  ),
  deviceEvent: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/event",
    "org/+/cluster/+/device/+/event",
  ),
  deviceEventAck: defineTopic(
    "org/:orgId/cluster/:clusterId/device/:deviceId/event-ack",
    "org/+/cluster/+/device/+/event-ack",
  )
}
