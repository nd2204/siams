import Joi from "joi";
import JOIValidator from "../validator";
import { ListTelemetryRequest } from "@feature/device/telemetry/dtos/list-telemetry-request";
import { GroupByDateTypeConstants } from "@domain/interfaces/group-by-date";

export const listTelemetryValidator = new JOIValidator(Joi.object<ListTelemetryRequest>({
  token: Joi.string().required(),
  deviceId: Joi.string().uuid().required(),
  sensorId: Joi.string().uuid().required(),
  from: Joi.date().required(),
  to: Joi.date().required(),
  groupBy: Joi.string().valid(...Object.values(GroupByDateTypeConstants)).optional().default("day"),
  limit: Joi.number().default(50).optional()
}))
