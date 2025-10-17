import Joi from "joi";
import JOIValidator from "@infra/validation/joi/validator";
import { CreateOrganizationRequest } from "@feature/organization/dtos";

export const createOrganizationValidator = new JOIValidator<CreateOrganizationRequest>(Joi.object({
  name: Joi.string().required(),
  userId: Joi.string().uuid().required()
}))
