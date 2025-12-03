import Joi from "joi";
import JOIValidator from "../validator";
import { GetAllActuatorsRequest } from "@feature/device/actuator/dtos/get-all-actuators-request";

export const getAllActuatorsValidator = new JOIValidator(Joi.object<GetAllActuatorsRequest>({
  token: Joi.string().required(),
  deviceId: Joi.string().required()
}))
