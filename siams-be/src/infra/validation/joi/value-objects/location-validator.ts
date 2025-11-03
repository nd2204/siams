import Joi from "joi";
import JOIValidator from "../validator";
import { Location } from "@domain/value-objects/location";

export const locationValidator = new JOIValidator<Location>(Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
}))
