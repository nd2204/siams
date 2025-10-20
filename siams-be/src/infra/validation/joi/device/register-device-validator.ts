import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import { DeviceCapabilites, RegisterDevicePayload, RegisterDeviceRequest } from "@feature/device/dtos/register-device-request";
import { SensorType } from "@domain/entities/sensor";

/* TODO: device validation */
export const registerDeviceValidator = new JOIValidator<RegisterDeviceRequest>(Joi.object({
  orgId: Joi.string().uuid().required(),
  clusterId: Joi.string().uuid().required(),
  payload: Joi.object<RegisterDevicePayload>({
    name: Joi.string().optional(),
    model: Joi.string().required(),
    firmwareVersion: Joi.string().required(),
    capabilities: Joi.object<DeviceCapabilites>({
      sensors: Joi.array<SensorType>().optional(),
      actuators: Joi.array<string>().optional()
    })
  })
}))
