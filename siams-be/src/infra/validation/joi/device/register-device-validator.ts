import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import { SensorType } from "@domain/entities/device-sensor";
import { RegisterDevicePayload, RegisterDeviceRequest } from "@feature/device/dtos/register-device-request";
import { ActuatorCapability, CommandCapability, SensorCapability } from "@domain/entities/device-capabilities";
import { ActuatorType } from "@domain/entities/device-actuator";
import { locationValidator } from "../value-objects/location-validator";

/* TODO: device validation */
export const registerDeviceValidator = new JOIValidator<RegisterDeviceRequest>(Joi.object({
  orgId: Joi.string().uuid().required(),
  clusterId: Joi.string().uuid().required(),
  payload: Joi.object<RegisterDevicePayload>({
    name: Joi.string().optional(),
    model: Joi.string().required(),
    location: locationValidator.getSchema(),
    firmwareVersion: Joi.string().required(),
    capabilities: Joi.object({
      sensors: Joi.array().items(Joi.object<SensorCapability>({
        localId: Joi.number().required(),
        type: Joi.string<SensorType>().required(),
        unit: Joi.string().required()
      })).optional(),
      actuators: Joi.array().items(Joi.object<ActuatorCapability>({
        localId: Joi.number().required(),
        type: Joi.string<ActuatorType>().required(),
      })).optional(),
      commands: Joi.array().items(Joi.object<CommandCapability>({
        action: Joi.string().required(),
        params: Joi.array<string[]>().optional(),
      })).optional()
    })
  })
}))
