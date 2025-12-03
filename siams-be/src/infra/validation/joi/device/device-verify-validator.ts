import Joi from "joi";
import JOIValidator from "../validator";
import { DeviceVerifyPayload, DeviceVerifyRequest } from "@feature/device/dtos/device-verify-request";
import { signedPayloadValidator } from "./signed-payload-validator";

export const deviceVerifyPayloadValidator = new JOIValidator(Joi.object<DeviceVerifyPayload>({
  fw_ver: Joi.string().required()
}))

export const deviceVerifyValidator = new JOIValidator(Joi.object<DeviceVerifyRequest>({
  deviceId: Joi.string().uuid().required(),
  payload: signedPayloadValidator.getSchema().required(),
}))
