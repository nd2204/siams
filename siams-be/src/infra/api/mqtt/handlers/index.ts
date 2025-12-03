import { IMqttHandler } from "@domain/interfaces";
import { DeviceRegisterHandler } from "./device-register-topic-handler";
import { RegisterDeviceUC } from "@feature/device/register-device";
import { SMLogger } from "@shared/logger";
import { services } from "@config/services";
import { DeviceStatusHandler } from "./device-status-topic-handler";
import { ReceiveDeviceStatusUC } from "@feature/device/status/receive-device-status";
import { ReceiveDeviceTelemetryUC } from "@feature/device/telemetry/receive-device-telemetry";
import { DeviceVerifyHandler } from "./device-verify-topic-handler";
import { VerifyDeviceUC } from "@feature/device/verify-device";
import { DeviceTelemetryHandler } from "./device-telemetry-topic-handler";

export const handlers: IMqttHandler[] = [
  new DeviceRegisterHandler(
    new RegisterDeviceUC(
      services.cluster.repositories.base,
      services.organization.repositories.base,
      services.device.repositories.base,
      services.device.repositories.sensors,
      services.device.repositories.actuators,
      services.device.repositories.commands,
      services.cryptoService,
      services.device.services.deviceEventPublisher,
      services.device.services.signatureVerificationService,
      services.device.validators.registerDeviceValidator,
      services.device.validators.registerDevicePayloadValidator
    ),
    new SMLogger("infra:emqx:DeviceRegisterHandler")
  ),
  new DeviceStatusHandler(
    new ReceiveDeviceStatusUC(
      services.device.services.deviceEventPublisher,
      services.device.repositories.base,
      services.device.repositories.status,
      services.device.services.signatureVerificationService,
      services.device.validators.status.pushStatusPayloadValidator,
      services.device.validators.status.pushStatusValidator
    ),
    new SMLogger("infra:emqx:DeviceStatusHandler")
  ),
  new DeviceTelemetryHandler(
    new ReceiveDeviceTelemetryUC(
      services.device.repositories.telemetry,
      services.device.repositories.sensors,
      services.device.services.deviceEventPublisher,
      services.device.services.signatureVerificationService,
      services.device.validators.telemetry.pushTelemetryPayloadValidator,
      services.device.validators.telemetry.pushTelemetryValidator,
    ),
    new SMLogger("infra:emqx:DeviceTelemetryHandler")
  ),
  new DeviceVerifyHandler(
    new VerifyDeviceUC(
      services.device.repositories.base,
      // services.device.repositories.capabilities,
      services.device.services.signatureVerificationService,
      services.device.validators.deviceVerifyPayloadValidator,
      services.device.validators.deviceVerifyValidator
    ),
    new SMLogger("infra:emqx:DeviceVerifyHandler")
  )
]
