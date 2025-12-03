import Joi from "joi";
import JOIValidator from "../validator";
import { GetDeviceStatusRequest } from "@feature/device/dtos";

export const getDeviceStatusValidator = new JOIValidator(Joi.object<GetDeviceStatusRequest>({
  token: Joi.string().required(),
  device_id: Joi.string().uuid().required()
}))
