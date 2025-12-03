import Joi from "joi";
import JOIValidator from "../validator";
import { PublishDeviceEventRequest } from "@domain/services/device-event-publisher";
import { DeviceEventTypeConstants } from "@domain/entities/device-event";

export const publishDeviceEventValidator = new JOIValidator(Joi.object<PublishDeviceEventRequest>({
  device_id: Joi.string().uuid().required(),
  org_id: Joi.string().uuid().required(),
  store_event: Joi.boolean().required(),
  cluster_id: Joi.string().uuid().optional(),
  event_type: Joi.string().valid(...Object.values(DeviceEventTypeConstants)).required(),
  event_payload: Joi.any().required(),
  raw_payload: Joi.when('store_event', {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  })
}))
