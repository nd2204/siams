import Joi from "joi";
import JOIValidator from "../validator";
import { GetAllCommandsRequest } from "@feature/device/dtos/get-all-commands-request";

export const getAllCommandsValidator = new JOIValidator(Joi.object<GetAllCommandsRequest>({
  token: Joi.string().required(),
  deviceId: Joi.string().required()
}))
