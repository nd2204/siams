import Joi from "joi";
import JOIValidator from "../validator";
import { DeviceVerifyPayload, DeviceVerifyRequest } from "@feature/device/dtos/device-verify-request";

export const deviceVerifyValidator = new JOIValidator(Joi.object<DeviceVerifyRequest>({
  deviceId: Joi.string().uuid().required(),
  payload: Joi.object<DeviceVerifyPayload>({
    firmwareVersion: Joi.string().required()
  }),
}))
