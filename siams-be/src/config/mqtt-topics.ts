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
    "org/:orgId/register/:tempId",
    "org/+/register/+",
  ),
  deviceRegisterAck: defineTopic(
    "org/:orgId/register-ack/:tempId",
    "org/+/register-ack/+"
  ),
  deviceVerify: defineTopic(
    "org/:orgId/device/:deviceId/verify",
    "org/+/device/+/verify",
  ),
  deviceVerifyAck: defineTopic(
    "org/:orgId/device/:deviceId/verify-ack",
    "org/+/device/+/verify-ack",
  ),
  deviceCommand: defineTopic(
    "org/:orgId/device/:deviceId/command",
    "org/+/device/+/command",
  ),
  deviceCommandAck: defineTopic(
    "org/:orgId/device/:deviceId/command-ack",
    "org/+/device/+/command-ack",
  ),
  deviceStatus: defineTopic(
    "org/:orgId/device/:deviceId/status",
    "org/+/device/+/status",
  ),
  deviceTelemetry: defineTopic(
    "org/:orgId/device/:deviceId/telemetry",
    "org/+/device/+/telemetry",
  ),
  deviceConfig: defineTopic(
    "org/:orgId/device/:deviceId/config",
    "org/+/device/+/config",
  ),
  deviceConfigAck: defineTopic(
    "org/:orgId/device/:deviceId/config-ack",
    "org/+/device/+/config-ack",
  ),
  deviceConfigSync: defineTopic(
    "org/:orgId/device/:deviceId/config/syncack",
    "org/+/device/+/config/sync",
  ),
  deviceConfigSyncAck: defineTopic(
    "org/:orgId/device/:deviceId/config/sync-ack",
    "org/+/device/+/config/sync-ack",
  ),
  deviceEvent: defineTopic(
    "org/:orgId/device/:deviceId/event",
    "org/+/device/+/event",
  ),
  deviceEventAck: defineTopic(
    "org/:orgId/device/:deviceId/event-ack",
    "org/+/device/+/event-ack",
  )
}

