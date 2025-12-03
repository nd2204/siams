import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import { DeviceSensor, SensorType } from "@domain/entities/device-sensor";
import { ActuatorType, DeviceActuator } from "@domain/entities/device-actuator";
import { latValidator, lonValidator } from "../value-objects/location-validator";
import { CommandDesc } from "@domain/value-objects/command";
import { DeviceCommand } from "@domain/entities";
import {
  DeviceRegisterRequest,
  DeviceRegisterPayload,
} from "@feature/device/dtos/device-register-request";
import { SigningMethodConstants } from "@feature/device/dtos";

const sensor_capability_validator = Joi.object<DeviceSensor>({
  local_id: Joi.number().required(),
  type: Joi.string<SensorType>().required(),
  name: Joi.string().required(),
  unit: Joi.string().required(),
})

const actuator_capability_validator = Joi.object<DeviceActuator>({
  local_id: Joi.number().required(),
  name: Joi.string().required(),
  type: Joi.string<ActuatorType>().required(),
})

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
  local_id: Joi.number().required(),
  commands: Joi.array().items(command_desc_validator).optional()
})

export const registerDevicePayloadValidator = new JOIValidator(Joi.object<DeviceRegisterPayload>({
  name: Joi.string().optional(),
  hw_id: Joi.string().required(),
  model: Joi.string().required(),
  lat: latValidator.required(),
  lon: lonValidator.required(),
  fw_ver: Joi.string().required(),
  signing: Joi.string().valid(...Object.values(SigningMethodConstants)).required(),
  pubkey: Joi.string().when("signing", {
    is: "ecdsa",
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  }),
  cluster_id: Joi.string().uuid().optional(),
  sensors: Joi.array().items(sensor_capability_validator).optional(),
  actuators: Joi.array().items(actuator_capability_validator).optional(),
  commands: Joi.array().items(command_validator).optional(),
}))

export const registerDeviceValidator = new JOIValidator<DeviceRegisterRequest>(Joi.object({
  orgId: Joi.string().uuid().required(),
  payload: Joi.any().required(),
}))
