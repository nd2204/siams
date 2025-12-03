export const DeviceEventConstant = {
  registered: "device.registered",
  telemetry: "device.telemetry",
  status: "device.status",
  command: "device.command"
} as const;

export type DeviceEventType = typeof DeviceEventConstant[keyof typeof DeviceEventConstant]
