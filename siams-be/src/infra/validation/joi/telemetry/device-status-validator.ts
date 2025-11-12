import Joi from "joi";
import JOIValidator from "../validator";
import { DeviceStatusPayload, DeviceStatusRequest } from "@feature/telemetry/dtos/device-status-request";

export const deviceStatusValidator = new JOIValidator<DeviceStatusRequest>(Joi.object({
  deviceId: Joi.string().uuid().required(),
  payload: Joi.object<DeviceStatusPayload>({
    cpu: Joi.number().min(0).max(1).optional(),
    mem: Joi.number().min(0).max(1).optional(),
    wifi: Joi.number().optional(),
    online: Joi.boolean().required(),
    ts: Joi.number().required()
  }).required(),
}))
