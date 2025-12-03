import Joi from "joi";
import JOIValidator from "../validator";
import { PushTelemetryPayload, PushTelemetryRequest } from "@feature/device/telemetry/dtos/push-telemetry-request";
import { signedPayloadValidator } from "../device/signed-payload-validator";

export const pushTelemetryPayloadValidator = new JOIValidator(Joi.object<PushTelemetryPayload>({
  value: Joi.number().required(),
  localId: Joi.number().required(),
  ts: Joi.date().timestamp('javascript').required()
}))

export const pushTelemetryValidator = new JOIValidator(Joi.object<PushTelemetryRequest>({
  deviceId: Joi.string().uuid().required(),
  orgId: Joi.string().uuid().required(),
  payload: signedPayloadValidator.getSchema().required(),
}))
