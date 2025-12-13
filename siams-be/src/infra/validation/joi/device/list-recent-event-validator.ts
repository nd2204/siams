import Joi from "joi";
import JOIValidator from "../validator";
import { ListRecentDeviceEventRequest } from "@feature/device/dtos";

export const listRecentDeviceEventValidator = new JOIValidator(Joi.object<ListRecentDeviceEventRequest>({
  token: Joi.string().required(),
  device_id: Joi.string().required(),
  perBucket: Joi.number().min(1).optional()
}))
