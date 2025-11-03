import { IMqttHandler } from "@domain/interfaces";
import { DeviceRegisterHandler } from "./device-register-handler";
import { RegisterDeviceUC } from "@feature/device";
import { SMLogger } from "@shared/logger";
import { services } from "@config/services";
import { DeviceStatusHandler } from "./device-status-handler";
import { ReceiveDeviceStatusUC } from "@feature/telemetry/receive-device-status";
import { DeviceTelemetryHandler } from "./device-telemetry-handler";
import { ReceiveDeviceTelemetryUC } from "@feature/telemetry/receive-device-telemetry";

export const handlers: IMqttHandler[] = [
  new DeviceRegisterHandler(
    new RegisterDeviceUC(
      services.cluster.repositories.base,
      services.device.repositories.base,
      services.device.repositories.sensors,
      services.device.repositories.actuators,
      services.device.repositories.capabilities,
      services.device.validators.registerDeviceValidator
    ),
    new SMLogger("infra:emqx:DeviceRegisterHandler"),
  ),
  new DeviceStatusHandler(
    new ReceiveDeviceStatusUC(
      services.device.repositories.base,
      services.device.repositories.status,
      services.device.validators.deviceStatusValidator
    ),
    new SMLogger("infra:emqx:DeviceStatusHandler")
  ),
  new DeviceTelemetryHandler(
    new ReceiveDeviceTelemetryUC(
      services.device.repositories.telemetry,
      services.device.repositories.sensors,
      services.device.validators.deviceTelemetryValidator,
    ),
    new SMLogger("infra:emqx:DeviceTelemetryHandler")
  )
]
