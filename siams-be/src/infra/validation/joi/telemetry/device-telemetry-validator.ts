import Joi from "joi";
import JOIValidator from "../validator";
import { DeviceTelemetryPayload, DeviceTelemetryRequest } from "@feature/telemetry/dtos/device-telemetry-request";

export const deviceTelemetryValidator = new JOIValidator<DeviceTelemetryRequest>(Joi.object({
  deviceId: Joi.string().uuid().required(),
  payload: Joi.object<DeviceTelemetryPayload>({
    value: Joi.number().required(),
    localId: Joi.number().required(),
    ts: Joi.number().required()
  }).required(),
}))
