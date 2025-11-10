import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import { DeviceSensor, SensorType } from "@domain/entities/device-sensor";
import { RegisterDevicePayload, RegisterDeviceRequest } from "@feature/device/dtos/register-device-request";
import { ActuatorType, DeviceActuator } from "@domain/entities/device-actuator";
import { locationValidator } from "../value-objects/location-validator";
import { CommandDesc } from "@domain/value-objects/command";
import { DeviceCommand } from "@domain/entities";

const command_desc_validator = Joi.object<CommandDesc>({
  action: Joi.string().required(),
  params: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    enums: Joi.array().items(Joi.string()).optional()
  })).optional(),
})

const command_validator = Joi.object<DeviceCommand>({
  name: Joi.string().optional(),
  type: Joi.string().optional(),
  localId: Joi.number().required(),
  commands: Joi.array().items(command_desc_validator).optional()
})

export const registerDeviceValidator = new JOIValidator<RegisterDeviceRequest>(Joi.object({
  orgId: Joi.string().uuid().required(),
  clusterId: Joi.string().uuid().required(),
  payload: Joi.object<RegisterDevicePayload>({
    name: Joi.string().optional(),
    model: Joi.string().required(),
    location: locationValidator.getSchema().required(),
    firmwareVersion: Joi.string().required(),
    capabilities: Joi.object({
      sensors: Joi.array().items(Joi.object<DeviceSensor>({
        localId: Joi.number().required(),
        type: Joi.string<SensorType>().required(),
        name: Joi.string().required(),
        unit: Joi.string().required(),
      })).optional(),
      actuators: Joi.array().items(Joi.object<DeviceActuator>({
        localId: Joi.number().required(),
        name: Joi.string().required(),
        type: Joi.string<ActuatorType>().required(),
      })).optional(),
      commands: Joi.array().items(command_validator).optional()
    })
  })
}))
