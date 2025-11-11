import Joi from "joi";
import JOIValidator from "../validator";
import { GetAllSensorsRequest } from "@feature/device/dtos/get-all-sensors-request";

export const getAllSensorsValidator = new JOIValidator(Joi.object<GetAllSensorsRequest>({
  token: Joi.string().required(),
  deviceId: Joi.string().required()
}))
