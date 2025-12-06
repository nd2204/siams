import Joi from "joi";
import JOIValidator from "../validator";
import { ListRecentDeviceEventRequest } from "@feature/device/dtos";

export const listRecentDeviceEventValidator = new JOIValidator(Joi.object<ListRecentDeviceEventRequest>({
  token: Joi.string().required(),
  device_id: Joi.string().required(),
  page: Joi.number().min(1).optional(),
  perPage: Joi.number().min(1).optional()
}))
