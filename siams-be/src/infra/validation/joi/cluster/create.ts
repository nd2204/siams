import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";

export const createValidator = new JOIValidator(Joi.object({
  id: Joi.string(),
  name: Joi.string().required(),
  location: Joi.string(),
  ownerId: Joi.string().required()
}))
