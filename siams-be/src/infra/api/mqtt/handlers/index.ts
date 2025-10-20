import { IMqttHandler } from "@domain/interfaces";
import { DeviceRegisterHandler } from "./device-register-handler";
import { RegisterDeviceUC } from "@feature/device";
import { SMLogger } from "@shared/logger";
import { services } from "@config/services";

export const handlers: IMqttHandler[] = [
  new DeviceRegisterHandler(
    new RegisterDeviceUC(
      services.device.repository,
      services.cluster.repository,
      services.device.validators.registerDeviceValidator
    ),
    new SMLogger("infra:emqx:DeviceRegisterHandler"),
  )
]
