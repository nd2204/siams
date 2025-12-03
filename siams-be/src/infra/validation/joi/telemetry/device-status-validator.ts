import Joi from "joi";
import JOIValidator from "../validator";
import {
  PushStatusPayload,
  PushStatusRequest
} from "@feature/device/dtos";
import { signedPayloadValidator } from "../device/signed-payload-validator";

export const pushStatusPayloadValidator = new JOIValidator(Joi.object<PushStatusPayload>({
  cpu: Joi.number().min(0).max(1).optional(),
  mem: Joi.number().min(0).max(1).optional(),
  wifi: Joi.number().optional(),
  online: Joi.boolean().required(),
  ts: Joi.date().timestamp('javascript').required()
}))

export const pushStatusValidator = new JOIValidator(Joi.object<PushStatusRequest>({
  deviceId: Joi.string().uuid().required(),
  orgId: Joi.string().uuid().required(),
  payload: signedPayloadValidator.getSchema().required(),
}))
