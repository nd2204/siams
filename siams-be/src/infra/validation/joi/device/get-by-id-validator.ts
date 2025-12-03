import Joi from "joi";
import JOIValidator from "../validator";
import { GetDeviceByIdRequest } from "@feature/device/dtos/get-by-id-request";

export const getDeviceByIdValidator = new JOIValidator(Joi.object<GetDeviceByIdRequest>({
  token: Joi.string().required(),
  deviceId: Joi.string().required()
}))
