import Joi from "joi";
import JOIValidator from "../validator";
import { DeviceCommandPayload, DeviceSendCommandRequest } from "@feature/device/dtos/device-send-command-request";

export const deviceSendCommandValidator = new JOIValidator(Joi.object<DeviceSendCommandRequest>({
  token: Joi.string().required(),
  deviceId: Joi.string().uuid(),
  payload: Joi.object<DeviceCommandPayload>({
    localId: Joi.number().required(),
    action: Joi.string(),
    params: Joi.object().pattern(Joi.string(), Joi.alternatives(
      Joi.number(),
      Joi.string(),
      Joi.boolean()
    ))
  }).required(),
}))
