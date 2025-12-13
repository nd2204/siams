import { DeviceEventType, DeviceEventTypeConstants } from "@domain/entities/device-event";
import {
  DeviceOnlineEventPayload,
  DeviceOfflineEventPayload,
  DeviceRegisteredEventPayload,
  DeviceStatusReceivedEventPayload,
  DeviceTelemetryReceivedEventPayload,
  DeviceRuleTriggeredEventPayload,
  DeviceRegisteredEvent,
  DeviceStatusReceivedEvent,
  DeviceTelemetryReceivedEvent,
  DeviceRuleTriggeredEvent,
  DeviceOnlineEvent,
  DeviceOfflineEvent
} from "@domain/events/device";
import { DeviceCommandAckEvent, DeviceCommandAckEventPayload } from "./device/device-command-ack-event";

export const EventTypeConstants = {
  ...DeviceEventTypeConstants
} as const

export type EventType = typeof EventTypeConstants[keyof typeof EventTypeConstants]

export const DomainEventPayloadMap = {
  [DeviceEventTypeConstants.DeviceRegistered]: {} as DeviceRegisteredEventPayload,
  [DeviceEventTypeConstants.DeviceTelemetryReceived]: {} as DeviceTelemetryReceivedEventPayload,
  [DeviceEventTypeConstants.DeviceStatusReceived]: {} as DeviceStatusReceivedEventPayload,
  [DeviceEventTypeConstants.DeviceStatusOnline]: {} as DeviceOnlineEventPayload,
  [DeviceEventTypeConstants.DeviceStatusOffline]: {} as DeviceOfflineEventPayload,
  [DeviceEventTypeConstants.DeviceRuleTriggered]: {} as DeviceRuleTriggeredEventPayload,
  [DeviceEventTypeConstants.DeviceCommandAck]: {} as DeviceCommandAckEventPayload
} satisfies Record<EventType, unknown>;

export type DeviceEventPayload<T extends DeviceEventType> =
  (typeof DomainEventPayloadMap)[T];

export class DeviceEventFactory {
  static create<T extends DeviceEventType>(type: T, payload: DeviceEventPayload<T>) {
    switch (type) {
      case "device.command.ack": return new DeviceCommandAckEvent(
        payload as DeviceCommandAckEventPayload
      );
      case "device.registered": return new DeviceRegisteredEvent(
        payload as DeviceRegisteredEventPayload
      );
      case "device.status": return new DeviceStatusReceivedEvent(
        payload as DeviceStatusReceivedEventPayload
      );
      case "device.telemetry": return new DeviceTelemetryReceivedEvent(
        payload as DeviceTelemetryReceivedEventPayload
      );
      case "device.rule.triggered": return new DeviceRuleTriggeredEvent(
        payload as DeviceTelemetryReceivedEventPayload
      );
      case "device.status.online": return new DeviceOnlineEvent(
        payload as DeviceOnlineEventPayload
      );
      case "device.status.offline": return new DeviceOfflineEvent(
        payload as DeviceOfflineEventPayload
      );
    }
  }
}
